/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS harness registers a TypeScript loader before requiring the services. */
/* Integration smoke tests against the real TypeScript services, isolated in memory. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return resolve.call(
    this,
    request.startsWith("@/")
      ? path.join(root, "src", request.slice(2))
      : request,
    ...args,
  );
};
const loadTypeScript = function (module, filename) {
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(output.outputText, filename);
};
require.extensions[".ts"] = loadTypeScript;
require.extensions[".tsx"] = loadTypeScript;
require.extensions[".css"] = () => {};
const storage = new Map();
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  },
});
global.window = { localStorage: global.localStorage };
async function main() {
  const { slugify } = require("../src/shared/utils/slugify.ts");
  const { createVCard, websiteUrl } = require("../src/shared/utils/vcard.ts");
  const {
    employeeService: service,
  } = require("../src/client/services/employee.service.ts");
  const {
    useEmployeeStore: store,
  } = require("../src/client/store/employee.store.ts");
  const { authService } = require("../src/client/services/auth.service.ts");
  const { useAuthStore } = require("../src/client/store/auth.store.ts");
  assert.equal(slugify("  Đặng Thị Ánh!  "), "dang-thi-anh");
  await store.persist.rehydrate();
  const employees = await service.getAll();
  const { localizeEmployee } = require("../src/shared/utils/localize.ts");
  const {
    contrastText,
    readableAccent,
    contrastRatio,
  } = require("../src/shared/utils/color.ts");
  const {
    templates,
    backgrounds,
    colorPresets,
  } = require("../src/shared/constants/card-themes.ts");
  const { cardUrl } = require("../src/shared/utils/qr.ts");
  const localized = localizeEmployee(employees[3]);
  assert.equal(localized.fullName, "NGUYỄN HOÀNG LONG");
  assert.equal(localized.slug, employees[3].slug);
  assert.equal(localized.offices[0].label, "Trụ sở chính");
  assert.equal(employees[3].fullName, "NGUYEN HOANG LONG");
  const custom = {
    ...employees[3],
    fullName: "Bảo Toàn",
    position: "PM",
    slogan: "Nội dung riêng",
  };
  assert.equal(localizeEmployee(custom).fullName, custom.fullName);
  assert.equal(localizeEmployee(custom).position, custom.position);
  assert.equal(localizeEmployee(custom).slogan, custom.slogan);
  const { migrateCardTheme } = require("../src/shared/utils/migrate-theme.ts");
  const { decorOptions } = require("../src/shared/constants/card-themes.ts");
  assert.deepEqual(decorOptions.map((option) => option.id), ["none", "blobs", "circles", "skyline", "waves", "bokeh"]);
  for (const templateId of ["bubble-blue", "dark-tech"]) {
    for (const pattern of ["dot", "dots", "grid", "diagonal", "art-deco", "plus", "crosses", "lines", "checks", "diamonds", "leaf", "leaf-dots", "none"]) {
      for (const field of ["pattern", "patternId"]) {
        const legacy = { ...employees[0].theme, templateId, backgroundId: templateId === "dark-tech" ? "night-navy" : "sky-soft", decorOpacity: 100, [field]: pattern };
        delete legacy.decor;
        const migrated = migrateCardTheme(legacy);
        assert.deepEqual(migrated.decor, pattern === "none" ? [] : [templateId === "dark-tech" ? "circles" : "blobs"]);
        assert.equal(migrated.decorOpacity, 80);
        assert.ok(!(field in migrated));
        assert.deepEqual(migrateCardTheme(migrated), migrated);
        assert.equal(migrateCardTheme({ ...legacy, decorOpacity: 35 }).decorOpacity, 35);
      }
    }
  }
  assert.equal(migrateCardTheme({ ...employees[0].theme, decorOpacity: 100 }).decorOpacity, 100);
  assert.deepEqual(migrateCardTheme({ ...employees[0].theme, decor: [] }).decor, []);
  assert.ok(templates.length >= 8);
  assert.ok(colorPresets.length >= 24);
  assert.equal(new Set(templates.map((t) => t.id)).size, templates.length);
  for (const template of templates)
    assert.ok(backgrounds.some((b) => b.id === template.defaultBackgroundId));
  for (const { hex } of colorPresets) {
    assert.ok(contrastRatio(hex, contrastText(hex)) >= 4.5);
    assert.ok(contrastRatio(readableAccent(hex, false), "#F5F5F4") >= 4.5);
    assert.ok(contrastRatio(readableAccent(hex, true), "#172334") >= 4.5);
  }
  process.env.NEXT_PUBLIC_SITE_URL = "https://profiles.example.com";
  assert.equal(
    cardUrl(localized.slug),
    "https://profiles.example.com/card/nguyen-hoang-long",
  );
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete global.window;
  const { createElement } = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const {
    ProfilePage,
  } = require("../src/client/components/card/ProfilePage.tsx");
  const { ECard } = require("../src/client/components/card/ECard.tsx");
  for (const template of templates) {
    const employee = {
      ...localized,
      theme: {
        ...localized.theme,
        templateId: template.id,
        backgroundId: template.defaultBackgroundId,
        primaryColor: template.defaultColor,
        shapes: Object.fromEntries(template.shapes.map((s) => [s.id, true])),
      },
    };
    const html = renderToStaticMarkup(createElement(ProfilePage, { employee }));
    assert.ok(html.includes("<h1"));
    assert.ok(html.includes("NGUYỄN HOÀNG LONG"));
    assert.ok(html.includes("Gọi điện"));
    assert.ok(html.includes("Lưu danh bạ"));
    assert.ok(!html.includes('class="qr-panel"'));
    assert.ok(!html.includes('class="public-header"'));
    assert.ok(!html.includes("/login"));
    assert.ok(html.includes(`template-${template.id}`));
    const preview = renderToStaticMarkup(createElement(ECard, { employee }));
    assert.ok(preview.includes("<h2"));
  }

  const { CardDecorations } = require("../src/client/components/card/CardDecorations.tsx");
  for (const template of templates) {
    for (const decorOpacity of [0, 50, 100]) {
      const theme = { ...employees[0].theme, templateId: template.id, backgroundId: template.defaultBackgroundId, decor: ["blobs", "circles", "skyline", "waves", "bokeh"], decorOpacity };
      const preview = renderToStaticMarkup(createElement(CardDecorations, { theme, variant: "preview" }));
      const profile = renderToStaticMarkup(createElement(CardDecorations, { theme, variant: "profile" }));
      assert.equal(preview.replace("decor-preview", "decor-profile"), profile);
      assert.equal((preview.match(/data-decor=/g) || []).length, 5);
      assert.ok(preview.includes(`opacity:${decorOpacity / 100}`));
      assert.ok(!/<pattern|background-image|animate/i.test(preview));
    }
  }
  const legacyEmployee = structuredClone(employees[0]);
  delete legacyEmployee.theme.decor;
  legacyEmployee.theme.patternId = "plus";
  legacyEmployee.theme.decorOpacity = 100;
  storage.set("ecard-employees", JSON.stringify({ state: { employees: [legacyEmployee] }, version: 0 }));
  await store.persist.rehydrate();
  assert.deepEqual(store.getState().employees[0].theme.decor, ["blobs"]);
  assert.equal(store.getState().employees[0].theme.decorOpacity, 80);
  store.getState().setEmployees(employees);
  assert.equal(employees.length, 5);
  assert.equal((await service.getBySlug("le-minh-chau")).id, "e2");
  assert.equal(await service.getById("does-not-exist"), undefined);
  const input = { ...employees[0], fullName: "Đặng Thị Ánh", avatarUrl: "" };
  const first = await service.create(input);
  const second = await service.create(input);
  assert.equal(first.slug, "dang-thi-anh");
  assert.match(second.slug, /^dang-thi-anh-[a-z0-9]{4}$/);
  assert.notEqual(first.id, second.id);
  const renamed = await service.update(first.id, {
    ...first,
    fullName: "Tên mới",
    slug: "attempt-to-change",
  });
  assert.equal(renamed.slug, first.slug);
  assert.equal(renamed.createdAt, first.createdAt);
  const { toggleActive } = service;
  await toggleActive(first.id);
  assert.equal((await service.getById(first.id)).isActive, false);
  const previousCount = (await service.getAll()).length;
  const originalSet = global.localStorage.setItem;
  global.localStorage.setItem = () => {
    throw new Error("QuotaExceededError");
  };
  await assert.rejects(service.create(input), /Không thể lưu dữ liệu/);
  assert.equal((await service.getAll()).length, previousCount);
  global.localStorage.setItem = originalSet;
  const snapshot = storage.get("ecard-employees");
  store.getState().setEmployees([]);
  storage.set("ecard-employees", snapshot);
  await store.persist.rehydrate();
  assert.equal((await service.getAll()).length, 7);
  assert.equal((await service.getById(first.id)).fullName, "Tên mới");
  assert.equal((await service.getById(first.id)).slug, first.slug);
  await service.remove(second.id);
  assert.equal(await service.getById(second.id), undefined);
  await assert.rejects(service.update("missing", input));
  const vcard = createVCard({ ...input, fullName: "Nguyễn; An, Bình\nDemo" });
  assert.ok(vcard.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n"));
  assert.ok(vcard.includes("FN:Nguyễn\\; An\\, Bình\\nDemo"));
  assert.ok(vcard.endsWith("END:VCARD\r\n"));
  assert.equal(websiteUrl("qtmmedia.vn"), "https://qtmmedia.vn/");
  assert.equal(websiteUrl("javascript:alert(1)"), "");
  await assert.rejects(authService.login("admin@qtmmedia.vn", "wrong"));
  assert.equal(useAuthStore.getState().authenticated, false);
  await authService.login("admin@qtmmedia.vn", "admin123");
  const authSnapshot = storage.get("ecard-auth");
  await authService.logout();
  assert.equal(useAuthStore.getState().authenticated, false);
  storage.set("ecard-auth", authSnapshot);
  await useAuthStore.persist.rehydrate();
  assert.equal(useAuthStore.getState().authenticated, true);
  await service.reset();
  assert.equal((await service.getAll()).length, 5);
  assert.equal(
    (await service.getAll()).every((e) => e.isActive),
    true,
  );
  console.log(
    "PASS: CRUD, immutable QR URLs, persistence, vCard, auth, Vietnamese localization, 8 standalone profile templates and accessible colors.",
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
