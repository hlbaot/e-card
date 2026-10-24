import type { DecorKey } from "@/shared/types/employee";

const motifOrder: DecorKey[] = ["blobs", "circles", "bokeh", "leaves", "network", "geometry"];

// Each slot owns a separate rectangle. None enters the contact area (y >= 300),
// the logo, the side caption, or the public profile controls.
const spaciousSlots = [
  { x: 95, y: 54, width: 183, height: 141 },
  { x: 320, y: 104, width: 120, height: 91 },
  { x: -25, y: 155, width: 80, height: 40 },
];

// Extra slots are needed only when more than three different motifs are chosen.
const portraitSlots = [
  { x: 95, y: 58, width: 183, height: 137 },
  { x: 300, y: 110, width: 77, height: 36 },
  { x: 12, y: 160, width: 78, height: 32 },
  { x: 12, y: 58, width: 78, height: 27 },
  { x: 175, y: 15, width: 65, height: 30 },
  { x: 300, y: 154, width: 77, height: 38 },
];

export function getProfileDecorPlacements(decor: DecorKey[]) {
  const selected = motifOrder.filter(key => decor.includes(key));
  if (!selected.length) return [];
  // Use three broad masses for the usual one-to-three motif combination.
  // Each selected motif still has its own area when more are enabled.
  const slots = selected.length <= 3 ? spaciousSlots : portraitSlots;
  return slots.map((slot, index) => ({
    ...slot,
    decor: selected[index % selected.length],
  }));
}
