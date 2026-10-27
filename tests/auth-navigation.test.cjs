/* eslint-disable @typescript-eslint/no-require-imports -- Isolated hook lifecycle regression harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function harness(component, { authenticated = true, initialUser = null } = {}) {
  const state = { ready: true, authenticated, user: authenticated ? { id: 'admin' } : null };
  let finish, fail;
  const restoring = new Promise((resolve, reject) => { finish = resolve; fail = reject; });
  const values = [], dependencies = [], effects = [], navigations = [];
  let cursor = 0, restores = 0;
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in values)) values[i] = typeof initial === 'function' ? initial() : initial;
      return [values[i], value => { values[i] = value; }];
    },
    useEffect(effect, deps) {
      const i = cursor++;
      if (!dependencies[i] || deps.some((value, j) => value !== dependencies[i][j])) {
        dependencies[i] = deps;
        effects.push(effect);
      }
    },
  };
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, `../src/client/components/${component}.tsx`), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const element = (type, props) => ({ type, props });
  const dummy = () => null;
  vm.runInNewContext(code, {
    exports,
    window: { location: { replace: target => navigations.push(target) } },
    document: { addEventListener() {}, removeEventListener() {} },
    localStorage: { setItem() {} },
    require(name) {
      if (name === 'react') return react;
      if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element, Fragment: 'fragment' };
      if (name.endsWith('/useAuth')) return {
        useAuth: () => ({ ...state, login: async () => {} }),
        restoreSession: () => { restores++; return restoring; },
        hydrateAuthUser: user => Object.assign(state, { ready: true, authenticated: true, user }),
        shouldCheckSessionOnVisibility: () => false,
      };
      if (name.endsWith('/auth.store')) return { useAuthStore: { getState: () => state } };
      if (name.endsWith('/useAos')) return { useAos() {} };
      if (name.endsWith('/Toast')) return { useToast: () => dummy };
      return new Proxy({}, { get: (_, key) => key === '__esModule' ? true : dummy });
    },
  });
  const name = component.split('/').pop();
  return {
    state, navigations,
    renders() { cursor = 0; return exports[name]({ initialUser, children: 'protected-content' }); },
    flush() { effects.splice(0).forEach(effect => effect()); },
    restores: () => restores,
    async resolve(authenticated) {
      Object.assign(state, { ready: true, authenticated, user: authenticated ? { id: 'admin' } : null });
      finish();
      await new Promise(resolve => setImmediate(resolve));
    },
    async reject() { fail(new TypeError('offline')); await new Promise(resolve => setImmediate(resolve)); },
  };
}

test('login does not bounce a stale authenticated store back to admin', async () => {
  const h = harness('auth/LoginView');
  const form = h.renders();
  assert.equal(form.type, 'main');
  h.flush();
  assert.equal(h.restores(), 1);
  assert.deepEqual(h.navigations, []);
  await h.resolve(false);
  assert.equal(h.renders().type, 'main');
  h.flush();
  assert.deepEqual(h.navigations, []);
});

test('login verifies cookies even without a client login hint and then navigates once', async () => {
  const h = harness('auth/LoginView', { authenticated: false });
  h.renders(); h.flush();
  await h.resolve(true);
  h.renders(); h.flush();
  assert.deepEqual(h.navigations, ['/admin']);
});

test('login keeps the form available on a temporary verification failure', async () => {
  const h = harness('auth/LoginView');
  h.renders(); h.flush();
  await h.reject();
  assert.equal(h.renders().type, 'main');
  h.flush();
  assert.deepEqual(h.navigations, []);
});

test('admin waits for refresh despite stale client state and redirects when no session remains', async () => {
  const h = harness('layout/AuthGuard');
  assert.notEqual(h.renders().props.children, 'protected-content');
  h.flush();
  assert.equal(h.restores(), 1);
  await h.resolve(false);
  assert.notEqual(h.renders().props.children, 'protected-content');
  h.flush();
  assert.deepEqual(h.navigations, ['/login']);
});

test('admin releases protected children only after successful refresh', async () => {
  const h = harness('layout/AuthGuard');
  h.renders(); h.flush();
  await h.resolve(true);
  assert.equal(h.renders().props.children, 'protected-content');
  h.flush();
  assert.deepEqual(h.navigations, []);
});
