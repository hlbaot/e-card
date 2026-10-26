import assert from "node:assert/strict";
import { test } from "node:test";
import type { Prisma } from "@prisma/client";
import { createCardsService, type CardsRepository } from "../src/server/cards/service";

type Record = Prisma.EmployeeGetPayload<{ include: { theme: true } }>;
const card: Record = {
  id: "211cb740-bad0-4940-9c21-859b6c580434", slug: "public-card", fullName: "Test User",
  position: "Developer", company: "Test Company", companyShort: "TC", website: "example.com",
  offices: [{ label: "Office", address: "Test Address" }], email: null, phone: null, zalo: null,
  slogan: null, avatarUrl: null, isActive: true, allowIndexing: false,
  createdAt: new Date("2026-10-01"), updatedAt: new Date("2026-10-25"), deletedAt: null,
  theme: {
    employeeId: "211cb740-bad0-4940-9c21-859b6c580434", templateId: "luxury", backgroundId: "paper-cream",
    primaryColor: "#D4AF6A", avatarSize: "lg", avatarShape: "circle", buttonStyle: "soft",
    decor: [], shapes: {}, showDecor: true, decorOpacity: 65,
  },
};
const records = [card, { ...card, slug: "hidden", isActive: false }, { ...card, slug: "deleted", deletedAt: new Date() }];
const repository: CardsRepository = {
  async list() { return records; },
  async bySlug(slug) { return records.find((record) => record.slug === slug) ?? null; },
};

test("public cards include company, offices and theme; hidden/deleted cards are excluded", async () => {
  const service = createCardsService(repository);
  const listed = await service.list();
  assert.equal(listed.length, 1);
  const detail = await service.bySlug(card.slug);
  assert.deepEqual(detail, listed[0]);
  assert.equal(detail!.company, "Test Company");
  assert.deepEqual(detail!.offices, card.offices);
  assert.equal(detail!.theme.templateId, "luxury");
  assert.equal(detail!.email, "");
  assert.equal("deletedAt" in detail!, false);
  assert.equal("employeeId" in detail!.theme, false);
  for (const slug of ["hidden", "deleted", "missing", "", "a".repeat(121)]) {
    assert.equal(await service.bySlug(slug), null);
  }
  const noTheme = createCardsService({ ...repository, async bySlug() { return { ...card, theme: null }; } });
  assert.equal((await noTheme.bySlug(card.slug))!.theme.templateId, "bubble-blue");
});

test("public routes need no token, return 404 for unavailable cards and sanitize DB errors", async () => {
  process.env.DATABASE_URL = "postgresql://localhost:5432/cards_tests_never_connected";
  process.env.JWT_SECRET = "test-only-secret-with-at-least-32-bytes";
  const { publicCards } = await import("../src/server/cards/runtime");
  const originals = { ...publicCards };
  Object.assign(publicCards, createCardsService(repository));
  const { GET: list } = await import("../src/app/api/cards/route");
  const { GET: detail } = await import("../src/app/api/cards/[slug]/route");
  const get = (slug: string) => detail(new Request(`http://localhost/api/cards/${slug}`), { params: Promise.resolve({ slug }) });
  try {
    const response = await list(new Request("http://localhost/api/cards"));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "public, max-age=0, must-revalidate");
    const conditional = new Request("http://localhost/api/cards", { headers: { "if-none-match": response.headers.get("etag")! } });
    assert.equal((await list(conditional)).status, 304);
    assert.equal((await response.json()).cards.length, 1);
    const found = await get(card.slug);
    assert.equal(found.status, 200);
    const conditionalDetail = new Request(`http://localhost/api/cards/${card.slug}`, { headers: { "if-none-match": found.headers.get("etag")! } });
    const notModified = await detail(conditionalDetail, { params: Promise.resolve({ slug: card.slug }) });
    assert.equal(notModified.status, 304); assert.equal(await notModified.text(), "");
    assert.equal((await found.json()).card.slug, card.slug);
    for (const slug of ["hidden", "deleted", "missing"]) assert.equal((await get(slug)).status, 404);
    publicCards.list = async () => { throw new Error("sensitive database credentials"); };
    publicCards.bySlug = async () => { throw new Error("sensitive database credentials"); };
    for (const failure of [await list(new Request("http://localhost/api/cards")), await get(card.slug)]) {
      assert.equal(failure.status, 503);
      assert.ok(!(await failure.text()).includes("sensitive"));
    }
  } finally { Object.assign(publicCards, originals); }
});


test("cached public profile checks visibility before reading persistent content", async () => {
  process.env.DATABASE_URL = "postgresql://localhost:5432/cards_tests_never_connected";
  process.env.JWT_SECRET = "test-only-secret-with-at-least-32-bytes";
  const { cardsRepository } = await import("../src/server/cards/repository");
  const { cachedPublicCards } = await import("../src/server/cards/cache");
  const original = cardsRepository.isVisible;
  let checks = 0;
  cardsRepository.isVisible = async () => { checks++; return false; };
  try {
    assert.equal(await cachedPublicCards.bySlug("hidden"), null);
    assert.equal(checks, 1);
    assert.equal(await cachedPublicCards.bySlug(""), null);
    assert.equal(checks, 1);
  } finally { cardsRepository.isVisible = original; }
});
