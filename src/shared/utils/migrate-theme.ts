import type { CardTheme, DecorKey } from "@/shared/types/employee";
import { getTemplate, isDarkTheme } from "@/config/card-themes";

const keys: DecorKey[] = ["blobs", "circles", "skyline", "waves", "bokeh"];
type StoredTheme = Omit<CardTheme, "decor"> & {
  decor?: unknown;
  patternId?: string;
  pattern?: string;
};

/** Idempotent: only legacy pattern records have their saved opacity capped. */
export function migrateCardTheme(stored: StoredTheme): CardTheme {
  const { patternId, pattern, decor, ...rest } = stored;
  const template = getTemplate(stored.templateId);
  const legacy = !Array.isArray(decor) && (patternId !== undefined || pattern !== undefined);
  const oldPattern = patternId ?? pattern;
  const selected: DecorKey[] = Array.isArray(decor)
    ? [...new Set(decor.filter((key): key is DecorKey => keys.includes(key as DecorKey))) ]
    : legacy
      ? oldPattern === "none" ? [] : [isDarkTheme({ ...rest, decor: [] }) ? "circles" : "blobs"]
      : [...template.defaultDecor];
  const value = stored.decorOpacity;
  const opacity = typeof value === "number" && Number.isFinite(value)
    ? value : template.defaultDecorOpacity;
  return {
    ...rest,
    shapes: stored.shapes ?? {},
    decor: selected,
    decorOpacity: Math.max(0, Math.min(legacy ? 80 : 100, opacity)),
  };
}
