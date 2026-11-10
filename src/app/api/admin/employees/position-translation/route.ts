import type { NextRequest } from "next/server";
import { adminHandler, readJson } from "@/server/admin/http";
import { positionTranslationInput, suggestPositionTranslation } from "@/server/admin/position-translation";
import { authJson } from "@/server/auth/http";

export const runtime = "nodejs";

export const POST = (request: NextRequest) =>
  adminHandler(request, async () => {
    const input = await readJson(request, positionTranslationInput);
    const title = await suggestPositionTranslation(input);
    return authJson({ title });
  });
