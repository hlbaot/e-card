import type { CardTheme, DecorKey, StyleId } from "@/shared/types";
import {
  getTemplate,
  DEFAULT_BACKGROUND_ID,
  DEFAULT_PRIMARY_COLOR,
} from "@/config/card-themes";

const validMotifs: DecorKey[] = [
  "blobs",
  "bokeh",
  "circles",
  "leaves",
  "geometry",
  "network",
];

type StoredTheme = Omit<CardTheme, "decor"> & {
  decor?: unknown;
  patternId?: string;
  pattern?: string;
};

/** Idempotent: migrates legacy theme data to single-decor selection (at most 1)
 * and clamps opacity to max 60%. Skyline is now a permanent footer element. */
export function migrateCardTheme(stored: StoredTheme): CardTheme {
  const { patternId, pattern, decor, ...rest } = stored;
  const styleId = (stored.templateId ?? stored.styleId ?? "bubble-blue") as StyleId;
  const template = getTemplate(styleId);

  let selected: DecorKey[] = [];
  if (Array.isArray(decor)) {
    const mapped = decor.map((k) => (k === "waves" ? "blobs" : k));
    const filtered = mapped.filter(
      (key): key is DecorKey =>
        key !== "skyline" && validMotifs.includes(key as DecorKey),
    );
    selected = filtered.length > 0 ? [filtered[0]] : [];
  } else if (patternId !== undefined || pattern !== undefined) {
    const oldPattern = patternId ?? pattern;
    selected =
      oldPattern === "none"
        ? []
        : [styleId === "dark-tech" || styleId === "luxury" ? "circles" : "blobs"];
  } else {
    selected = [...template.defaultDecor.filter((k) => k !== "skyline" && k !== "waves").slice(0, 1)];
    if (selected.length === 0) selected = ["blobs"];
  }

  const value = stored.decorOpacity;
  const rawOpacity =
    typeof value === "number" && Number.isFinite(value)
      ? value
      : (template.defaultDecorOpacity ?? 35);
  const decorOpacity = Math.max(0, Math.min(60, rawOpacity));

  return {
    ...rest,
    templateId: styleId,
    styleId,
    backgroundId: stored.backgroundId || DEFAULT_BACKGROUND_ID,
    primaryColor: stored.primaryColor || DEFAULT_PRIMARY_COLOR,
    shapes: stored.shapes ?? {},
    decor: selected,
    decorOpacity,
  };
}
