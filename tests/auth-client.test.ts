import assert from "node:assert/strict";
import { test } from "node:test";
import { useAuthStore } from "../src/client/store/auth.store";
import { restoreSession, login, logout } from "../src/client/hooks/useAuth";
import { apiFetch } from "../src/client/api/http";
import { authApi } from "../src/client/api/auth.api";
const user = { id: "test-admin", email: "admin@example.com" };
const json = (body: unknown, status = 200) => Response.json(body, { status });

test("password form sends the current/new passwords and signs out only after success", async () => {
  const originalFetch = globalThis.fetch;
  let accept = false;
  useAuthStore.getState().setUser(user);
  globalThis.fetch = async (input, options) => {
    assert.equal(input, "/api/auth/password");
    assert.equal(options?.method, "POST");
    assert.equal(options?.credentials, "same-origin");
    assert.deepEqual(JSON.parse(options!.body as string), { currentPassword: "current", newPassword: "new-password" });
    return accept ? json({ success: true }) : json({ error: "Mật khẩu hiện tại không chính xác." }, 400);
  };
  try {
    await assert.rejects(authApi.changePassword("current", "new-password"), /Mật khẩu hiện tại/);
    assert.equal(useAuthStore.getState().authenticated, true);
    accept = true;
    await authApi.changePassword("current", "new-password");
    assert.equal(useAuthStore.getState().authenticated, false);
  } finally { globalThis.fetch = originalFetch; }
});

test("AuthGuard session restore shares one me request and exposes only the authenticated user", async () => {
  const originalFetch = globalThis.fetch;
  let requests = 0;
  useAuthStore.setState({ ready: false, authenticated: false, user: null });
  globalThis.fetch = async (input, options) => {
    assert.equal(input, "/api/auth/me");
    assert.equal(options?.credentials, "same-origin");
    requests++;
    return json({ user });
  };
  try {
    const first = restoreSession();
    assert.equal(useAuthStore.getState().ready, false);
    await Promise.all([first, restoreSession()]);
    assert.equal(requests, 1);
    assert.equal(useAuthStore.getState().ready, true);
    assert.equal(useAuthStore.getState().authenticated, true);
    assert.deepEqual(useAuthStore.getState().user, user);
  } finally { globalThis.fetch = originalFetch; }
});

test("client restores via cookies, retries a protected request once, and coalesces concurrent refresh", async () => {
  const originalFetch = globalThis.fetch;
  let valid = false;
  let refreshCount = 0;
  let protectedCount = 0;
  globalThis.fetch = async (input, options) => {
    assert.equal(options?.credentials, "same-origin");
    assert.equal(options?.cache, "no-store");
    if (input === "/api/auth/me") return valid ? json({ user }) : json({ error: "expired" }, 401);
    if (input === "/api/auth/refresh") {
      refreshCount++;
      await new Promise((resolve) => setTimeout(resolve, 5));
      valid = true;
      return json({ user });
    }
    protectedCount++;
    return valid ? json({ ok: true }) : json({ error: "expired" }, 401);
  };
  try {
    await restoreSession();
    assert.equal(useAuthStore.getState().authenticated, true);
    assert.deepEqual(useAuthStore.getState().user, user);
    assert.equal(refreshCount, 1);
    valid = false;
    const results = await Promise.all([apiFetch("/api/protected"), apiFetch("/api/protected")]);
    assert.ok(results.every((response) => response.ok));
    assert.equal(refreshCount, 2);
    assert.equal(protectedCount, 4);
  } finally { globalThis.fetch = originalFetch; }
});

test("invalid refresh clears auth; login errors propagate; successful login/logout use real endpoints", async () => {
  const originalFetch = globalThis.fetch;
  let acceptLogin = false;
  globalThis.fetch = async (input) => {
    if (input === "/api/auth/login") return acceptLogin ? json({ user }) : json({ error: "Sai mật khẩu" }, 401);
    if (input === "/api/auth/logout") return json({ success: true });
    return json({ error: "expired" }, 401);
  };
  try {
    useAuthStore.getState().setUser(user);
    await restoreSession();
    assert.equal(useAuthStore.getState().authenticated, false);
    await assert.rejects(login(user.email, "wrong"), /Sai mật khẩu/);
    acceptLogin = true;
    await login(user.email, "correct");
    assert.equal(useAuthStore.getState().authenticated, true);
    await logout();
    assert.equal(useAuthStore.getState().authenticated, false);
    await assert.rejects(apiFetch("https://attacker.example/api"));
  } finally { globalThis.fetch = originalFetch; }
});

test("logout waits for an in-flight refresh and leaves the client signed out", async () => {
  const originalFetch = globalThis.fetch;
  let valid = false;
  const events: string[] = [];
  globalThis.fetch = async (input) => {
    if (input === "/api/auth/me") return valid ? json({ user }) : json({}, 401);
    if (input === "/api/auth/refresh") {
      await new Promise((resolve) => setTimeout(resolve, 5));
      events.push("refresh");
      valid = true;
      return json({ user });
    }
    if (input === "/api/auth/logout") {
      events.push("logout");
      valid = false;
      return json({ success: true });
    }
    return valid ? json({ ok: true }) : json({}, 401);
  };
  try {
    const restoring = restoreSession();
    const loggingOut = logout();
    await Promise.all([restoring, loggingOut]);
    assert.deepEqual(events, ["refresh", "logout"]);
    assert.equal(useAuthStore.getState().authenticated, false);
  } finally { globalThis.fetch = originalFetch; }
});
