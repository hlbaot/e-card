import { createHash, randomBytes } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";
import { SignJWT, jwtVerify } from "jose";

export const ACCESS_TTL = 15 * 60;
export const REFRESH_TTL = 7 * 24 * 60 * 60;
export class AuthError extends Error {
  constructor(message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", public status = 401) { super(message); }
}
export interface AdminRecord {
  id: string;
  email: string;
  passwordHash: string;
  refreshTokenHash: string | null;
  refreshExpiresAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface AuthRepository {
  byEmail(email: string): Promise<AdminRecord | null>;
  byId(id: string): Promise<AdminRecord | null>;
  byRefreshHash(hash: string): Promise<AdminRecord | null>;
  startSession(id: string, hash: string, expires: Date): Promise<void>;
  rotateSession(id: string, previousHash: string, hash: string, expires: Date): Promise<boolean>;
  endSession(hash: string): Promise<void>;
  updatePassword(id: string, previousHash: string, sessionHash: string, passwordHash: string): Promise<boolean>;
}
export const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
const validRefresh = (token: string) => /^[a-f0-9]{64}$/.test(token);
let dummyHash: Promise<string> | undefined;

export function createAuthService(repo: AuthRepository, secret: string) {
  if (Buffer.byteLength(secret) < 32) throw new Error("JWT_SECRET must be at least 32 bytes");
  const key = new TextEncoder().encode(secret);
  const issuer = "ecard";
  const audience = "ecard-admin";
  async function tokens(admin: AdminRecord) {
    const refreshToken = randomBytes(32).toString("hex");
    const sessionHash = tokenHash(refreshToken);
    const refreshExpiresAt = new Date(Date.now() + REFRESH_TTL * 1000);
    const accessToken = await new SignJWT({ session: sessionHash, type: "access" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(admin.id).setIssuer(issuer).setAudience(audience)
      .setIssuedAt().setExpirationTime(`${ACCESS_TTL}s`).sign(key);
    return { accessToken, refreshToken, sessionHash, refreshExpiresAt, user: { id: admin.id, email: admin.email } };
  }
  return {
    async login(email: string, password: string) {
      const started = performance.now();
      const admin = await repo.byEmail(email.trim().toLowerCase());
      const lookedUp = performance.now();
      dummyHash ??= hash(randomBytes(32).toString("hex"));
      const matches = await verify(admin?.passwordHash ?? await dummyHash, password);
      if (!admin || !matches) throw new AuthError("Email hoặc mật khẩu không chính xác.");
      const verified = performance.now();
      const result = await tokens(admin);
      const issued = performance.now();
      await repo.startSession(admin.id, result.sessionHash, result.refreshExpiresAt);
      const stored = performance.now();
      return { ...result, timings: {
        db_lookup: lookedUp - started, password: verified - lookedUp,
        tokens: issued - verified, db_session: stored - issued, total: stored - started,
      } };
    },
    async refresh(token: string) {
      // Token gốc là 32 byte ngẫu nhiên được mã hóa thành 64 ký tự hex.
      if (!validRefresh(token)) throw new AuthError();
      // DB chỉ giữ SHA-256 của token; không lưu giá trị cookie gốc.
      const previousHash = tokenHash(token);
      const admin = await repo.byRefreshHash(previousHash);
      if (!admin?.refreshExpiresAt || admin.refreshExpiresAt.getTime() <= Date.now()) throw new AuthError();
      // Tạo access JWT và refresh token mới, với hạn refresh tính lại từ hiện tại.
      const result = await tokens(admin);
      // Chỉ thay phiên nếu hash cũ vẫn khớp và phiên chưa hết hạn tại lúc ghi DB.
      // Nếu refresh đồng thời hoặc logout đã thu hồi phiên, chỉ request thắng được trả token.
      if (!await repo.rotateSession(admin.id, previousHash, result.sessionHash, result.refreshExpiresAt)) throw new AuthError();
      // Hash phiên đã đổi nên cả access token lẫn refresh token cũ đều mất hiệu lực.
      return result;
    },
    async currentUser(token: string) {
      let payload;
      try {
        ({ payload } = await jwtVerify(token, key, { algorithms: ["HS256"], issuer, audience, requiredClaims: ["sub", "exp", "iat"] }));
      } catch { throw new AuthError(); }
      if (payload.type !== "access" || typeof payload.sub !== "string" || typeof payload.session !== "string") throw new AuthError();
      const admin = await repo.byId(payload.sub);
      if (!admin || admin.refreshTokenHash !== payload.session || !admin.refreshExpiresAt || admin.refreshExpiresAt.getTime() <= Date.now()) throw new AuthError();
      return { id: admin.id, email: admin.email };
    },
    async changePassword(token: string, currentPassword: string, newPassword: string) {
      let payload;
      try {
        ({ payload } = await jwtVerify(token, key, { algorithms: ["HS256"], issuer, audience, requiredClaims: ["sub", "exp", "iat"] }));
      } catch { throw new AuthError(); }
      if (payload.type !== "access" || typeof payload.sub !== "string" || typeof payload.session !== "string") throw new AuthError();
      const admin = await repo.byId(payload.sub);
      if (!admin || admin.refreshTokenHash !== payload.session || !admin.refreshExpiresAt || admin.refreshExpiresAt.getTime() <= Date.now()) {
        throw new AuthError();
      }
      const matches = await verify(admin.passwordHash, currentPassword);
      if (!matches) {
        throw new AuthError("Mật khẩu hiện tại không chính xác.", 400);
      }
      if (currentPassword === newPassword) {
        throw new AuthError("Mật khẩu mới không được trùng với mật khẩu hiện tại.", 400);
      }
      const newHash = await hash(newPassword);
      // Chỉ cập nhật nếu mật khẩu và phiên vẫn khớp lúc kiểm tra.
      // Hai yêu cầu đổi mật khẩu đồng thời chỉ có một yêu cầu thành công.
      if (!await repo.updatePassword(admin.id, admin.passwordHash, payload.session, newHash)) throw new AuthError();
      return { success: true };
    },
    async logout(token: string) {
      if (validRefresh(token)) {
        await repo.endSession(tokenHash(token));
      } else if (token) {
        try {
          const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"], issuer, audience });
          if (typeof payload.session === "string") {
            await repo.endSession(payload.session);
          }
        } catch {
          // Ignore invalid token
        }
      }
    },
  };
}
