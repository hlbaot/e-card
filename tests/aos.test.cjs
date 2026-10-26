/* eslint-disable @typescript-eslint/no-require-imports -- Isolated browser lifecycle harness. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/client/hooks/useAos.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;

function harness({ hidden = false, reduced = false, fail = false } = {}) {
  let effect, frame = 0, layouts = 0;
  const frames = new Map(), listeners = new Map(), classes = new Set(), calls = [];
  const node = { classList: { add: (...values) => values.forEach(value => classes.add(value)), remove: (...values) => values.forEach(value => classes.delete(value)) } };
  const document = {
    visibilityState: hidden ? 'hidden' : 'visible',
    querySelectorAll: () => [node],
    body: { get offsetHeight() { layouts++; return 800; } },
    addEventListener: (name, cb) => listeners.set(name, cb),
    removeEventListener: (name, cb) => { if (listeners.get(name) === cb) listeners.delete(name); },
  };
  const aos = {
    init: options => { calls.push(['init', options]); if (fail) throw Error('AOS failed'); },
    refreshHard: () => calls.push(['refreshHard']),
    refresh: initialize => { calls.push(['refresh', initialize]); classes.add('aos-animate'); },
  };
  const context = {
    exports: {}, document,
    require: name => name === 'react' ? { useLayoutEffect: cb => { effect = cb; } } : name === 'aos' ? aos : {},
    window: { matchMedia: () => ({ matches: reduced }) },
    requestAnimationFrame: cb => { frames.set(++frame, cb); return frame; },
    cancelAnimationFrame: id => frames.delete(id),
    console: { error: () => {} },
  };
  vm.runInNewContext(code, context);
  return {
    calls, classes, listeners, document,
    layouts: () => layouts,
    mount: key => { context.exports.useAos(true, key); return effect(); },
    paint: () => { const current = [...frames.values()]; frames.clear(); current.forEach(cb => cb()); },
    visibility: value => { document.visibilityState = value; listeners.get('visibilitychange')?.(); },
  };
}

test('new background tabs wait until visible; initial animation styles are committed before AOS starts', () => {
  const h = harness({ hidden: true });
  const cleanup = h.mount('first');
  h.paint(); assert.equal(h.calls.length, 0);
  h.visibility('visible');
  assert.equal(h.calls[0][0], 'init');
  assert.equal(h.calls[0][1].startEvent, 'ecard:animations-ready');
  assert.ok(h.classes.has('aos-init'));
  assert.ok(h.classes.has('aos-preparing'), 'initial styles must snap into place without a reverse transition');
  assert.ok(!h.classes.has('aos-animate'));
  assert.equal(h.layouts(), 1);
  h.paint();
  assert.ok(!h.classes.has('aos-preparing'), 'restore transitions before revealing');
  assert.equal(h.calls[1][0], 'refreshHard');
  assert.deepEqual(h.calls[2], ['refresh', true]);
  assert.ok(h.classes.has('aos-animate'));
  cleanup(); assert.equal(h.listeners.size, 0);
});

test('switching away during preparation restores readable content and retries on return', () => {
  const h = harness(); const cleanup = h.mount();
  h.visibility('hidden'); h.paint();
  assert.ok(!h.classes.has('aos-init'));
  assert.ok(!h.classes.has('aos-preparing'));
  assert.equal(h.calls.length, 1);
  h.visibility('visible'); h.paint(); h.paint();
  assert.ok(h.classes.has('aos-animate'));
  cleanup();
});

test('unmount cancels queued work; opening another profile refreshes its elements without initializing twice', () => {
  const h = harness(); let cleanup = h.mount('one');
  cleanup(); h.paint();
  assert.ok(!h.classes.has('aos-init'));
  assert.equal(h.calls.length, 1);
  cleanup = h.mount('two'); h.paint(); h.paint();
  assert.equal(h.calls.filter(([name]) => name === 'init').length, 1);
  assert.ok(h.classes.has('aos-animate')); cleanup();
});

test('reduced motion and initialization errors leave the page readable', () => {
  for (const options of [{ reduced: true }, { fail: true }]) {
    const h = harness(options), cleanup = h.mount();
    h.paint(); h.paint();
    assert.ok(!h.classes.has('aos-init'));
    assert.ok(h.classes.has('aos-animate'), 'errors must reveal even cards whose SSR entrance state is hidden');
    if (options.reduced) assert.equal(h.calls.length, 0);
    cleanup();
  }
});
