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
  assert.equal(slugify("  Đặng Thị Ánh!  "), "dang-thi-anh");
  // Test fixtures are created only inside this process; production starts empty.
  const employees = Array.from({ length: 5 }, (_, index) => ({
    id: `test-${index + 1}`, slug: `test-${index + 1}`, fullName: `Test Employee ${index + 1}`,
    position: "Test Position", company: "Test Company", companyShort: "TC",
    website: "example.com", offices: [{ label: "Test Office", address: "Test Address" }],
    avatarUrl: "", phone: "0123456789", email: "test@example.com", zalo: "0123456789",
    slogan: "", isActive: true, allowIndexing: false,
    publicFields: { phone: true, email: true, zalo: true, website: true, offices: true },
    theme: { templateId: "bubble-blue", backgroundId: "sky-soft", primaryColor: "#0F4C75",
      avatarSize: "lg", avatarShape: "circle", buttonStyle: "soft", decor: ["blobs", "skyline"],
      shapes: {}, showDecor: true, decorOpacity: 65 },
    createdAt: "2026-10-25T00:00:00.000Z", updatedAt: "2026-10-25T00:00:00.000Z",
  }));
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
  assert.equal(localized.fullName, "Test Employee 4");
  assert.equal(localized.slug, employees[3].slug);
  assert.equal(localized.offices[0].label, "Test Office");
  assert.equal(employees[3].fullName, "Test Employee 4");
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
  assert.deepEqual(decorOptions.map((option) => option.id), ["none", "blobs", "bokeh", "circles", "leaves", "geometry", "network"]);
  for (const templateId of ["bubble-blue", "dark-tech"]) {
    for (const pattern of ["dot", "dots", "grid", "diagonal", "art-deco", "plus", "crosses", "lines", "checks", "diamonds", "leaf", "leaf-dots", "none"]) {
      for (const field of ["pattern", "patternId"]) {
        const legacy = { ...employees[0].theme, templateId, backgroundId: templateId === "dark-tech" ? "night-navy" : "sky-soft", decorOpacity: 100, [field]: pattern };
        delete legacy.decor;
        const migrated = migrateCardTheme(legacy);
        assert.deepEqual(migrated.decor, pattern === "none" ? [] : [templateId === "dark-tech" ? "circles" : "blobs"]);
        assert.equal(migrated.decorOpacity, 60);
        assert.ok(!(field in migrated));
        assert.deepEqual(migrateCardTheme(migrated), migrated);
        assert.equal(migrateCardTheme({ ...legacy, decorOpacity: 35 }).decorOpacity, 35);
      }
    }
  }
  assert.equal(migrateCardTheme({ ...employees[0].theme, decorOpacity: 100 }).decorOpacity, 60);
  assert.deepEqual(migrateCardTheme({ ...employees[0].theme, decor: [] }).decor, []);
  assert.deepEqual(migrateCardTheme({ ...employees[0].theme, decor: ["leaves", "network", "geometry", "leaves", "invalid"] }).decor, ["leaves"]);
  const { getProfileDecorPlacements } = require("../src/shared/utils/decor-layout.ts");
  const motifKeys = ["blobs", "bokeh", "circles", "leaves", "geometry", "network"];
  // Motifs occupy spacious fixed slots strictly at the outer margins
  for (let mask = 0; mask < 1 << motifKeys.length; mask++) {
    const selected = motifKeys.filter((_, index) => mask & (1 << index));
    const placements = getProfileDecorPlacements(selected);
    assert.equal(placements.length, selected.length === 0 ? 0 : 6);
    if (selected.length > 0) {
      assert.ok(placements.some(slot => slot.decor === selected[0]));
    }
    placements.forEach((a, index) => {
      assert.ok(a.y + a.height <= 200);
      for (const protectedArea of [{ x: 0, y: 45, width: 90, height: 120 }, { x: 280, y: 0, width: 110, height: 60 }]) {
        const b = protectedArea;
        assert.ok(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
      }
      for (const b of placements.slice(index + 1)) {
        assert.ok(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
      }
    });
  }
  assert.ok(templates.length >= 8);
  assert.ok(colorPresets.length >= 12);
  assert.equal(new Set(templates.map((t) => t.id)).size, templates.length);
  for (const template of templates)
    assert.ok(backgrounds.some((b) => b.id === template.defaultBackgroundId));
  for (const { hex } of colorPresets) {
    assert.ok(contrastRatio(hex, contrastText(hex)) >= 4.5);
    assert.ok(contrastRatio(readableAccent(hex, false), "#F5F5F4") >= 4.5);
    assert.ok(contrastRatio(readableAccent(hex, true), "#172334") >= 4.5);
    // Profile accents must remain readable on the darkest allowed pastel too.
    assert.ok(contrastRatio(readableAccent(hex, false, "#E0E0E0"), "#E0E0E0") >= 4.5);
  }
  process.env.NEXT_PUBLIC_SITE_URL = "https://profiles.example.com";
  assert.equal(
    cardUrl(localized.slug),
    "https://profiles.example.com/card/test-4",
  );
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete global.window;
  const { createElement } = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const {
    ProfilePage,
  } = require("../src/client/components/card/ProfilePage.tsx");
  const { ECard } = require("../src/client/components/card/ECard.tsx");
  const { CardListItem } = require("../src/client/components/card/CardListItem.tsx");
  const cardLink = renderToStaticMarkup(createElement(CardListItem, { employee: localized }));
  assert.ok(cardLink.includes('target="_blank"'), "Card detail must open in a new tab");
  assert.ok(cardLink.includes('rel="noopener noreferrer"'));
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
    assert.ok(html.includes("Test Employee 4"));
    assert.ok(html.includes("Gọi điện"));
    assert.ok(html.includes("Lưu danh bạ"));
    assert.ok(!html.includes('class="qr-panel"'));
    assert.ok(!html.includes('class="public-header"'));
    assert.ok(!html.includes("/login"));
    assert.ok(html.includes(`template-${template.id}`));
    const preview = renderToStaticMarkup(createElement(ECard, { employee }));
    assert.ok(preview.includes("<h2"));
    assert.ok(html.includes("qtm-card-layout") && preview.includes("qtm-card-layout"));
    for (const label of ["CULTURE", "TECHNOLOGY", "MEDIA", "EVENT", "+ AI TECH", "QUALITY - TECHNOLOGY - MINDSET"]) {
      assert.ok(preview.includes(label) && html.includes(label));
    }
    assert.ok(!template.dark, `${template.id} must have a light surface`);
    const { getThemeBackgroundCss } = require("../src/config/card-themes.ts");
    assert.ok(!getThemeBackgroundCss(employee.theme).includes("#0B0C10"));

  }

  const { CardDecorations } = require("../src/client/components/card/CardDecorations.tsx");
  for (const template of templates) {
    for (const decorOpacity of [0, 35, 60]) {
      const theme = { ...employees[0].theme, templateId: template.id, backgroundId: template.defaultBackgroundId, decor: ["blobs"], decorOpacity };
      const preview = renderToStaticMarkup(createElement(CardDecorations, { theme, variant: "preview" }));
      const profile = renderToStaticMarkup(createElement(CardDecorations, { theme, variant: "profile" }));
      assert.equal(preview.replace("decor-preview", "decor-profile"), profile);
      // Active decor artwork + permanent skyline artwork = 2
      assert.equal((preview.match(/data-decor=/g) || []).length, 2);
      assert.ok(preview.includes(`opacity:${decorOpacity / 100}`));
      assert.ok(!/<pattern|background-image|animate/i.test(preview));
    }
  }
  const input = employees[0];
  const vcard = createVCard({ ...input, fullName: "Nguyễn; An, Bình\nDemo" });
  assert.ok(vcard.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n"));
  assert.ok(vcard.includes("FN:Nguyễn\\; An\\, Bình\\nDemo"));
  assert.ok(vcard.endsWith("END:VCARD\r\n"));
  assert.equal(websiteUrl("qtmmedia.vn"), "https://qtmmedia.vn/");
  assert.equal(websiteUrl("javascript:alert(1)"), "");
  console.log(
    "PASS: vCard, content preservation, 8 standalone profile templates and accessible colors.",
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
