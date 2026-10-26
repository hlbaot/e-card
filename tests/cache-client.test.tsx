import assert from "node:assert/strict";
import { test } from "node:test";
import { createQueryClient, bindQuerySession } from "../src/client/queries/client";
import { employeeOptions, employeesOptions } from "../src/client/queries/employees";
import { optimisticToggle } from "../src/client/queries/employee-cache";
import { queryKeys } from "../src/client/queries/keys";
import { useAuthStore } from "../src/client/store/auth.store";
import { employeeMutationOptions } from "../src/client/queries/employee-mutations";
import type { Employee, EmployeeStats } from "@/shared/types";
import { DEFAULT_PUBLIC_FIELDS } from "@/shared/types";

const employee: Employee = {
  id: "one", slug: "one", fullName: "Test", position: "Developer", company: "Test", companyShort: "T",
  phone: "0123456789", email: "test@example.com", zalo: "", website: "example.com", offices: [], slogan: "", avatarUrl: "",
  isActive: true, allowIndexing: false, publicFields: DEFAULT_PUBLIC_FIELDS, createdAt: "2026-10-26", updatedAt: "2026-10-26",
  theme: { templateId: "bubble-blue", backgroundId: "sky-soft", primaryColor: "#0F4C75", avatarSize: "lg", avatarShape: "circle", buttonStyle: "soft", decor: [], shapes: {} },
};
const user = { id: "admin-one", email: "admin@example.com" };

test("fresh navigation reuses one query; stale background fetch keeps data; defaults match requirements", async () => {
  const client = createQueryClient();
  let calls = 0;
  const options = { ...employeesOptions(user.id), queryFn: async () => { calls++; return [employee]; } };
  try {
    assert.deepEqual(client.getDefaultOptions().queries, { staleTime: 60_000, gcTime: 600_000, refetchOnWindowFocus: false, retry: 1 });
    await Promise.all([client.fetchQuery(options), client.prefetchQuery(options)]);
    await client.fetchQuery(options); assert.equal(calls, 1);
    client.setQueryData(options.queryKey, [employee], { updatedAt: Date.now() - 61_000 });
    let finish!: (value: Employee[]) => void;
    const pending = client.fetchQuery({ ...options, queryFn: () => new Promise<Employee[]>(resolve => { finish = resolve; }) });
    assert.equal(client.getQueryData<Employee[]>(options.queryKey)?.[0].fullName, "Test");
    finish([{ ...employee, fullName: "Changed" }]); await pending;
    assert.equal(client.getQueryData<Employee[]>(options.queryKey)?.[0].fullName, "Changed");
    const detailOpts = employeeOptions(user.id, "one", client);
    assert.equal(typeof detailOpts.initialData === "function" ? detailOpts.initialData()?.fullName : undefined, "Changed");
    assert.equal(typeof detailOpts.initialDataUpdatedAt === "function" ? detailOpts.initialDataUpdatedAt() : undefined, client.getQueryState(options.queryKey)?.dataUpdatedAt);
    assert.equal(client.getQueryData(queryKeys.employees.list("another-admin")), undefined);
  } finally { client.clear(); }
});

test("optimistic toggle updates list/detail/stats and rollback preserves another employee change", () => {
  const client = createQueryClient(), key = queryKeys.employees.list(user.id), statsKey = queryKeys.stats.detail(user.id);
  try {
    client.setQueryData(key, [employee, { ...employee, id: "two", slug: "two" }]);
    client.setQueryData(queryKeys.employees.detail(user.id, "one"), employee);
    client.setQueryData(statsKey, { total: 2, active: 2, inactive: 0 });
    const first = optimisticToggle(client, user.id, "one");
    optimisticToggle(client, user.id, "two");
    assert.equal(client.getQueryData<Employee>(queryKeys.employees.detail(user.id, "one"))?.isActive, false);
    first.rollback();
    assert.deepEqual(client.getQueryData<Employee[]>(key)?.map(e => e.isActive), [true, false]);
    assert.deepEqual(client.getQueryData(statsKey), { total: 2, active: 1, inactive: 1 });
  } finally { client.clear(); }
});

test("logout, expiry and account change clear cache and cancel pending responses", async () => {
  const client = createQueryClient(); useAuthStore.getState().setUser(user);
  const unbind = bindQuerySession(client);
  try {
    client.setQueryData(queryKeys.stats.detail(user.id), { total: 1 });
    useAuthStore.getState().setUser({ ...user });
    assert.equal(client.getQueryCache().getAll().length, 1);
    let finish!: (value: Employee[]) => void;
    const pending = client.fetchQuery({ queryKey: queryKeys.employees.list(user.id), queryFn: () => new Promise<Employee[]>(resolve => { finish = resolve; }) });
    const pendingQuery = client.getQueryCache().find({ queryKey: queryKeys.employees.list(user.id) });
    const canceled = assert.rejects(pending);
    useAuthStore.getState().setUser(null);
    assert.equal(client.getQueryCache().getAll().length, 0);
    finish([employee]); await canceled;
    pendingQuery?.destroy(); // Dispose the GC timer of the canceled test fetch.
    assert.equal(client.getQueryCache().getAll().length, 0);
    useAuthStore.getState().setUser(user); client.setQueryData(["private"], employee);
    useAuthStore.getState().setUser({ id: "other", email: "other@example.com" });
    assert.equal(client.getQueryCache().getAll().length, 0);
  } finally { unbind(); client.clear(); useAuthStore.getState().setUser(null); }
});

