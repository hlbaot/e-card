import assert from "node:assert/strict";
import { test } from "node:test";
import { hash, verify } from "@node-rs/argon2";
import { SignJWT } from "jose";
import { createAuthService, tokenHash, type AdminRecord, type AuthRepository } from "../src/server/auth/service";
import { isAllowedAuthOrigin } from "../src/server/auth/origin";

test("CSRF permits the actual loopback dev port while production stays restricted", () => {
  const configured = "http://localhost:3000";
  const allowed = (origin: string | null, url = "http://localhost:3001/api/auth/login", mode = "development", site: string | null = "same-origin") =>
    isAllowedAuthOrigin(origin, url, configured, mode, site);
  assert.equal(allowed("http://localhost:3001"), true);
  assert.equal(allowed("http://127.0.0.1:3002", "http://127.0.0.1:3002/api/auth/login"), true);
  assert.equal(allowed("http://[::1]:3002", "http://[::1]:3002/api/auth/login"), true);
  assert.equal(allowed("http://localhost:3000"), true);
  assert.equal(allowed("http://localhost:3001", undefined, "production"), false);
  assert.equal(allowed("http://localhost:3002"), false);
  assert.equal(allowed("https://attacker.example", "https://attacker.example/api/auth/login"), false);
  assert.equal(allowed("http://localhost.attacker.example:3001"), false);
  assert.equal(allowed("http://localhost:3001", undefined, undefined, "cross-site"), false);
  assert.equal(allowed(null), false);
  assert.equal(allowed("null"), false);
});

const secret = "test-only-secret-with-at-least-32-bytes";
async function setup() {
  let admin: AdminRecord = {
    id: "211cb740-bad0-4940-9c21-859b6c580434", email: "admin@example.com",
    passwordHash: await hash("correct-password"), refreshTokenHash: null, refreshExpiresAt: null,
  };
  const snapshot = () => ({ ...admin });
  const repo: AuthRepository = {
    async byEmail(email) { return email === admin.email ? snapshot() : null; },
    async byId(id) { return id === admin.id ? snapshot() : null; },
    async byRefreshHash(value) { return value === admin.refreshTokenHash ? snapshot() : null; },
    async startSession(_id, refreshTokenHash, refreshExpiresAt) { admin = { ...admin, refreshTokenHash, refreshExpiresAt }; },
    async rotateSession(id, previousHash, refreshTokenHash, refreshExpiresAt) {
      if (id !== admin.id || previousHash !== admin.refreshTokenHash || !admin.refreshExpiresAt || admin.refreshExpiresAt <= new Date()) return false;
      admin = { ...admin, refreshTokenHash, refreshExpiresAt };
      return true;
    },
    async endSession(value) { if (admin.refreshTokenHash === value) admin = { ...admin, refreshTokenHash: null, refreshExpiresAt: null }; },
    async updatePassword(id, previousHash, sessionHash, passwordHash) {
      if (id !== admin.id || previousHash !== admin.passwordHash || sessionHash !== admin.refreshTokenHash
        || !admin.refreshExpiresAt || admin.refreshExpiresAt <= new Date()) return false;
      admin = { ...admin, passwordHash, refreshTokenHash: null, refreshExpiresAt: null };
      return true;
    },
  };
  return { auth: createAuthService(repo, secret), repo, snapshot };
}

test("Argon2 login, normalized email, generic invalid-credential errors and hashed refresh storage", async () => {
  const { auth, snapshot } = await setup();
  await assert.rejects(auth.login("admin@example.com", "wrong"), /Email hoặc mật khẩu không chính xác/);
  await assert.rejects(auth.login("missing@example.com", "correct-password"), /Email hoặc mật khẩu không chính xác/);
  const result = await auth.login(" ADMIN@example.com ", "correct-password");
  assert.equal(result.user.email, "admin@example.com");
  assert.equal(snapshot().refreshTokenHash, tokenHash(result.refreshToken));
  assert.notEqual(snapshot().refreshTokenHash, result.refreshToken);
  assert.deepEqual(await auth.currentUser(result.accessToken), result.user);
  await assert.rejects(auth.currentUser(result.accessToken + "tampered"));
  await assert.rejects(auth.currentUser(result.refreshToken));
});

