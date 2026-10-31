import { hexToRgb, toTint } from "@/shared/utils/color";

export const CYBER_MAGAZINE_PATTERN_KEY = "themeCustomizer.patterns.cyberMagazine";
export const CYBER_MAGAZINE_BRAND_KEY = "common.cyberMagazineName";

export function isCyberMagazineDefaultColor(primaryColor: string) {
  return ["#0F4C75", "#0F2A5C", "#0B3A75", "#0B2A5B", "#0F3A75"].includes(primaryColor.toUpperCase());
}

/** One ink family for ribbons, globe, controls and headings. Cyan is light only. */
export function getCyberMagazineColors(primaryColor: string) {
  if (isCyberMagazineDefaultColor(primaryColor)) return {
    deep: "#0A1F44", navy: "#0B2A5B", blue: "#0F3A75", surface: "#12427F",
    cyan: "#3FA9F5", light: "#BFE3FF",
  };
  const shade = (factor: number) => `#${hexToRgb(primaryColor).map(c => Math.round(c * factor).toString(16).padStart(2, "0")).join("")}`;
  return { deep: shade(.4), navy: shade(.65), blue: primaryColor, surface: toTint(primaryColor, .12), cyan: toTint(primaryColor, .32), light: toTint(primaryColor, .76) };
}
