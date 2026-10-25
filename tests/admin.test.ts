import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { employeeInput, employeePatch } from "../src/server/admin/dto";
import { createAdminEmployeesService } from "../src/server/admin/service";
import { createCardsService, type CardRecord } from "../src/server/cards/service";
import type { AdminEmployeesRepository } from "../src/server/admin/repository";
import { AuthError } from "../src/server/auth/service";

const input = employeeInput.parse({
  fullName: "Đặng Thị Ánh", position: "Developer", company: "Test", companyShort: "T",
  email: "test@example.com", phone: "0123456789", zalo: "", website: "example.com", slogan: "",
  avatarUrl: "", isActive: true, allowIndexing: false, offices: [{ label: "Office", address: "Address" }],
  theme: { templateId: "bubble-blue", backgroundId: "sky-soft", primaryColor: "#0F4C75", avatarSize: "lg", avatarShape: "circle", buttonStyle: "soft", decor: [], shapes: {} },
});
function setup() {
  const rows = new Map<string, CardRecord>();
  const current = (id: string) => { const record = rows.get(id); return record && !record.deletedAt ? record : null; };
  const repository: AdminEmployeesRepository = {
    async list() { return [...rows.values()].filter((row) => !row.deletedAt); },
    async byId(id) { return current(id); },
    async create(data, slug) {
      if ([...rows.values()].some((row) => row.slug === slug)) throw { code: "P2002" };
      const id = randomUUID();
      const { theme, publicFields: ignored, ...fields } = data;
      void ignored;
      const record: CardRecord = { ...fields, id, slug, theme: { ...theme, employeeId: id }, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
      rows.set(id, record);
      return record;
    },
    async update(id, data) {
      const record = current(id);
      if (!record) throw { code: "P2025" };
      const { theme, publicFields: ignored, ...fields } = data;
      void ignored;
      const next: CardRecord = { ...record, ...fields, ...(theme ? { theme: { ...theme, employeeId: id } } : {}), updatedAt: new Date() };
      rows.set(id, next);
      return next;
    },
    async toggle(id) {
      const record = current(id);
      if (!record) return null;
      return this.update(id, { isActive: !record.isActive });
    },
    async remove(id) {
      const record = current(id);
      if (!record) return false;
      rows.set(id, { ...record, isActive: false, deletedAt: new Date() });
      return true;
    },
    async stats() {
      const records = await this.list();
      const active = records.filter((row) => row.isActive).length;
      return { total: records.length, active, inactive: records.length - active };
    },
  };
  return { rows, repository, service: createAdminEmployeesService(repository) };
}

test("admin CRUD: unique slugs, nested replacement, immutable slug, active/inactive, soft delete and public visibility", async () => {
  const { service, rows, repository } = setup();
  const publicService = createCardsService({ list: () => repository.list(), async bySlug(slug) { return [...rows.values()].find((row) => row.slug === slug) ?? null; } });
  const [first, second] = await Promise.all([service.create(input), service.create(input)]);
  assert.equal(first.slug, "dang-thi-anh");
  assert.match(second.slug, /^dang-thi-anh-[a-f0-9]{8}$/);
  const changed = await service.update(first.id, employeePatch.parse({ fullName: "New Name", offices: [], theme: { ...input.theme, primaryColor: "#123456", decor: ["waves"] } }));
  assert.equal(changed.slug, first.slug);
  assert.deepEqual(changed.offices, []);
  assert.equal(changed.theme.primaryColor, "#123456");
  assert.deepEqual(changed.theme.decor, ["waves"]);
  assert.equal((await service.byId(first.id)).fullName, "New Name");
  await service.toggle(first.id);
  assert.equal((await service.list()).length, 2);
  assert.equal(await publicService.bySlug(first.slug), null);
  assert.deepEqual(await service.stats(), { total: 2, active: 1, inactive: 1 });
  await service.remove(second.id);
  assert.ok(rows.get(second.id)!.deletedAt);
  assert.equal(await publicService.bySlug(second.slug), null);
  assert.deepEqual(await service.stats(), { total: 1, active: 0, inactive: 1 });
  for (const action of [() => service.byId(second.id), () => service.update(second.id, { fullName: "Revive" }), () => service.toggle(second.id), () => service.remove(second.id)]) {
    await assert.rejects(action, (error: unknown) => error instanceof AuthError && error.status === 404);
  }
  await assert.rejects(service.byId("invalid"), (error: unknown) => error instanceof AuthError && error.status === 400);
});

test("DTO rejects metadata changes, invalid nested values, data URLs, oversized arrays and empty patches", () => {
  for (const patch of [{ slug: "changed" }, { id: randomUUID() }, {}, { offices: Array(21).fill({ label: "", address: "" }) }, { avatarUrl: "data:image/png;base64,abc" }, { avatarUrl: "javascript:alert(1)" }, { theme: { ...input.theme, primaryColor: "red" } }, { theme: { ...input.theme, decorOpacity: 101 } }]) {
    assert.equal(employeePatch.safeParse(patch).success, false);
  }
});

test("all admin routes enforce auth, CSRF and input limits; CRUD and stats expose correct HTTP responses", async () => {
  process.env.DATABASE_URL = "postgresql://localhost:5432/admin_tests_never_connected";
  process.env.JWT_SECRET = "test-only-secret-with-at-least-32-bytes";
  process.env.NEXT_PUBLIC_SITE_URL = "https://ecard.example.com";
  const { NextRequest } = await import("next/server");
  const { serverAuth } = await import("../src/server/auth/runtime");
  const { adminEmployees } = await import("../src/server/admin/runtime");
  const { avatarStorage } = await import("../src/server/admin/upload");
  const originals = { auth: serverAuth.currentUser, service: { ...adminEmployees }, upload: avatarStorage.upload };
  const { service } = setup();
  Object.assign(adminEmployees, service);
  serverAuth.currentUser = async (token) => { if (token !== "valid") throw new AuthError(); return { id: "admin", email: "admin@example.com" }; };
  const collection = await import("../src/app/api/admin/employees/route");
  const item = await import("../src/app/api/admin/employees/[id]/route");
  const active = await import("../src/app/api/admin/employees/[id]/active/route");
  const stats = await import("../src/app/api/admin/stats/route");
  const upload = await import("../src/app/api/admin/uploads/avatar/route");
  const req = (method = "GET", body?: unknown, cookie = "ecard_access=valid", origin = "https://ecard.example.com") => new NextRequest("https://ecard.example.com/api/admin/employees", { method, headers: { cookie, origin, "content-type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const context = (id: string = randomUUID()) => ({ params: Promise.resolve({ id }) });
  try {
    for (const response of await Promise.all([
      collection.GET(req("GET", undefined, "")), collection.POST(req("POST", input, "")),
      item.GET(req("GET", undefined, ""), context()), item.PATCH(req("PATCH", input, ""), context()),
      item.DELETE(req("DELETE", undefined, ""), context()), active.PATCH(req("PATCH", undefined, ""), context()),
      stats.GET(req("GET", undefined, "")), upload.POST(req("POST", undefined, "")),
    ])) assert.equal(response.status, 401);
    assert.equal((await collection.POST(req("POST", input, "ecard_access=valid", "https://attacker.example"))).status, 403);
    assert.equal((await collection.POST(req("POST", {}))).status, 400);
    const huge = req("POST", input); huge.headers.set("content-length", String(128 * 1024));
    assert.equal((await collection.POST(huge)).status, 413);
    const malformed = new NextRequest("https://ecard.example.com/api/admin/employees", { method: "POST", headers: { origin: "https://ecard.example.com", cookie: "ecard_access=valid", "content-type": "application/json" }, body: "{" });
    assert.equal((await collection.POST(malformed)).status, 400);
    const created = await collection.POST(req("POST", input));
    assert.equal(created.status, 201);
    const { employee } = await created.json();
    assert.equal((await item.GET(req(), context(employee.id))).status, 200);
    assert.equal((await item.PATCH(req("PATCH", { slug: "overwrite" }), context(employee.id))).status, 400);
    const updated = await item.PATCH(req("PATCH", { offices: [], theme: { ...input.theme, primaryColor: "#000000" } }), context(employee.id));
    assert.equal(updated.status, 200);
    assert.deepEqual((await updated.json()).employee.offices, []);
    assert.equal((await active.PATCH(req("PATCH"), context(employee.id))).status, 200);
    const listed = await collection.GET(req());
    assert.equal(listed.headers.get("cache-control"), "no-store");
    assert.equal((await listed.json()).employees[0].isActive, false);
    assert.deepEqual(await (await stats.GET(req())).json(), { total: 1, active: 0, inactive: 1 });
    assert.equal((await item.DELETE(req("DELETE"), context(employee.id))).status, 200);
    assert.equal((await item.GET(req(), context(employee.id))).status, 404);
    assert.equal((await item.GET(req(), context("not-uuid"))).status, 400);
    assert.deepEqual(await (await stats.GET(req())).json(), { total: 0, active: 0, inactive: 0 });

    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aO7sAAAAASUVORK5CYII=", "base64");
    const uploadRequest = (file: File) => {
      const body = new FormData(); body.set("file", file);
      return new NextRequest("https://ecard.example.com/api/admin/uploads/avatar", { method: "POST", headers: { origin: "https://ecard.example.com", cookie: "ecard_access=valid" }, body });
    };
    avatarStorage.upload = async () => "https://res.cloudinary.com/test/image/upload/avatar.png";
    const uploaded = await upload.POST(uploadRequest(new File([png], "avatar.png", { type: "image/png" })));
    assert.equal(uploaded.status, 201);
    assert.match((await uploaded.json()).url, /^https:/);
    assert.equal((await upload.POST(uploadRequest(new File(["<svg>"], "fake.png", { type: "image/png" })))).status, 415);
    assert.equal((await upload.POST(uploadRequest(new File([png], "fake.svg", { type: "image/svg+xml" })))).status, 415);
    assert.equal((await upload.POST(uploadRequest(new File([new Uint8Array(2 * 1024 * 1024 + 1)], "big.png", { type: "image/png" })))).status, 413);
    assert.equal((await upload.POST(req("POST", {}))).status, 415);
    adminEmployees.list = async () => { throw new Error("sensitive database URL"); };
    const failure = await collection.GET(req());
    assert.equal(failure.status, 503);
    assert.ok(!(await failure.text()).includes("sensitive"));
  } finally {
    serverAuth.currentUser = originals.auth;
    Object.assign(adminEmployees, originals.service);
    avatarStorage.upload = originals.upload;
  }
});

test("avatar adapter sends the configured Cloudinary preset and hides provider errors", async () => {
  const { avatarStorage } = await import("../src/server/admin/upload");
  const originalFetch = globalThis.fetch;
  const originalCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const originalPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "test-cloud";
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = "test-preset";
  let fail = false;
  let providerError = "private provider details";
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.cloudinary.com/v1_1/test-cloud/image/upload");
    assert.equal(options?.method, "POST");
    assert.equal((options?.body as FormData).get("upload_preset"), "test-preset");
    assert.ok((options?.body as FormData).get("file") instanceof File);
    return fail ? Response.json({ error: { message: providerError } }, { status: 400 })
      : Response.json({ secure_url: "https://res.cloudinary.com/test-cloud/image/upload/file.png", format: "png", resource_type: "image" });
  };
  try {
    const file = new File(["test"], "file.png", { type: "image/png" });
    assert.match(await avatarStorage.upload(file), /^https:\/\/res.cloudinary.com\//);
    fail = true;
    await assert.rejects(avatarStorage.upload(file), (error: unknown) => error instanceof AuthError && error.status === 503 && !error.message.includes("private"));
    providerError = "Upload preset not found";
    await assert.rejects(avatarStorage.upload(file), /Upload preset Cloudinary không tồn tại/);
    providerError = "Upload preset must be whitelisted for unsigned uploads";
    await assert.rejects(avatarStorage.upload(file), /chưa bật chế độ Unsigned/);
    providerError = "File size too large";
    await assert.rejects(avatarStorage.upload(file), (error: unknown) => error instanceof AuthError && error.status === 413);
    globalThis.fetch = async () => { throw new Error("private network info"); };
    await assert.rejects(avatarStorage.upload(file), /Không thể kết nối dịch vụ ảnh/);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalCloud === undefined) delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    else process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = originalCloud;
    if (originalPreset === undefined) delete process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    else process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = originalPreset;
  }
});