test("JWT expiry, signature, issuer and audience are validated", async () => {
  const { auth } = await setup();
  const session = await auth.login("admin@example.com", "correct-password");
  for (const options of [
    { expiry: -1, issuer: "ecard", audience: "ecard-admin", key: secret },
    { expiry: 300, issuer: "other", audience: "ecard-admin", key: secret },
    { expiry: 300, issuer: "ecard", audience: "other", key: secret },
    { expiry: 300, issuer: "ecard", audience: "ecard-admin", key: secret + "other" },
  ]) {
    const token = await new SignJWT({ type: "access", session: session.sessionHash }).setProtectedHeader({ alg: "HS256" })
      .setSubject(session.user.id).setIssuedAt().setExpirationTime(Math.floor(Date.now() / 1000) + options.expiry)
      .setIssuer(options.issuer).setAudience(options.audience).sign(new TextEncoder().encode(options.key));
    await assert.rejects(auth.currentUser(token));
  }
});

test("refresh rotates once, old tokens fail and only one concurrent request wins", async () => {
  const { auth } = await setup();
  const first = await auth.login("admin@example.com", "correct-password");
  const outcomes = await Promise.allSettled([auth.refresh(first.refreshToken), auth.refresh(first.refreshToken)]);
  assert.equal(outcomes.filter((r) => r.status === "fulfilled").length, 1);
  const winner = outcomes.find((r) => r.status === "fulfilled");
  assert.ok(winner?.status === "fulfilled");
  assert.notEqual(winner.value.refreshToken, first.refreshToken);
  await assert.rejects(auth.refresh(first.refreshToken));
  await assert.rejects(auth.currentUser(first.accessToken));
  assert.deepEqual(await auth.currentUser(winner.value.accessToken), first.user);
});

test("expired refresh, logout and new login invalidate old sessions", async () => {
  const { auth, repo } = await setup();
  const first = await auth.login("admin@example.com", "correct-password");
  const second = await auth.login("admin@example.com", "correct-password");
  await assert.rejects(auth.currentUser(first.accessToken));
  await assert.rejects(auth.refresh(first.refreshToken));
  await auth.logout(first.refreshToken);
  assert.deepEqual(await auth.currentUser(second.accessToken), second.user);
  await auth.logout(second.refreshToken);
  await assert.rejects(auth.currentUser(second.accessToken));
  await assert.rejects(auth.refresh(second.refreshToken));
  await repo.startSession(first.user.id, tokenHash(first.refreshToken), new Date(Date.now() - 1));
  await assert.rejects(auth.refresh(first.refreshToken));
});

test("concurrent password changes have one winner, store Argon2 and revoke the session", async () => {
  const { auth, snapshot } = await setup();
  const session = await auth.login("admin@example.com", "correct-password");
  const outcomes = await Promise.allSettled([
    auth.changePassword(session.accessToken, "correct-password", "new-password-one"),
    auth.changePassword(session.accessToken, "correct-password", "new-password-two"),
  ]);
  assert.equal(outcomes.filter((result) => result.status === "fulfilled").length, 1);
  const winner = outcomes[0].status === "fulfilled" ? "new-password-one" : "new-password-two";
  assert.ok(await verify(snapshot().passwordHash, winner));
  assert.notEqual(snapshot().passwordHash, winner);
  assert.equal(snapshot().refreshTokenHash, null);
  await assert.rejects(auth.currentUser(session.accessToken));
  await assert.rejects(auth.refresh(session.refreshToken));
});

