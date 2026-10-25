import {
  templates as baseTemplates,
  backgrounds as baseBackgrounds,

  type TemplateOption,
} from "@/config/theme-options";
import type { CardTheme, DecorKey, TemplateId } from "@/shared/types/employee";

export interface DecorationLayerConfig {
  id: string;
  label: string;
  layer: "gradient" | "motif";
}

export interface ThemeTemplate extends TemplateOption {
  description: string;
  dark?: boolean;
  defaultDecor: DecorKey[];
  defaultDecorOpacity: number;
  fontStyle: "sans" | "serif" | "mono";
  decorations: DecorationLayerConfig[];
}

const names: Record<string, string> = {
  "bubble-blue": "Kết nối",
  "minimal-line": "Tinh giản",
  "dark-tech": "Công nghệ",
};

const descriptions: Record<string, string> = {
  "bubble-blue": "Mềm mại & thân thiện",
  "minimal-line": "Gọn gàng & thanh lịch",
  "dark-tech": "Hiện đại & cá tính",
};

export const templates: ThemeTemplate[] = [
  ...baseTemplates.map((t) => ({
    ...t,
    name: names[t.id] || t.name,
    description: descriptions[t.id] || "",
    dark: t.id === "dark-tech",
    defaultDecor: (t.id === "dark-tech" ? ["circles", "bokeh"] : ["blobs", "skyline"]) as DecorKey[],
    defaultDecorOpacity: 65,
    fontStyle: "sans" as const,
    decorations: t.shapes.map((s) => ({
      id: s.id,
      label: s.label,
      layer: "motif" as const,
    })),
  })),
  {
    id: "editorial",
    name: "Biên tập",
    description: "Chữ lớn & đường nét tạp chí",
    defaultBackgroundId: "paper-cream",
    defaultColor: "#9A3412",
    defaultDecor: ["circles"],
    defaultDecorOpacity: 65,
    fontStyle: "serif",
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
    description: "Chuyển sắc & điểm sáng dịu",
    defaultBackgroundId: "lavender-mist",
    defaultColor: "#7C3AED",
    defaultDecor: ["blobs", "skyline"],
    defaultDecorOpacity: 65,
    fontStyle: "sans",
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
    description: "Nền đen & ánh vàng dịu",
    defaultBackgroundId: "paper-cream",
    defaultColor: "#D4AF6A",
    defaultDecor: ["circles", "bokeh"],
    defaultDecorOpacity: 65,
    dark: true,
    fontStyle: "serif",
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
    description: "Cành lá SVG & đường cong hữu cơ",
    defaultBackgroundId: "sage-garden",
    defaultColor: "#3F6212",
    defaultDecor: ["blobs", "skyline"],
    defaultDecorOpacity: 65,
    fontStyle: "serif",
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
    description: "Hình học đa sắc & góc xoay",
    defaultBackgroundId: "peach-blush",
    defaultColor: "#BE185D",
    defaultDecor: ["blobs", "skyline"],
    defaultDecorOpacity: 65,
    fontStyle: "sans",
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

export const backgrounds = [
  ...baseBackgrounds.map((b) => ({ ...b, dark: false })),
  { id: "paper-cream", name: "Giấy kem", css: "#FCF8F0", dark: false },
  {
    id: "lavender-mist",
    name: "Sương tím",
    css: "linear-gradient(145deg,#F5F0FF,#E9EDFF)",
    dark: false,
  },
  {
    id: "peach-blush",
    name: "Hồng đào",
    css: "linear-gradient(145deg,#FFF1ED,#FCE4EC)",
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
  { id: "rose-cream", name: "Hồng phấn", css: "#FFF5F7", dark: false },
];

export { decorOptions } from "@/config/theme-options";

export const colorPresets = [
  { name: "Xanh QTM", hex: "#0F4C75" },
  { name: "Xanh đại dương", hex: "#0369A1" },
  { name: "Xanh biển", hex: "#2563EB" },
  { name: "Xanh hoàng gia", hex: "#4338CA" },
  { name: "Xanh trời", hex: "#38BDF8" },
  { name: "Ngọc lam", hex: "#0891B2" },
  { name: "Xanh cổ vịt", hex: "#0F766E" },
  { name: "Xanh ngọc", hex: "#0E9F6E" },
  { name: "Xanh lá", hex: "#15803D" },
  { name: "Xanh rêu", hex: "#3F6212" },
  { name: "Ô liu", hex: "#708238" },
  { name: "Bạc hà", hex: "#6EE7B7" },
  { name: "Tím violet", hex: "#7C3AED" },
  { name: "Tím hoa cà", hex: "#A855F7" },
  { name: "Tím mận", hex: "#7E225A" },
  { name: "Hồng cánh sen", hex: "#BE185D" },
  { name: "Hồng san hô", hex: "#F472B6" },
  { name: "Đỏ ruby", hex: "#BE123C" },
  { name: "Đỏ tươi", hex: "#DC2626" },
  { name: "Đỏ đất", hex: "#9A3412" },
  { name: "Cam quýt", hex: "#EA580C" },
  { name: "Cam hổ phách", hex: "#D97706" },
  { name: "Vàng mật ong", hex: "#CA8A04" },
  { name: "Vàng champagne", hex: "#D4AF6A" },
  { name: "Nâu cà phê", hex: "#78350F" },
  { name: "Nâu cát", hex: "#A78B6D" },
  { name: "Xám than", hex: "#1F2937" },
  { name: "Xám đá", hex: "#64748B" },
  { name: "Đen", hex: "#171717" },
  { name: "Bạc", hex: "#CBD5E1" },
  { name: "Kem", hex: "#F5E6CC" },
  { name: "Trắng", hex: "#FFFFFF" },
];

export function getTemplate(id: TemplateId): ThemeTemplate {
  return templates.find((t) => t.id === id) || templates[0];
}

export function isDarkTheme(theme: CardTheme): boolean {
  const template = getTemplate(theme.templateId);
  const bg = backgrounds.find((b) => b.id === theme.backgroundId);
  return Boolean(template.dark || bg?.dark);
}

export function getThemeBackgroundCss(theme: CardTheme): string {
  const template = getTemplate(theme.templateId);
  const bg = backgrounds.find((b) => b.id === theme.backgroundId);
  if (template.id === "luxury") {
    if (bg && bg.dark) return bg.css;
    return "radial-gradient(circle at 80% 10%, rgba(212,175,106,0.18) 0%, transparent 45%), radial-gradient(circle at 18% 88%, rgba(212,175,106,0.09) 0%, transparent 45%), linear-gradient(155deg,#0B0C10 0%,#15151C 55%,#1F1D24 100%)";
  }
  if (template.id === "dark-tech") {
    if (bg && bg.dark) return bg.css;
    return "radial-gradient(circle at 85% 12%, rgba(56,189,248,0.16) 0%, transparent 45%), linear-gradient(160deg,#081528 0%,#0E223D 55%,#112B4F 100%)";
  }
  return bg?.css || "linear-gradient(180deg,#FFFFFF 0%,#EAF4FD 100%)";
}
