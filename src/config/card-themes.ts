import {
  backgrounds as baseBackgrounds,
} from "@/config/theme-options";
import type {
  CardPalette,
  CardTheme,
  StyleId,
  TemplateId,
  ThemeTemplate,
} from "@/shared/types";

export const DEFAULT_BACKGROUND_ID = "white-clean";
export const DEFAULT_PRIMARY_COLOR = "#0F4C75";

/** 8 structural styles — typography, button shape, divider, avatar frame, and decor layout.
 * Purely structural: defaults to white background and QTM brand blue. Styles contain NO colors. */
export const templates: ThemeTemplate[] = [
  {
    id: "bubble-blue",
    name: "themeCustomizer.templates.bubbleBlue.name",
    description: "themeCustomizer.templates.bubbleBlue.description",
    defaultBackgroundId: DEFAULT_BACKGROUND_ID,
    defaultColor: DEFAULT_PRIMARY_COLOR,
    fontFamily: '"Trebuchet MS", var(--font-body), Arial, sans-serif',
    fontStyle: "sans",
    fontWeight: 800,
    letterSpacing: "-0.025em",
    buttonShape: "pill",
    buttonBorder: "none",
    buttonStyle: "soft",
    avatarFrame: "circle",
    dividerStyle: "pill-bar",
    defaultDecor: ["blobs"],
    defaultDecorOpacity: 35,
    shapes: [{ id: "accent-bar", label: "themeCustomizer.shapes.accentBar" }],
    decorations: [{ id: "accent-bar", label: "themeCustomizer.shapes.accentBar", layer: "motif" }],
  },
  {
    id: "minimal-line",
    name: "themeCustomizer.templates.minimalLine.name",
    description: "themeCustomizer.templates.minimalLine.description",
    defaultBackgroundId: DEFAULT_BACKGROUND_ID,
    defaultColor: DEFAULT_PRIMARY_COLOR,
    fontFamily: 'Arial, var(--font-body), sans-serif',
    fontStyle: "sans",
    fontWeight: 500,
    letterSpacing: "0.07em",
    buttonShape: "square-thin",
    buttonBorder: "thin",
    buttonStyle: "outline",
    avatarFrame: "circle-thin",
    dividerStyle: "thin-line",
    defaultDecor: ["blobs"],
    defaultDecorOpacity: 35,
    shapes: [{ id: "top-line", label: "themeCustomizer.shapes.topLine" }],
    decorations: [{ id: "top-line", label: "themeCustomizer.shapes.topLine", layer: "motif" }],
  },
  {
    id: "dark-tech",
    name: "themeCustomizer.templates.darkTech.name",
    description: "themeCustomizer.templates.darkTech.description",
    defaultBackgroundId: DEFAULT_BACKGROUND_ID,
    defaultColor: DEFAULT_PRIMARY_COLOR,
    fontFamily: '"Courier New", monospace',
    fontStyle: "mono",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    buttonShape: "square-sharp",
    buttonBorder: "solid",
    buttonStyle: "soft",
    avatarFrame: "orbit",
    dividerStyle: "dashed-orbit",
    defaultDecor: ["blobs"],
    defaultDecorOpacity: 35,
    shapes: [{ id: "corner-glow", label: "themeCustomizer.shapes.cornerGlow" }],
    decorations: [{ id: "corner-glow", label: "themeCustomizer.shapes.cornerGlow", layer: "motif" }],
  },
  {
    id: "editorial",
    name: "themeCustomizer.templates.editorial.name",
    description: "themeCustomizer.templates.editorial.description",
    defaultBackgroundId: DEFAULT_BACKGROUND_ID,
    defaultColor: DEFAULT_PRIMARY_COLOR,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontStyle: "serif",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    buttonShape: "square-single",
    buttonBorder: "single",
    buttonStyle: "outline",
    avatarFrame: "editorial-frame",
    dividerStyle: "straight-solid",
    defaultDecor: ["blobs"],
    defaultDecorOpacity: 35,
    shapes: [
      { id: "editorial-frame", label: "themeCustomizer.shapes.editorialFrame" },
      { id: "editorial-lines", label: "themeCustomizer.shapes.editorialLines" },
    ],
    decorations: [
      { id: "editorial-frame", label: "themeCustomizer.shapes.editorialFrame", layer: "motif" },
      { id: "editorial-lines", label: "themeCustomizer.shapes.editorialLines", layer: "motif" },
    ],
  },
  {
    id: "aurora",
    name: "themeCustomizer.templates.aurora.name",
    description: "themeCustomizer.templates.aurora.description",
    defaultBackgroundId: DEFAULT_BACKGROUND_ID,
    defaultColor: DEFAULT_PRIMARY_COLOR,
    fontFamily: '"Trebuchet MS", Arial, sans-serif',
    fontStyle: "sans",
    fontWeight: 600,
    letterSpacing: "0.03em",
    buttonShape: "rounded-glow",
    buttonBorder: "gradient",
    buttonStyle: "soft",
    avatarFrame: "concentric",
    dividerStyle: "glow-gradient",
    defaultDecor: ["blobs"],
    defaultDecorOpacity: 35,
    shapes: [
      { id: "aurora-glow", label: "themeCustomizer.shapes.auroraGlow" },
      { id: "orbit-rings", label: "themeCustomizer.shapes.orbitRings" },
    ],
    decorations: [
      { id: "aurora-glow", label: "themeCustomizer.shapes.auroraGlow", layer: "gradient" },
      { id: "orbit-rings", label: "themeCustomizer.shapes.orbitRings", layer: "motif" },
    ],
  },
  {
    id: "luxury",
    name: "themeCustomizer.templates.luxury.name",
    description: "themeCustomizer.templates.luxury.description",
    defaultBackgroundId: DEFAULT_BACKGROUND_ID,
    defaultColor: DEFAULT_PRIMARY_COLOR,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontStyle: "serif",
    fontWeight: 500,
    letterSpacing: "0.09em",
    buttonShape: "square-double",
    buttonBorder: "double",
    buttonStyle: "outline",
    avatarFrame: "double-ring",
    dividerStyle: "diamond-center",
    defaultDecor: ["blobs"],
    defaultDecorOpacity: 35,
    shapes: [
      { id: "gold-frame", label: "themeCustomizer.shapes.goldFrame" },
      { id: "corner-diamonds", label: "themeCustomizer.shapes.cornerDiamonds" },
    ],
    decorations: [
      { id: "gold-frame", label: "themeCustomizer.shapes.goldFrame", layer: "motif" },
      { id: "corner-diamonds", label: "themeCustomizer.shapes.cornerDiamonds", layer: "motif" },
    ],
  },
  {
    id: "botanical",
    name: "themeCustomizer.templates.botanical.name",
    description: "themeCustomizer.templates.botanical.description",
    defaultBackgroundId: DEFAULT_BACKGROUND_ID,
    defaultColor: DEFAULT_PRIMARY_COLOR,
    fontFamily: 'Palatino, "Palatino Linotype", Georgia, serif',
    fontStyle: "serif",
    fontWeight: 700,
    letterSpacing: "0",
    buttonShape: "organic",
    buttonBorder: "solid",
    buttonStyle: "soft",
    avatarFrame: "organic",
    dividerStyle: "organic-wave",
    defaultDecor: ["blobs"],
    defaultDecorOpacity: 35,
    shapes: [
      { id: "leaf-branches", label: "themeCustomizer.shapes.leafBranches" },
      { id: "organic-blob", label: "themeCustomizer.shapes.organicBlob" },
    ],
    decorations: [
      { id: "leaf-branches", label: "themeCustomizer.shapes.leafBranches", layer: "motif" },
      { id: "organic-blob", label: "themeCustomizer.shapes.organicBlob", layer: "motif" },
    ],
  },
  {
    id: "creative",
    name: "themeCustomizer.templates.creative.name",
    description: "themeCustomizer.templates.creative.description",
    defaultBackgroundId: DEFAULT_BACKGROUND_ID,
    defaultColor: DEFAULT_PRIMARY_COLOR,
    fontFamily: 'Verdana, Arial, sans-serif',
    fontStyle: "sans",
    fontWeight: 900,
    letterSpacing: "-0.045em",
    buttonShape: "rounded-thick",
    buttonBorder: "thick",
    buttonStyle: "soft",
    avatarFrame: "offset-shadow",
    dividerStyle: "geometric-split",
    defaultDecor: ["blobs"],
    defaultDecorOpacity: 35,
    shapes: [
      { id: "color-blocks", label: "themeCustomizer.shapes.colorBlocks" },
      { id: "playful-dots", label: "themeCustomizer.shapes.playfulDots" },
    ],
    decorations: [
      { id: "color-blocks", label: "themeCustomizer.shapes.colorBlocks", layer: "motif" },
      { id: "playful-dots", label: "themeCustomizer.shapes.playfulDots", layer: "motif" },
    ],
  },
];

