import assert from "node:assert/strict";
import { test } from "node:test";
import { QueryObserver } from "@tanstack/react-query";
import { employeeApi } from "../src/api/employee.api";
import { createAdminNavigationPrefetcher } from "../src/client/queries/admin-navigation";
import { createQueryClient, bindQuerySession } from "../src/client/queries/client";
import { employeesOptions } from "../src/client/queries/employees";
import { queryKeys } from "../src/client/queries/keys";
import { useAuthStore } from "../src/client/store/auth.store";
import { routes } from "../src/shared/constants/routes";

type Router = Parameters<typeof createAdminNavigationPrefetcher>[1];
const user = { id: "hover-admin", email: "hover@example.com" };

function setup() {
  const client = createQueryClient();
  const calls: Array<{ href: string; onInvalidate?: () => void }> = [];
  const router: Router = { prefetch: (href, options) => { calls.push({ href, ...options }); } };
  const original = employeeApi.getAll;
  let reads = 0;
  employeeApi.getAll = async () => { reads++; return []; };
  useAuthStore.getState().setUser(user);
  return {
    client, router, calls,
    reads: () => reads,
    cleanup() { employeeApi.getAll = original; client.clear(); useAuthStore.getState().setUser(null); },
  };
}

test("render does no work; unready, unauthenticated and non-menu destinations cannot prefetch", async () => {
  const h = setup();
  try {
    const prefetch = createAdminNavigationPrefetcher(h.client, h.router);
    assert.equal(h.calls.length, 0); assert.equal(h.reads(), 0);
    for (const state of [
      { ready: false, authenticated: true, user },
      { ready: true, authenticated: false, user },
      { ready: true, authenticated: true, user: null },
    ]) {
      useAuthStore.setState(state);
      for (const href of [routes.admin, routes.employees, routes.cards, routes.profile]) await prefetch(href);
    }
    useAuthStore.getState().setUser(user);
    await prefetch(routes.newEmployee);
    await prefetch("/admin/unknown");
    assert.equal(h.calls.length, 0); assert.equal(h.reads(), 0);
  } finally { h.cleanup(); }
});

test("hover and focus share in-flight data across menus; mounting useQuery reuses the same fresh cache", async () => {
  const h = setup();
  let finish!: () => void;
  let reads = 0;
  employeeApi.getAll = () => { reads++; return new Promise(resolve => { finish = () => resolve([]); }); };
  try {
    const prefetch = createAdminNavigationPrefetcher(h.client, h.router);
    const requests = [prefetch(routes.employees), prefetch(routes.employees), prefetch(routes.cards), prefetch(routes.admin)];
    assert.equal(h.client.getQueryCache().getAll().length, 1);
    assert.equal(h.calls.length, 3);
    const observer = new QueryObserver(h.client, employeesOptions(user.id));
    const unsubscribe = observer.subscribe(() => {});
    try {
      finish(); await Promise.all(requests);
      assert.equal(observer.getCurrentResult().status, "success");
      assert.deepEqual(observer.getCurrentResult().data, []);
      assert.equal(observer.getCurrentResult().isFetching, false);
      await prefetch(routes.employees);
      assert.equal(reads, 1);
      assert.equal(h.calls.length, 3);
      assert.equal(h.client.getQueryState(queryKeys.employees.list(user.id))?.dataUpdateCount, 1);
      assert.equal(employeesOptions(user.id).staleTime, 60_000);
    } finally { unsubscribe(); observer.destroy(); }
  } finally { h.cleanup(); }
});

test("profile prefetches only its route; fresh, stale and invalidated employee data use the shared options", async () => {
  const h = setup();
  try {
    const prefetch = createAdminNavigationPrefetcher(h.client, h.router);
    await prefetch(routes.profile);
    assert.equal(h.calls[0].href, routes.profile); assert.equal(h.reads(), 0);
    await prefetch(routes.employees); await prefetch(routes.cards); await prefetch(routes.admin);
    assert.equal(h.reads(), 1);
    h.client.setQueryData(queryKeys.employees.list(user.id), [], { updatedAt: Date.now() - 61_000 });
    await prefetch(routes.cards); assert.equal(h.reads(), 2);
    const count = h.calls.length;
    h.calls.find(call => call.href === routes.cards)!.onInvalidate!();
    assert.equal(h.calls.length, count, "route invalidation must not trigger an eager request");
    await prefetch(routes.cards);
    assert.equal(h.calls.length, count + 1); assert.equal(h.reads(), 2);
    await h.client.invalidateQueries({ queryKey: queryKeys.employees.list(user.id), refetchType: "none" });
    await prefetch(routes.employees); assert.equal(h.reads(), 3);
  } finally { h.cleanup(); }
});

test("hover failures are silent and do not retry; navigation can fetch normally afterward", async () => {
  const h = setup();
  let attempts = 0;
  employeeApi.getAll = async () => { attempts++; if (attempts === 1) throw Error("Temporary failure"); return []; };
  try {
    const prefetch = createAdminNavigationPrefetcher(h.client, { prefetch: () => { throw Error("Route unavailable"); } });
    await assert.doesNotReject(prefetch(routes.employees));
    assert.equal(attempts, 1);
    assert.equal(h.client.getQueryState(queryKeys.employees.list(user.id))?.status, "error");
    const observer = new QueryObserver(h.client, employeesOptions(user.id));
    const unsubscribe = observer.subscribe(() => {});
    try {
      await h.client.fetchQuery(employeesOptions(user.id));
      assert.equal(attempts, 2);
      assert.equal(observer.getCurrentResult().status, "success");
    } finally { unsubscribe(); observer.destroy(); }
    const rejectedRoute = createAdminNavigationPrefetcher(h.client, { prefetch: async () => { throw Error("Async route failure"); } });
    await assert.doesNotReject(rejectedRoute(routes.profile));
  } finally { h.cleanup(); }
});

test("logout cancels speculative data and old interaction handlers cannot fetch while signed out", async () => {
  const h = setup(), unbind = bindQuerySession(h.client);
  let signal!: AbortSignal;
  employeeApi.getAll = abortSignal => new Promise((_resolve, reject) => {
    signal = abortSignal!;
    signal.addEventListener("abort", () => reject(Error("Aborted")), { once: true });
  });
  try {
    const prefetch = createAdminNavigationPrefetcher(h.client, h.router);
    const pending = prefetch(routes.employees);
    const pendingQuery = h.client.getQueryCache().find({ queryKey: queryKeys.employees.list(user.id) });
    useAuthStore.getState().setUser(null);
    await pending;
    assert.equal(signal.aborted, true);
    assert.equal(h.client.getQueryCache().getAll().length, 0);
    await prefetch(routes.profile); assert.equal(h.calls.length, 1);
    pendingQuery?.destroy();
    useAuthStore.getState().setUser({ id: "other-admin", email: "other@example.com" });
    employeeApi.getAll = async () => [];
    await prefetch(routes.employees);
    assert.equal(h.calls.length, 2);
    assert.equal(h.client.getQueryData(queryKeys.employees.list(user.id)), undefined);
    assert.deepEqual(h.client.getQueryData(queryKeys.employees.list("other-admin")), []);
  } finally { unbind(); h.cleanup(); }
});
