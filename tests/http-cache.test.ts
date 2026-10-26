import assert from "node:assert/strict";
import { test } from "node:test";
import { conditionalJson } from "../src/server/http-cache";

test("ETag supports weak/strong validators, lists and wildcard; changed JSON returns 200", async () => {
  const data = { employees: [{ id: "one", updatedAt: "first" }] };
  const first = conditionalJson(undefined, data);
  assert.equal(first.status, 200);
  assert.equal(first.headers.get("cache-control"), "private, max-age=0, must-revalidate");
  assert.equal(first.headers.get("vary"), "Cookie");
  const tag = first.headers.get("etag")!;
  for (const header of [tag, tag.replace(/^W\//, ""), `"another", ${tag}`, "*"]) {
    const req = new Request("http://localhost/api/admin/employees", { headers: { "If-None-Match": header } });
    const cached = conditionalJson(req, data);
    assert.equal(cached.status, 304); assert.equal(await cached.text(), "");
    assert.equal(cached.headers.get("etag"), tag);
    assert.equal(conditionalJson(req, { employees: [] }).status, header === "*" ? 304 : 200);
  }
  const publicRead = conditionalJson(undefined, data, "public");
  assert.equal(publicRead.headers.get("cache-control"), "public, max-age=0, must-revalidate");
});
