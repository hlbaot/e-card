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
    name: "Kết nối",
    description: "Nút pill bo tròn · Họa tiết blob mềm · Chữ sans đậm",
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
    shapes: [{ id: "accent-bar", label: "Thanh nhấn góc" }],
    decorations: [{ id: "accent-bar", label: "Thanh nhấn góc", layer: "motif" }],
  },
  {
    id: "minimal-line",
    name: "Tinh giản",
    description: "Nút ô vuông viền mảnh · Chữ thanh · Khoảng trắng tối giản",
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
    shapes: [{ id: "top-line", label: "Nét mảnh ở góc" }],
    decorations: [{ id: "top-line", label: "Nét mảnh ở góc", layer: "motif" }],
  },
  {
    id: "dark-tech",
    name: "Công nghệ",
    description: "Nút vuông góc sắc · Viền quỹ đạo · Chữ mono kỹ thuật",
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
    shapes: [{ id: "corner-glow", label: "Ánh sáng góc" }],
    decorations: [{ id: "corner-glow", label: "Ánh sáng góc", layer: "motif" }],
  },
  {
    id: "editorial",
    name: "Biên tập",
    description: "Nút ô vuông viền đơn · Nét kẻ tạp chí · Chữ serif đậm",
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
      { id: "editorial-frame", label: "Khung viền đơn mảnh" },
      { id: "editorial-lines", label: "Điểm nhấn góc mềm" },
    ],
    decorations: [
      { id: "editorial-frame", label: "Khung viền đơn mảnh", layer: "motif" },
      { id: "editorial-lines", label: "Điểm nhấn góc mềm", layer: "motif" },
    ],
  },
  {
    id: "aurora",
    name: "Cực quang",
    description: "Nút bo góc chuyển sắc · Vòng đồng tâm quanh avatar · Viền phát sáng",
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
      { id: "aurora-glow", label: "Điểm sáng góc" },
      { id: "orbit-rings", label: "Cung tròn góc" },
    ],
    decorations: [
      { id: "aurora-glow", label: "Điểm sáng góc", layer: "gradient" },
      { id: "orbit-rings", label: "Cung tròn góc", layer: "motif" },
    ],
  },
  {
    id: "luxury",
    name: "Sang trọng",
    description: "Nút ô vuông viền đôi · Họa tiết kim cương · Chữ serif thanh",
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
      { id: "gold-frame", label: "Khung viền đơn mảnh" },
      { id: "corner-diamonds", label: "Điểm nhấn góc ánh vàng" },
    ],
    decorations: [
      { id: "gold-frame", label: "Khung viền đơn mảnh", layer: "motif" },
      { id: "corner-diamonds", label: "Điểm nhấn góc ánh vàng", layer: "motif" },
    ],
  },
  {
    id: "botanical",
    name: "Thiên nhiên",
    description: "Nút bo góc hữu cơ · Họa tiết cành lá · Chữ cổ điển",
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
      { id: "leaf-branches", label: "Cành lá nghệ thuật" },
      { id: "organic-blob", label: "Đường cong hữu cơ" },
    ],
    decorations: [
      { id: "leaf-branches", label: "Cành lá nghệ thuật", layer: "motif" },
      { id: "organic-blob", label: "Đường cong hữu cơ", layer: "motif" },
    ],
  },
  {
    id: "creative",
    name: "Sáng tạo",
    description: "Nút bo góc viền dày · Bóng lệch pop-art · Chữ sans siêu đậm",
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
      { id: "color-blocks", label: "Khối bo tròn ở góc" },
      { id: "playful-dots", label: "Ba chấm nhỏ ở góc" },
    ],
    decorations: [
      { id: "color-blocks", label: "Khối bo tròn ở góc", layer: "motif" },
      { id: "playful-dots", label: "Ba chấm nhỏ ở góc", layer: "motif" },
    ],
  },
];

export const cardStyles = templates;

