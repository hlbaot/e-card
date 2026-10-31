import type { TemplateOption, DecorKey } from "@/shared/types";

export const templates: TemplateOption[] = [
  {
    id: "bubble-blue",
    name: "themeCustomizer.templates.bubbleBlue.name",
    shapes: [{ id: "accent-bar", label: "themeCustomizer.shapes.accentBar" }],
    defaultBackgroundId: "sky-soft",
    defaultColor: "#0F4C75",
  },
  {
    id: "minimal-line",
    name: "themeCustomizer.templates.minimalLine.name",
    shapes: [{ id: "top-line", label: "themeCustomizer.shapes.topLine" }],
    defaultBackgroundId: "white-clean",
    defaultColor: "#1F2937",
  },
  {
    id: "dark-tech",
    name: "themeCustomizer.templates.darkTech.name",
    shapes: [{ id: "corner-glow", label: "themeCustomizer.shapes.cornerGlow" }],
    defaultBackgroundId: "sky-soft",
    defaultColor: "#38BDF8",
  },
];

export const backgrounds = [
  { id: "sky-soft", name: "themeCustomizer.backgrounds.skySoft", css: "linear-gradient(180deg,#F4FAFF 0%,#E3F1FC 100%)" },
  { id: "white-clean", name: "themeCustomizer.backgrounds.whiteClean", css: "#FFFFFF" },
  { id: "mint-fresh", name: "themeCustomizer.backgrounds.mintFresh", css: "linear-gradient(180deg,#F2FBF8 0%,#DDF3EC 100%)" },
  { id: "sand-warm", name: "themeCustomizer.backgrounds.sandWarm", css: "linear-gradient(180deg,#FFFBF3 0%,#F8EBD4 100%)" },
];

export const decorOptions: { id: DecorKey | "none"; name: string }[] = [
  { id: "none", name: "themeCustomizer.patterns.none" },
  { id: "blobs", name: "themeCustomizer.patterns.blobs" },
  { id: "bokeh", name: "themeCustomizer.patterns.bokeh" },
  { id: "cyber-magazine", name: "themeCustomizer.patterns.cyberMagazine" },
  { id: "leaves", name: "themeCustomizer.patterns.leaves" },
  { id: "geometry", name: "themeCustomizer.patterns.geometry" },
  { id: "network", name: "themeCustomizer.patterns.network" },
  { id: "crystals", name: "themeCustomizer.patterns.crystals" },
];

export const colorPresets = ["#0F4C75", "#0284C7", "#38BDF8", "#0891B2", "#10B981", "#6EE7B7", "#64748B"];