test("mutation callbacks used by the hook patch confirmed writes, invalidates related keys and rolls back failed toggle", async () => {
  const client = createQueryClient(), originalFetch = globalThis.fetch;
  client.setMutationDefaults(["employee-write"], { gcTime: 0 });
  useAuthStore.getState().setUser(user);
  const options = employeeMutationOptions(client, user.id);
  const actions = {
    toggleActive: (id: string) => client.getMutationCache().build(client, options.toggle).execute(id),
    update: (id: string, input: Employee) => client.getMutationCache().build(client, options.update).execute({ id, input }),
    remove: (id: string) => client.getMutationCache().build(client, options.remove).execute(id),
    create: (input: Employee) => client.getMutationCache().build(client, options.create).execute(input),
    upload: (file: File) => client.getMutationCache().build(client, options.upload).execute(file),
  };
  const key = queryKeys.employees.list(user.id), statsKey = queryKeys.stats.detail(user.id);
  client.setQueryData(key, [employee]); client.setQueryData(statsKey, { total: 1, active: 1, inactive: 0 });
  client.setQueryData(queryKeys.cards.list, [employee]);
  let finish!: (value: Response) => void;
  globalThis.fetch = async () => new Promise<Response>(resolve => { finish = resolve; });
  try {
    const pending = actions.toggleActive(employee.id);
    const rejected = assert.rejects(pending);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(client.getQueryData<Employee[]>(key)?.[0].isActive, false);
    assert.equal(client.getQueryData<EmployeeStats>(statsKey)?.active, 0);
    finish(Response.json({ error: "write failed" }, { status: 500 })); await rejected;
    assert.equal(client.getQueryData<Employee[]>(key)?.[0].isActive, true);
    assert.equal(client.getQueryData<EmployeeStats>(statsKey)?.active, 1);
    assert.equal(client.getQueryState(queryKeys.cards.list)?.isInvalidated, true);
    globalThis.fetch = async () => Response.json({ employee: { ...employee, fullName: "Saved" } });
    await actions.update(employee.id, employee);
    assert.equal(client.getQueryData<Employee[]>(key)?.[0].fullName, "Saved");
    assert.equal(client.getQueryData<Employee>(queryKeys.employees.detail(user.id, employee.id))?.fullName, "Saved");
    globalThis.fetch = async () => Response.json({ employee: { ...employee, id: "two", slug: "two" } });
    await actions.create(employee);
    assert.equal(client.getQueryData<Employee[]>(key)?.[0].id, "two");
    client.setQueryData(queryKeys.cards.list, [employee]);
    globalThis.fetch = async () => Response.json({ url: "https://res.cloudinary.com/test/avatar.png" });
    assert.match(await actions.upload(new File(["test"], "avatar.png")), /^https:/);
    assert.equal(client.getQueryState(queryKeys.cards.list)?.isInvalidated, true);
    globalThis.fetch = async () => Response.json({ success: true });
    await actions.remove("two");
    await actions.remove(employee.id);
    assert.deepEqual(client.getQueryData(key), []);
    assert.equal(client.getQueryData(queryKeys.employees.detail(user.id, employee.id)), undefined);
  } finally { globalThis.fetch = originalFetch; client.clear(); useAuthStore.getState().setUser(null); }
});


test("a write completing after account switch cannot refill the cleared cache", async () => {
  const client = createQueryClient(), originalFetch = globalThis.fetch;
  client.setMutationDefaults(["employee-write"], { gcTime: 0 });
  useAuthStore.getState().setUser(user);
  const unbind = bindQuerySession(client);
  let finish!: (response: Response) => void;
  globalThis.fetch = () => new Promise<Response>(resolve => { finish = resolve; });
  try {
    const options = employeeMutationOptions(client, user.id);
    const pending = client.getMutationCache().build(client, options.create).execute(employee);
    await new Promise(resolve => setImmediate(resolve));
    useAuthStore.getState().setUser({ id: "other", email: "other@example.com" });
    finish(Response.json({ employee })); await pending;
    assert.equal(client.getQueryCache().getAll().length, 0);
  } finally { globalThis.fetch = originalFetch; unbind(); client.clear(); useAuthStore.getState().setUser(null); }
});
