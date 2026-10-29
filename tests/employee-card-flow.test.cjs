/* eslint-disable @typescript-eslint/no-require-imports -- Isolated form lifecycle regression harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function harness(existing = false) {
  const states = [], writes = [], navigations = [];
  let cursor = 0;
  const employee = {
    id: 'saved-employee', slug: 'saved-slug', fullName: 'Test Employee', phone: '0917895579',
    email: 'test@example.com', position: 'Editor', company: '', companyShort: '', avatarUrl: '',
    website: '', slogan: '', zalo: '', offices: [], isActive: true, allowIndexing: false,
    publicFields: {}, theme: { templateId: 'bubble-blue', primaryColor: '#0F4C75', shapes: {}, decor: [] },
    createdAt: '', updatedAt: '',
  };
  const components = {};
  const component = name => components[name] ??= Object.assign(() => null, { componentName: name });
  const mutations = Object.fromEntries(['create', 'update', 'uploadAvatar'].map(name => [name, async (...args) => {
    writes.push({ name, args });
    return { ...employee, ...args.at(-1) };
  }]));
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync('src/client/components/admin/EmployeeForm.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, structuredClone, document: { getElementById: () => null },
    require(name) {
      if (name === 'react') return {
        useState(initial) { const i = cursor++; if (!(i in states)) states[i] = typeof initial === 'function' ? initial() : initial;
          return [states[i], value => { states[i] = typeof value === 'function' ? value(states[i]) : value; }]; },
        useMemo: fn => fn(), useCallback: fn => fn, useRef: () => ({ current: null }), useDeferredValue: value => value,
      };
      if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }), Fragment: 'fragment' };
      if (name === 'next/dynamic') return { default: () => component('dynamic') };
      if (name === 'next/navigation') return { useRouter: () => ({ push: path => navigations.push(path), refresh() {} }) };
      if (name.endsWith('/useEmployeeMutations')) return { useEmployeeMutations: () => mutations };
      if (name.endsWith('/Toast')) return { useToast: () => () => {} };
      if (name.endsWith('/migrate-theme')) return { migrateCardTheme: value => value };
      if (name.endsWith('/phone')) return { normalizePhone: value => value.replace(/\s/g, ''), formatPhone: value => value };
      if (name.endsWith('/types')) return { DEFAULT_PUBLIC_FIELDS: {}, getPublicFields: () => ({}) };
      return new Proxy({}, { get: (_, key) => key === '__esModule' ? true : component(key) });
    },
  });
  function render() { cursor = 0; return exports.EmployeeForm({ employee: existing ? employee : undefined }); }
  render();
  states[0] = { ...employee };
  function find(tree, name) {
    if (!tree || typeof tree !== 'object') return null;
    if (tree.type?.componentName === name) return tree;
    const children = Array.isArray(tree.props?.children) ? tree.props.children.flat(Infinity) : [tree.props?.children];
    for (const child of children) { const found = find(child, name); if (found) return found; }
    return null;
  }
  function findNode(tree, predicate) {
    if (!tree || typeof tree !== 'object') return null;
    if (predicate(tree)) return tree;
    for (const value of Object.values(tree.props ?? {}).flat(Infinity)) {
      const result = findNode(value, predicate);
      if (result) return result;
    }
    return null;
  }
  return { render, writes, navigations, find,
    patch(values) { states[0] = { ...states[0], ...values }; },
    saveButton() { return findNode(render(), node => node.type === 'button' && node.props.type === 'submit'); },
    chooseCard(label) { findNode(render(), node => node.type === 'button' && node.props.children === label).props.onClick(); },
    async submit() {
    await find(render(), 'EmployeeFormLayout').props.onSubmit({ preventDefault() {} });
  } };
}

test('opening the card picker and going back never creates an employee or selects QTM implicitly', async () => {
  const h = harness();
  await h.submit();
  const picker = h.find(h.render(), 'BusinessCardPicker');
  assert.equal(picker.props.isNew, true);
  assert.equal(h.writes.length, 0);
  picker.props.onClose();
  assert.equal(h.find(h.render(), 'BusinessCardPicker'), null);
  assert.equal(h.writes.length, 0);
  assert.equal(h.navigations.length, 0);
});

for (const type of ['qtm', 'an-ninh-mang']) {
  test(`confirmation creates exactly one employee with explicit ${type} choice`, async () => {
    const h = harness();
    await h.submit();
    await h.find(h.render(), 'BusinessCardPicker').props.onSave(type);
    assert.equal(h.writes.length, 1);
    assert.equal(h.writes[0].name, 'create');
    assert.equal(h.writes[0].args[0].theme.businessCardType, type);
    assert.equal(h.navigations[0], '/admin/employees/saved-employee');
  });
}

test('normal edits update the existing employee without creating a duplicate', async () => {
  const h = harness(true);
  h.patch({ position: 'Updated role' });
  await h.submit();
  assert.equal(h.writes.length, 1);
  assert.equal(h.writes[0].name, 'update');
  assert.equal(h.writes[0].args[0], 'saved-employee');
});


test('save is disabled on entry and when edits are reverted; unchanged submit performs no write', async () => {
  const h = harness(true);
  assert.equal(h.saveButton().props.disabled, true);
  await h.submit();
  assert.equal(h.writes.length, 0);
  h.patch({ position: 'New role' });
  assert.equal(h.saveButton().props.disabled, false);
  h.patch({ position: 'Editor' });
  assert.equal(h.saveButton().props.disabled, true);
  h.patch({ phone: '0917 895 579' });
  assert.equal(h.saveButton().props.disabled, true);
});

test('saving changes resets the dirty baseline and tracks nested office changes', async () => {
  const h = harness(true);
  h.patch({ offices: [{ label: 'Office', address: 'Hanoi' }] });
  assert.equal(h.saveButton().props.disabled, false);
  await h.submit();
  assert.equal(h.saveButton().props.disabled, true);
  await h.submit();
  assert.equal(h.writes.length, 1);
});

test('an existing employee can switch QTM to An ninh mang and back, preserving identity', async () => {
  const h = harness(true);
  h.chooseCard('An ninh mạng');
  assert.equal(h.saveButton().props.disabled, false);
  await h.submit();
  assert.equal(h.writes[0].name, 'update');
  assert.equal(h.writes[0].args[0], 'saved-employee');
  assert.equal(h.writes[0].args[1].theme.businessCardType, 'an-ninh-mang');
  assert.equal(h.saveButton().props.disabled, true);
  h.chooseCard('QTM');
  assert.equal(h.saveButton().props.disabled, false);
  await h.submit();
  assert.equal(h.writes[1].args[1].theme.businessCardType, 'qtm');
  assert.equal(h.writes[1].args[1].slug, 'saved-slug');
  assert.equal(h.saveButton().props.disabled, true);
});
