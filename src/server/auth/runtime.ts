import "server-only";
import { env } from "@/server/config/env";
import { createAuthService } from "./service";
import { authRepository } from "./repository";

export const serverAuth = createAuthService(authRepository, env.JWT_SECRET);
