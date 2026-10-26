export type TemplateId =
  | "bubble-blue"
  | "minimal-line"
  | "dark-tech"
  | "editorial"
  | "aurora"
  | "luxury"
  | "botanical"
  | "creative";

export type StyleId = TemplateId;

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarShape = "circle" | "rounded";
export type ButtonStyle = "filled" | "soft" | "outline";
export type DecorKey =
  | "blobs"
  | "circles"
  | "skyline"
  | "waves"
  | "bokeh"
  | "leaves"
  | "network"
  | "geometry";

export type ButtonShape =
  | "pill"
  | "square-thin"
  | "square-sharp"
  | "square-single"
  | "rounded-glow"
  | "square-double"
  | "organic"
  | "rounded-thick";

export type AvatarFrameStyle =
  | "circle"
  | "circle-thin"
  | "orbit"
  | "editorial-frame"
  | "concentric"
  | "double-ring"
  | "organic"
  | "offset-shadow";

export type DividerStyle =
  | "pill-bar"
  | "thin-line"
  | "dashed-orbit"
  | "straight-solid"
  | "glow-gradient"
  | "diamond-center"
  | "organic-wave"
  | "geometric-split";

export interface DecorationLayerConfig {
  id: string;
  label: string;
  layer: "gradient" | "motif";
}

/** Configuration of a structural style (forms, shapes, typography - independent of color). */
export interface CardStyleConfig {
  id: StyleId;
  name: string;
  description: string;
  fontFamily: string;
  fontStyle: "sans" | "serif" | "mono";
  fontWeight: number | string;
  letterSpacing: string;
  buttonShape: ButtonShape;
  buttonBorder: "none" | "thin" | "double" | "single" | "thick" | "solid" | "gradient";
  buttonStyle?: ButtonStyle;
  avatarFrame: AvatarFrameStyle;
  dividerStyle: DividerStyle;
  defaultDecor: DecorKey[];
  defaultDecorOpacity: number;
  shapes: { id: string; label: string }[];
  decorations: DecorationLayerConfig[];
  cardRadius?: string;
  cardShadow?: string;
}

/** Curated color palette (background, primary brand color, and complementary accents). */
export interface CardPalette {
  id: string;
  name: string;
  backgroundId: string;
  backgroundCss: string;
  primaryColor: string;
  accentColor?: string;
  textColor?: string;
  borderColor?: string;
  isDark?: boolean;
}

export interface CardTheme {
  templateId: TemplateId; // Style ID (database & backward compatible)
  styleId?: StyleId;      // Alias for templateId
  backgroundId: string;   // Palette background ID
  primaryColor: string;   // Palette primary color
  paletteId?: string;     // Palette ID (optional)
  decor: DecorKey[];
  shapes: Record<string, boolean>;
  avatarSize: AvatarSize;
  avatarShape: AvatarShape;
  buttonStyle: ButtonStyle;
  showDecor?: boolean;
  decorOpacity?: number;
}

export interface TemplateOption {
  id: TemplateId;
  name: string;
  shapes: { id: string; label: string }[];
  defaultBackgroundId: string;
  defaultColor: string;
}

export interface ThemeTemplate extends TemplateOption, CardStyleConfig {
  dark?: boolean;
}