export const cardStyles = templates;

/** Curated Color Palettes — selecting a palette synchronizes background, buttons, borders & accents without touching the style. */
export const palettes: CardPalette[] = [
  {
    id: "default-qtm",
    name: "themeCustomizer.palettes.defaultQtm",
    backgroundId: "white-clean",
    backgroundCss: "#F7FBFE",
    primaryColor: "#0F4C75",
    accentColor: "#22D3EE",
    textColor: "#17394B",
    borderColor: "#0F4C75",
  },
  {
    id: "ocean-breeze",
    name: "themeCustomizer.palettes.oceanBreeze",
    backgroundId: "sky-soft",
    backgroundCss: "linear-gradient(180deg,#F8FBFE 0%,#EDF5FC 100%)",
    primaryColor: "#0369A1",
    accentColor: "#38BDF8",
    textColor: "#0C4A6E",
    borderColor: "#0369A1",
  },
  {
    id: "mint-fresh",
    name: "themeCustomizer.palettes.mintFresh",
    backgroundId: "mint-fresh",
    backgroundCss: "linear-gradient(180deg,#F8FDFB 0%,#EAF7F2 100%)",
    primaryColor: "#0E9F6E",
    accentColor: "#6EE7B7",
    textColor: "#065F46",
    borderColor: "#0E9F6E",
  },
  {
    id: "lavender-mist",
    name: "themeCustomizer.palettes.lavenderMist",
    backgroundId: "lavender-mist",
    backgroundCss: "linear-gradient(145deg,#F4F9FF,#E8F2FD)",
    primaryColor: "#0284C7",
    accentColor: "#38BDF8",
    textColor: "#0C4A6E",
    borderColor: "#0284C7",
  },
  {
    id: "sage-garden",
    name: "themeCustomizer.palettes.sageGarden",
    backgroundId: "sage-garden",
    backgroundCss: "linear-gradient(160deg,#FAFBF7,#EFF3E8)",
    primaryColor: "#3F6212",
    accentColor: "#84CC16",
    textColor: "#1A2E05",
    borderColor: "#3F6212",
  },
  {
    id: "charcoal-slate",
    name: "themeCustomizer.palettes.charcoalSlate",
    backgroundId: "white-clean",
    backgroundCss: "linear-gradient(160deg,#F8FAFC,#EDF2F7)",
    primaryColor: "#64748B",
    accentColor: "#94A3B8",
    textColor: "#334155",
    borderColor: "#64748B",
  },
  {
    id: "ice-cyan",
    name: "themeCustomizer.palettes.iceCyan",
    backgroundId: "ice-blue",
    backgroundCss: "linear-gradient(160deg,#F7FEFF 0%,#E9F7FA 100%)",
    primaryColor: "#0891B2",
    accentColor: "#22D3EE",
    textColor: "#164E63",
    borderColor: "#0891B2",
  },
];

