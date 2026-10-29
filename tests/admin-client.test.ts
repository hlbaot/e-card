import assert from "node:assert/strict";
import { test } from "node:test";
import { employeeService, EmployeeApiError } from "../src/client/services/employee.service";
import { useEmployeeStore } from "../src/client/store/employee.store";
import { DEFAULT_PUBLIC_FIELDS } from "@/shared/types";
import type { EmployeeInput } from "@/shared/types";

const input: EmployeeInput = {
  fullName: "Test", position: "Developer", company: "Test", companyShort: "T", website: "example.com",
  email: "test@example.com", phone: "0123456789", zalo: "", offices: [], slogan: "", avatarUrl: "", isActive: true,
  allowIndexing: false, publicFields: DEFAULT_PUBLIC_FIELDS,
  theme: { businessCardType: "an-ninh-mang", templateId: "bubble-blue", styleId: "bubble-blue", paletteId: "brand-white", backgroundId: "sky-soft", primaryColor: "#0F4C75", avatarSize: "lg", avatarShape: "circle", buttonStyle: "soft", decor: [], shapes: {} },
};
const employee = { ...input, id: "211cb740-bad0-4940-9c21-859b6c580434", slug: "test", createdAt: "2026-10-25T00:00:00Z", updatedAt: "2026-10-25T00:00:00Z" };
test("admin client uses APIs for CRUD, statistics and multipart avatar; drops immutable form metadata", async () => {
  const originalFetch = globalThis.fetch;
  const calls: { path: string; method: string }[] = [];
  const before = useEmployeeStore.getState();
  globalThis.fetch = async (path, options) => {
    assert.equal(options?.credentials, "same-origin");
    assert.equal(options?.cache, !options?.method ? "no-cache" : "no-store");
    const url = String(path);
    calls.push({ path: url, method: options?.method ?? "GET" });
    if (url.endsWith("uploads/avatar")) {
      assert.ok((options?.body as FormData).get("file") instanceof File);
      return Response.json({ url: "https://res.cloudinary.com/test/avatar.png" });
    }
    if (url.endsWith("stats")) return Response.json({ total: 1, active: 1, inactive: 0 });
    if (options?.method === "DELETE") return Response.json({ success: true });
    if (options?.body) {
      const body = JSON.parse(options.body as string);
      for (const key of ["id", "slug", "createdAt", "updatedAt"]) assert.equal(key in body, false);
      for (const key of ["styleId", "paletteId", "palette"]) assert.equal(key in body.theme, false);
      assert.equal(body.fullName, input.fullName);
      assert.equal(body.theme.businessCardType, "an-ninh-mang");
    }
    return Response.json(url.endsWith("employees") && !options?.method ? { employees: [employee] } : { employee });
  };
  try {
    assert.equal((await employeeService.getAll()).length, 1);
    assert.equal((await employeeService.getById(employee.id)).id, employee.id);
    await employeeService.create(employee);
    await employeeService.update(employee.id, employee);
    await employeeService.toggleActive(employee.id);
    await employeeService.remove(employee.id);
    assert.deepEqual(await employeeService.getStats(), { total: 1, active: 1, inactive: 0 });
    assert.match(await employeeService.uploadAvatar(new File(["test"], "test.png", { type: "image/png" })), /^https:/);
    assert.deepEqual(calls.map((call) => call.method), ["GET", "GET", "POST", "PATCH", "PATCH", "DELETE", "GET", "POST"]);
    assert.ok(calls.every((call) => call.path.startsWith("/api/admin/")));
    assert.equal(useEmployeeStore.getState(), before); // API functions do not mutate UI state.
    globalThis.fetch = async () => Response.json({ error: "Không tìm thấy nhân viên." }, { status: 404 });
    await assert.rejects(employeeService.getById(employee.id), (error: unknown) => error instanceof EmployeeApiError && error.status === 404);
  } finally { globalThis.fetch = originalFetch; }
});