/** Curated Color Palettes — selecting a palette synchronizes background, buttons, borders & accents without touching the style. */
export const palettes: CardPalette[] = [
  {
    id: "default-qtm",
    name: "Trắng & Xanh QTM",
    backgroundId: "white-clean",
    backgroundCss: "#F7FBFE",
    primaryColor: "#0F4C75",
    accentColor: "#22D3EE",
    textColor: "#17394B",
    borderColor: "#0F4C75",
  },
  {
    id: "ocean-breeze",
    name: "Xanh đại dương",
    backgroundId: "sky-soft",
    backgroundCss: "linear-gradient(180deg,#F8FBFE 0%,#EDF5FC 100%)",
    primaryColor: "#0369A1",
    accentColor: "#38BDF8",
    textColor: "#0C4A6E",
    borderColor: "#0369A1",
  },
  {
    id: "mint-fresh",
    name: "Bạc hà tươi mát",
    backgroundId: "mint-fresh",
    backgroundCss: "linear-gradient(180deg,#F8FDFB 0%,#EAF7F2 100%)",
    primaryColor: "#0E9F6E",
    accentColor: "#6EE7B7",
    textColor: "#065F46",
    borderColor: "#0E9F6E",
  },
  {
    id: "paper-classic",
    name: "Cát ấm trang nhã",
    backgroundId: "paper-cream",
    backgroundCss: "linear-gradient(180deg,#FFFDF9 0%,#FAF5EB 100%)",
    primaryColor: "#A78B6D",
    accentColor: "#D4AF6A",
    textColor: "#443525",
    borderColor: "#A78B6D",
  },
  {
    id: "lavender-mist",
    name: "Xanh trời thanh khiết",
    backgroundId: "lavender-mist",
    backgroundCss: "linear-gradient(145deg,#F4F9FF,#E8F2FD)",
    primaryColor: "#0284C7",
    accentColor: "#38BDF8",
    textColor: "#0C4A6E",
    borderColor: "#0284C7",
  },
  {
    id: "peach-blush",
    name: "Vàng champagne nhã nhặn",
    backgroundId: "peach-blush",
    backgroundCss: "linear-gradient(145deg,#FFFDF7,#FAF3E6)",
    primaryColor: "#B58A38",
    accentColor: "#D4AF6A",
    textColor: "#422006",
    borderColor: "#B58A38",
  },
  {
    id: "sage-garden",
    name: "Xanh lá dịu nhẹ",
    backgroundId: "sage-garden",
    backgroundCss: "linear-gradient(160deg,#FAFBF7,#EFF3E8)",
    primaryColor: "#3F6212",
    accentColor: "#84CC16",
    textColor: "#1A2E05",
    borderColor: "#3F6212",
  },
  {
    id: "royal-gold",
    name: "Vàng kim sang trọng",
    backgroundId: "sand-warm",
    backgroundCss: "linear-gradient(180deg,#FFFDF7 0%,#FAF4E7 100%)",
    primaryColor: "#B58A38",
    accentColor: "#FACC15",
    textColor: "#422006",
    borderColor: "#B58A38",
  },
  {
    id: "charcoal-slate",
    name: "Xám ngọc trai thanh lịch",
    backgroundId: "white-clean",
    backgroundCss: "linear-gradient(160deg,#F8FAFC,#EDF2F7)",
    primaryColor: "#64748B",
    accentColor: "#94A3B8",
    textColor: "#334155",
    borderColor: "#64748B",
  },
  {
    id: "ice-cyan",
    name: "Xanh băng thanh thoát",
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
  { id: "paper-cream", name: "Giấy kem", css: "#FCF8F0", dark: false },
  {
    id: "lavender-mist",
    name: "Xanh trời nhạt",
    css: "linear-gradient(145deg,#F4F9FF,#E8F3FD)",
    dark: false,
  },
  {
    id: "peach-blush",
    name: "Kem nhạt",
    css: "linear-gradient(145deg,#FFFDF8,#FAF4E8)",
    dark: false,
  },
  {
    id: "sage-garden",
    name: "Xanh lá dịu",
    css: "linear-gradient(160deg,#F5F7EC,#E7EEDF)",
    dark: false,
  },
  {
    id: "ice-blue",
    name: "Xanh băng",
    css: "linear-gradient(160deg,#F0FDFF,#DDEAFD)",
    dark: false,
  },
  { id: "rose-cream", name: "Ngọc trai", css: "#F8FAFC", dark: false },
];

export { decorOptions } from "@/config/theme-options";

export const colorPresets = [
  { name: "Xanh QTM", hex: "#0F4C75" },
  { name: "Xanh đại dương", hex: "#0284C7" },
  { name: "Xanh biển dịu", hex: "#2563EB" },
  { name: "Xanh da trời", hex: "#38BDF8" },
  { name: "Ngọc lam", hex: "#0891B2" },
  { name: "Xanh ngọc bích", hex: "#0D9488" },
  { name: "Xanh ngọc tươi", hex: "#10B981" },
  { name: "Bạc hà dịu", hex: "#6EE7B7" },
  { name: "Xanh xô thơm", hex: "#65A30D" },
  { name: "Vàng champagne", hex: "#D4AF6A" },
  { name: "Vàng cát ấm", hex: "#CA8A04" },
  { name: "Hổ phách dịu", hex: "#D97706" },
  { name: "Nâu cát", hex: "#A78B6D" },
  { name: "Xám đá", hex: "#64748B" },
  { name: "Bạc ánh kim", hex: "#94A3B8" },
  { name: "Kem ngọc trai", hex: "#E2D9C8" },
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
