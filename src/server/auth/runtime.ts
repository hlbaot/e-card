import "server-only";
import { env } from "@/server/config/env";
import { createAuthService } from "./service";
import { authRepository } from "./repository";

const globalForAuth = globalThis as unknown as {
  serverAuth: ReturnType<typeof createAuthService> | undefined;
};

export const serverAuth =
  globalForAuth.serverAuth ?? createAuthService(authRepository, env.JWT_SECRET);

if (env.NODE_ENV !== "production") {
  globalForAuth.serverAuth = serverAuth;
}