export const backgrounds = [
  ...baseBackgrounds.map((b) => ({ ...b, dark: false })),
  { id: "paper-cream", name: "themeCustomizer.backgrounds.paperCream", css: "#FCF8F0", dark: false },
  {
    id: "lavender-mist",
    name: "themeCustomizer.backgrounds.lavenderMist",
    css: "linear-gradient(145deg,#F4F9FF,#E8F3FD)",
    dark: false,
  },
  {
    id: "peach-blush",
    name: "themeCustomizer.backgrounds.peachBlush",
    css: "linear-gradient(145deg,#FFFDF8,#FAF4E8)",
    dark: false,
  },
  {
    id: "sage-garden",
    name: "themeCustomizer.backgrounds.sageGarden",
    css: "linear-gradient(160deg,#F5F7EC,#E7EEDF)",
    dark: false,
  },
  {
    id: "ice-blue",
    name: "themeCustomizer.backgrounds.iceBlue",
    css: "linear-gradient(160deg,#F0FDFF,#DDEAFD)",
    dark: false,
  },
  { id: "rose-cream", name: "themeCustomizer.backgrounds.roseCream", css: "#F8FAFC", dark: false },
];

export { decorOptions } from "@/config/theme-options";

export const colorPresets = [
  { name: "themeCustomizer.colorPresets.qtmBlue", hex: "#0F4C75" },
  { name: "themeCustomizer.colorPresets.oceanBlue", hex: "#0284C7" },
  { name: "themeCustomizer.colorPresets.softSeaBlue", hex: "#2563EB" },
  { name: "themeCustomizer.colorPresets.skyBlue", hex: "#38BDF8" },
  { name: "themeCustomizer.colorPresets.turquoise", hex: "#0891B2" },
  { name: "themeCustomizer.colorPresets.jadeGreen", hex: "#0D9488" },
  { name: "themeCustomizer.colorPresets.emeraldGreen", hex: "#10B981" },
  { name: "themeCustomizer.colorPresets.softMint", hex: "#6EE7B7" },
  { name: "themeCustomizer.colorPresets.sageGreen", hex: "#65A30D" },
  { name: "themeCustomizer.colorPresets.slateGray", hex: "#64748B" },
  { name: "themeCustomizer.colorPresets.metallicSilver", hex: "#94A3B8" },
];

export function getTemplate(id: TemplateId | StyleId): ThemeTemplate {
  return templates.find((t) => t.id === id) || templates[0];
}

export const getStyle = getTemplate;

export function getPalette(id: string): CardPalette {
  return palettes.find((p) => p.id === id) || palettes[0];
}

export function isDarkTheme(theme: CardTheme): boolean {
  const bg = backgrounds.find((b) => b.id === theme.backgroundId);
  return Boolean(bg?.dark);
}

export function getThemeBackgroundCss(theme: CardTheme): string {
  const bg = backgrounds.find((b) => b.id === theme.backgroundId);
  return bg && !bg.dark ? bg.css : "#FFFFFF";
}