test("HTTP endpoints: cookies, CSRF, validation, session rotation, logout and sanitized errors", async () => {
  process.env.DATABASE_URL = "postgresql://localhost:5432/auth_tests_never_connected";
  process.env.JWT_SECRET = secret;
  process.env.NEXT_PUBLIC_SITE_URL = "https://ecard.example.com";
  Object.assign(process.env, { NODE_ENV: "production" });
  const { NextRequest } = await import("next/server");
  const { serverAuth } = await import("../src/server/auth/runtime");
  // Test actual route handlers with an isolated repository; never use an external DB.
  const { auth } = await setup();
  Object.assign(serverAuth, auth);
  const { POST: login } = await import("../src/app/api/auth/login/route");
  const { POST: refresh } = await import("../src/app/api/auth/refresh/route");
  const { POST: logout } = await import("../src/app/api/auth/logout/route");
  const { GET: me } = await import("../src/app/api/auth/me/route");
  const request = (path: string, body?: unknown, cookie = "", origin = "https://ecard.example.com") => new NextRequest(`https://ecard.example.com/api/auth/${path}`, {
    method: path === "me" ? "GET" : "POST",
    headers: { origin, "content-type": "application/json", cookie },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const body = { email: "admin@example.com", password: "correct-password" };
  assert.equal((await login(request("login", body, "", "https://attacker.example"))).status, 403);
  assert.equal((await login(request("login", {}))).status, 400);
  const badJson = request("login", body);
  Object.defineProperty(badJson, "text", { value: async () => "{" });
  assert.equal((await login(badJson)).status, 400);
  assert.equal((await login(request("login", { ...body, password: "wrong" }))).status, 401);
  const loggedIn = await login(request("login", body));
  assert.equal(loggedIn.status, 200);
  assert.equal(loggedIn.headers.get("cache-control"), "no-store");
  for (const name of ["db_lookup", "password", "tokens", "db_session", "total"]) {
    assert.match(loggedIn.headers.get("server-timing")!, new RegExp(`${name};dur=\\d`));
  }
  assert.deepEqual(Object.keys(await loggedIn.json()), ["user"]);
  const access = loggedIn.cookies.get("ecard_access")!;
  const token = loggedIn.cookies.get("ecard_refresh")!;
  assert.ok(access.httpOnly && token.httpOnly);
  assert.ok(access.secure && token.secure);
  assert.equal(access.path, "/");
  assert.equal(token.path, "/api/auth");
  assert.equal(token.sameSite, "lax");
  assert.equal(access.maxAge, 900);
  assert.equal(token.maxAge, 604800);
  const cookie = `ecard_access=${access.value}; ecard_refresh=${token.value}`;
  const profile = await me(request("me", undefined, cookie));
  assert.equal(profile.status, 200);
  assert.equal(profile.headers.get("cache-control"), "no-store");
  assert.deepEqual(await profile.json(), {
    user: { id: "211cb740-bad0-4940-9c21-859b6c580434", email: body.email },
  });
  assert.equal((await me(request("me", undefined, `ecard_access=${access.value}tampered`))).status, 401);
  assert.equal((await me(request("me"))).status, 401);
  assert.equal((await refresh(request("refresh"))).status, 401);
  assert.equal((await refresh(request("refresh", undefined, "ecard_refresh=invalid"))).status, 401);
  assert.equal((await refresh(request("refresh", undefined, cookie, "https://attacker.example"))).status, 403);
  const rotated = await refresh(request("refresh", undefined, cookie));
  assert.equal(rotated.status, 200);
  assert.equal(rotated.headers.get("cache-control"), "no-store");
  assert.deepEqual(await rotated.json(), { user: { id: "211cb740-bad0-4940-9c21-859b6c580434", email: body.email } });
  assert.notEqual(rotated.cookies.get("ecard_refresh")!.value, token.value);
  assert.equal((await me(request("me", undefined, cookie))).status, 401);
  assert.equal((await refresh(request("refresh", undefined, cookie))).status, 401);
  const nextCookie = `ecard_access=${rotated.cookies.get("ecard_access")!.value}; ecard_refresh=${rotated.cookies.get("ecard_refresh")!.value}`;
  assert.equal((await logout(request("logout", undefined, nextCookie, "https://attacker.example"))).status, 403);
  const loggedOut = await logout(request("logout", undefined, nextCookie));
  assert.equal(loggedOut.status, 200);
  assert.equal(loggedOut.cookies.get("ecard_access")!.maxAge, 0);
  assert.equal(loggedOut.cookies.get("ecard_refresh")!.maxAge, 0);
  assert.equal((await me(request("me", undefined, nextCookie))).status, 401);
  assert.equal((await refresh(request("refresh", undefined, nextCookie))).status, 401);
  for (let i = 0; i < 10; i++) assert.equal((await login(request("login", { ...body, email: "limited@example.com" }))).status, 401);
  assert.equal((await login(request("login", { ...body, email: "limited@example.com" }))).status, 429);
  serverAuth.login = async () => { throw new Error("sensitive database error"); };
  const failed = await login(request("login", body));
  assert.equal(failed.status, 503);
  assert.ok(!(await failed.text()).includes("sensitive"));

  // Test changePassword endpoint
  Object.assign(serverAuth, auth);
  const { POST: changePasswordRoute } = await import("../src/app/api/auth/password/route");
  const validLogin = await login(request("login", body));
  const authCookie = `ecard_access=${validLogin.cookies.get("ecard_access")!.value}`;
  const oldRefreshCookie = `ecard_refresh=${validLogin.cookies.get("ecard_refresh")!.value}`;

  // Invalid inputs
  assert.equal((await changePasswordRoute(request("password", { currentPassword: "correct-password", newPassword: "new-secret-password-123" }))).status, 401);
  assert.equal((await changePasswordRoute(request("password", { currentPassword: "correct-password", newPassword: "new-secret-password-123" }, authCookie, "https://attacker.example"))).status, 403);
  assert.equal((await changePasswordRoute(request("password", {}, authCookie))).status, 400);
  assert.equal((await changePasswordRoute(request("password", { currentPassword: "wrong", newPassword: "new-secret-password-123" }, authCookie))).status, 400);
  assert.equal((await changePasswordRoute(request("password", { currentPassword: "correct-password", newPassword: "short" }, authCookie))).status, 400);
  assert.equal((await changePasswordRoute(request("password", { currentPassword: "correct-password", newPassword: "correct-password" }, authCookie))).status, 400);

  // Success
  const pwSuccess = await changePasswordRoute(request("password", { currentPassword: "correct-password", newPassword: "new-secret-password-123" }, authCookie));
  assert.equal(pwSuccess.status, 200);
  assert.equal(pwSuccess.cookies.get("ecard_access")!.maxAge, 0);
  assert.equal(pwSuccess.cookies.get("ecard_refresh")!.maxAge, 0);
  assert.equal((await me(request("me", undefined, authCookie))).status, 401);
  assert.equal((await refresh(request("refresh", undefined, oldRefreshCookie))).status, 401);
  assert.equal((await login(request("login", body))).status, 401);

  // Can now login with the new password
  const newLogin = await login(request("login", { email: "admin@example.com", password: "new-secret-password-123" }));
  assert.equal(newLogin.status, 200);
});

test("in-memory LRU cache serves repeated currentUser lookups and invalidates on password change, logout or revoke", async () => {
  let byIdCalls = 0;
  let admin: AdminRecord | null = {
    id: "211cb740-bad0-4940-9c21-859b6c580434",
    email: "admin@example.com",
    passwordHash: await hash("correct-password"),
    refreshTokenHash: null,
    refreshExpiresAt: null,
  };
  const repo: AuthRepository = {
    async byEmail(email) { return admin && email === admin.email ? { ...admin } : null; },
    async byId(id) {
      byIdCalls++;
      return admin && id === admin.id ? { ...admin } : null;
    },
    async byRefreshHash(value) { return admin && value === admin.refreshTokenHash ? { ...admin } : null; },
    async startSession(_id, refreshTokenHash, refreshExpiresAt) {
      if (admin) admin = { ...admin, refreshTokenHash, refreshExpiresAt };
    },
    async rotateSession(id, previousHash, refreshTokenHash, refreshExpiresAt) {
      if (!admin || id !== admin.id || previousHash !== admin.refreshTokenHash || !admin.refreshExpiresAt || admin.refreshExpiresAt <= new Date()) return false;
      admin = { ...admin, refreshTokenHash, refreshExpiresAt };
      return true;
    },
    async endSession(value) {
      if (admin && admin.refreshTokenHash === value) admin = { ...admin, refreshTokenHash: null, refreshExpiresAt: null };
    },
    async updatePassword(id, previousHash, sessionHash, passwordHash) {
      if (!admin || id !== admin.id || previousHash !== admin.passwordHash || sessionHash !== admin.refreshTokenHash || !admin.refreshExpiresAt || admin.refreshExpiresAt <= new Date()) return false;
      admin = { ...admin, passwordHash, refreshTokenHash: null, refreshExpiresAt: null };
      return true;
    },
  };

  const auth = createAuthService(repo, secret, { cacheTtlMs: 12_000, cacheMaxEntries: 2 });

  // 1. Repeated currentUser calls hit the in-memory cache without re-querying repo.byId
  const session1 = await auth.login("admin@example.com", "correct-password");
  assert.equal(byIdCalls, 0);
  assert.deepEqual(await auth.currentUser(session1.accessToken), session1.user);
  assert.equal(byIdCalls, 1);
  assert.deepEqual(await auth.currentUser(session1.accessToken), session1.user);
  assert.deepEqual(await auth.currentUser(session1.accessToken), session1.user);
  assert.equal(byIdCalls, 1);

  // 2. Logout invalidates the cache immediately
  await auth.logout(session1.refreshToken);
  await assert.rejects(auth.currentUser(session1.accessToken));
  assert.equal(byIdCalls, 2);

  // 3. Password change invalidates the cache immediately
  const session2 = await auth.login("admin@example.com", "correct-password");
  await auth.currentUser(session2.accessToken);
  const callsBeforePwChange = byIdCalls;
  await auth.changePassword(session2.accessToken, "correct-password", "updated-password-123");
  await assert.rejects(auth.currentUser(session2.accessToken));
  assert.ok(byIdCalls > callsBeforePwChange);

  // 4. Account disable / manual cache invalidation drops cached record immediately
  const session3 = await auth.login("admin@example.com", "updated-password-123");
  await auth.currentUser(session3.accessToken);
  const callsAfterWarm = byIdCalls;
  admin = null; // Simulate account disabled/deleted in DB
  auth.invalidateUserCache(session3.user.id);
  await assert.rejects(auth.currentUser(session3.accessToken));
  assert.equal(byIdCalls, callsAfterWarm + 1);
});
