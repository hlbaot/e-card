import type { DecorKey } from "@/shared/types";

export const motifOrder: DecorKey[] = [
  "blobs",
  "bokeh",
  "circles",
  "leaves",
  "geometry",
  "network",
  "crystals",
];

// Percent coordinates relative to full card surface (edges only, never over center text)
export const DECOR_EDGE_ANCHORS = {
  avatarHalo: { x: "50%", y: "20%", radius: "22%" },
  topRight: { x: "92%", y: "8%", radius: "18%" },
  midLeft: { x: "4%", y: "42%", radius: "12%" },
} as const;

// Coordinates belong to the portrait's 390 × 200 canvas, not the whole page.
// Reserve the caption (x 0..90, y 45..165) and toolbar (x 280..390, y 0..60).
// The SVG is clipped to the portrait, so no motif can reach names or contacts.
const spaciousSlots = [
  { x: 95, y: 0, width: 183, height: 195 },
  { x: 320, y: 80, width: 120, height: 120 },
  { x: -25, y: 170, width: 80, height: 30 },
  { x: 10, y: 0, width: 70, height: 30 },
  { x: 285, y: 65, width: 30, height: 45 },
  { x: 60, y: 170, width: 25, height: 25 },
];

export function getProfileDecorPlacements(decor: DecorKey[]) {
  // Only the first valid decor is used now (single selection)
  const single = decor.filter(
    (key) => key !== "skyline" && key !== "waves" && motifOrder.includes(key),
  ).slice(0, 1);
  if (!single.length) return [];
  // Retain slots compatible with existing callers and tests
  const slots = spaciousSlots;
  return slots.map((slot) => ({
    ...slot,
    decor: single[0],
  }));
}

