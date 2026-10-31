/* eslint-disable @typescript-eslint/no-require-imports -- Isolated interactive component regression harness. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const messages = Object.fromEntries(['en', 'vi'].map(locale => [locale, JSON.parse(fs.readFileSync(`src/messages/${locale}.json`, 'utf8'))]));
const jsx = (type, props) => ({ type, props });
function find(node, predicate) {
  if (!node || typeof node !== 'object') return undefined;
  if (predicate(node)) return node;
  for (const child of Object.values(node.props ?? {}).flat(Infinity)) {
    const found = find(child, predicate);
    if (found) return found;
  }
}
function translator(locale, namespace = '') {
  return (key, values = {}) => {
    const text = `${namespace}.${key}`.replace(/^\./, '').split('.').reduce((value, field) => value?.[field], messages[locale]);
    return typeof text === 'string' ? text.replace(/\{(\w+)\}/g, (_, field) => values[field] ?? `{${field}}`) : key;
  };
}
function loadComponent(path, mocks) {
  const states = [], components = {};
  let cursor = 0;
  const ref = initial => {
    const i = cursor++;
    if (!(i in states)) states[i] = { current: initial };
    return states[i];
  };
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in states)) states[i] = typeof initial === 'function' ? initial() : initial;
      return [states[i], value => { states[i] = typeof value === 'function' ? value(states[i]) : value; }];
    },
    useMemo: fn => fn(), useDeferredValue: value => value, useRef: ref,
    ...mocks.react,
  };
  const exports = {};
  const component = name => components[name] ??= Object.assign(() => null, { componentName: name });
  const output = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(output, {
    exports, document: { body: {}, cookie: '' },
    require(name) {
      if (name === 'react') return react;
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'fragment' };
      const mock = mocks.require(name);
      if (mock !== undefined) return mock;
      return new Proxy({}, { get: (_, key) => key === '__esModule' ? true : component(key) });
    },
  });
  return name => { cursor = 0; return exports[name]({}); };
}

function directory() {
  let employees = Array.from({ length: 23 }, (_, i) => ({ id: String(i + 1), fullName: `NHÂN VIÊN ${i + 1}`, position: '', email: '' }));
  let search = '';
  const render = loadComponent('src/views/AdminEmployeesView.tsx', {
    require(name) {
      if (name === 'next-intl') return { useTranslations: namespace => translator('en', namespace) };
      if (name.endsWith('/useEmployees')) return { useEmployees: () => ({ employees, ready: true }) };
      if (name.endsWith('/employee.store')) return { useEmployeeStore: selector => selector({ employeeSearch: search, setEmployeeSearch: value => { search = value; } }) };
      if (name.endsWith('/slugify')) return { slugify: value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() };
    },
  });
  const tree = () => render('AdminEmployeesView');
  return {
    page: () => find(tree(), node => node.type?.componentName === 'EmployeePagination').props,
    rows: () => find(tree(), node => node.type?.componentName === 'EmployeeTable').props.employees,
    search(value) { find(tree(), node => node.type === 'input').props.onChange({ target: { value } }); },
    keep(count) { employees = employees.slice(0, count); },
  };
}

test('employee directory renders 10 rows per page and numbered pages cover all 23 employees', () => {
  const h = directory();
  assert.equal(h.page().pageSize, 10);
  assert.equal(h.page().total, 23);
  assert.equal(h.rows().length, 10);
  assert.equal(h.rows()[0].id, '1');
  h.page().onPageChange(2);
  assert.equal(h.rows().length, 10);
  assert.equal(h.rows()[0].id, '11');
  h.page().onPageChange(3);
  assert.equal(h.rows().length, 3);
  assert.equal(h.rows()[0].id, '21');
});

test('directory search resets to page 1; deleting the last page clamps the page; empty results are valid', () => {
  const h = directory();
  h.page().onPageChange(3);
  h.search('nhan vien 1');
  assert.equal(h.page().page, 1);
  assert.equal(h.page().total, 11);
  assert.equal(h.rows().length, 10);
  h.page().onPageChange(2);
  h.search('');
  assert.equal(h.page().page, 1);
  h.page().onPageChange(3);
  h.keep(20);
  assert.equal(h.page().page, 2);
  assert.equal(h.rows().length, 10);
  h.keep(0);
  assert.equal(h.page().page, 1);
  assert.equal(h.page().total, 0);
  assert.equal(h.rows().length, 0);
});

function languageSwitch(initialLocale) {
  let locale = initialLocale, pending = 0, calls = 0, refreshes = 0, resolve, reject;
  const tasks = [];
  const action = new Promise((done, fail) => { resolve = done; reject = fail; });
  const render = loadComponent('src/client/components/ui/LanguageSwitcher.tsx', {
    react: {
      useContext: () => ({ refresh() { refreshes++; } }),
      useTransition: () => [pending > 0, callback => {
        pending++;
        tasks.push(Promise.resolve(callback()).finally(() => { pending--; }));
      }],
    },
    require(name) {
      if (name === 'next-intl') return { useLocale: () => locale, useTranslations: namespace => translator(locale, namespace) };
      if (name === 'react-dom') return { createPortal: children => jsx('portal', { children }) };
      if (name.endsWith('/i18n/config')) return { locales: ['en', 'vi'], LOCALE_COOKIE: 'NEXT_LOCALE', LOCALE_COOKIE_MAX_AGE: 31536000, resolveLocale: value => ['en', 'vi'].includes(value) ? value : 'en' };
      if (name.endsWith('/i18n/actions')) return { setLocaleCookie() { calls++; return action; } };
      if (name.endsWith('/I18nProvider')) return { writeClientLocale() {}, useClientLocaleSwitch: () => ({ locale, setLocale: next => { locale = next; } }) };
      if (name.endsWith('/cn')) return { cn: (...values) => values.filter(Boolean).join(' ') };
    },
  });
  return { tree: () => render('LanguageSwitcher'), calls: () => calls, refreshes: () => refreshes,
    select(next) { const button = find(render('LanguageSwitcher'), node => node.props?.['data-locale'] === next); button.props.onClick(); },
    async finish(fail = false) { if (fail) reject(new Error('offline')); else resolve(); await Promise.all(tasks); },
  };
}

test('language switch shows loading for the full async change and prevents duplicate requests', async () => {
  const h = languageSwitch('vi');
  h.select('en');
  h.select('vi');
  assert.equal(h.calls(), 1);
  const pending = h.tree();
  assert.equal(pending.props['aria-busy'], true);
  assert.equal(find(pending, node => node.props?.['data-locale'] === 'vi').props.disabled, true);
  assert.ok(find(pending, node => node.props?.role === 'status').props.children.includes('Changing language…'));
  await h.finish();
  assert.equal(h.tree().props['aria-busy'], false);
  assert.equal(find(h.tree(), node => node.props?.role === 'status'), undefined);
  assert.equal(h.refreshes(), 1);
});

test('Vietnamese loading message clears and controls recover when the server cookie request fails', async () => {
  const h = languageSwitch('en');
  h.select('vi');
  assert.ok(find(h.tree(), node => node.props?.role === 'status').props.children.includes('Đang đổi ngôn ngữ…'));
  await h.finish(true);
  assert.equal(h.tree().props['aria-busy'], false);
  assert.equal(find(h.tree(), node => node.props?.['data-locale'] === 'vi').props['aria-pressed'], true);
  assert.equal(h.refreshes(), 1);
});
