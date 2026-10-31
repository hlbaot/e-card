import { getContact } from "@/server/cards/controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = getContact;
