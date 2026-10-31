import { CyberMagazineArtwork } from "./CyberMagazineArtwork";
import type { CSSProperties } from "react";
import type { CardTheme, DecorKey } from "@/shared/types";
import { getThemeBackgroundCss } from "@/config/card-themes";
import { migrateCardTheme } from "@/shared/utils/migrate-theme";
import { DecorIllustration } from "./DecorIllustration";
import { cn } from "@/shared/utils/cn";

/** Stable artwork shared with the profile; opacity never changes its placement. */
export function DecorArtwork({ decor, className, fieldIndex = 0, fieldCount = 1, primaryColor }: {
  decor: DecorKey; className?: string; seed?: string; fieldIndex?: number; fieldCount?: number; primaryColor?: string;
}) {
  if (decor === "cyber-magazine") return <CyberMagazineArtwork primaryColor={primaryColor} className={cn("decor-artwork decor-field", className)} />;
  const bottom = decor === "skyline" || decor === "waves";
  const areas = fieldCount <= 3 ? [
    { x: 110, y: 18, width: 200, height: 155 },
    { x: 340, y: 22, width: 150, height: 150 },
    { x: -90, y: 75, width: 180, height: 100 },
  ] : Array.from({ length: 6 }, (_, index) => ({
    x: (index % 3) * 145 - 30, y: Math.floor(index / 3) * 90,
    width: 125, height: 80,
  }));
  return (
    <svg aria-hidden="true" data-decor={decor} viewBox={bottom ? "0 0 400 100" : "0 0 400 180"}
      preserveAspectRatio={decor === "waves" ? "none" : bottom ? "xMidYMax meet" : "xMidYMid slice"} fill="none"
      className={cn("decor-artwork", bottom ? "decor-bottom" : "decor-field", className)}>
      {bottom ? <>
        {decor === "skyline" && <g fill="currentColor" stroke="none">
          <path fillOpacity=".42" d="M0 100V94H36V66H52V94H66V42H83V94H99V57H112V94H126V29H141V16H146V29H155V94H244V46H260V94H275V26L284 10L293 26V94H310V54H329V94H342V68H360V94H400V100Z" />
          <path fillOpacity=".55" fillRule="evenodd" d="M172 96V68H228V96ZM192 96H208V81A8 8 0 0 0 192 81Z M165 68L200 49L235 68Z M178 56V43H222V56Z M171 43L200 28L229 43Z" />
          <path fillOpacity=".4" d="M18 96V82C4 81 8 64 20 64C32 64 36 81 22 82V96Z M371 96V78C357 77 361 60 373 60C385 60 389 77 375 78V96Z" />
        </g>}
        {decor === "waves" && <g fill="currentColor" fillOpacity=".22" stroke="currentColor" strokeOpacity=".3" strokeWidth="1">
          <path d="M0 48C100 10 240 100 400 44V100H0Z" />
          <path d="M0 76C130 36 290 105 400 68V100H0Z" />
        </g>}
      </> : <g opacity=".85">
        {areas.filter((_, index) => index % fieldCount === fieldIndex).map((area, index) => (
          <svg key={index} {...area} viewBox="0 0 120 100" preserveAspectRatio="none" overflow="hidden"><DecorIllustration decor={decor} variant={area.x === 110 ? "halo" : "edge"} /></svg>
        ))}
      </g>}
    </svg>
  );
}

export interface CardDecorationsProps {
  theme: CardTheme;
  showDecor?: boolean;
  opacity?: number;
  variant?: "profile" | "preview" | "thumb";
  className?: string;
}

export function CardDecorations({ theme: rawTheme, showDecor, opacity, variant = "preview", className }: CardDecorationsProps) {
  const theme = migrateCardTheme(rawTheme);
  const scale = Math.max(0, Math.min(60, opacity ?? theme.decorOpacity ?? 35)) / 100;
  const fields = theme.decor.filter(key => key !== "skyline" && key !== "waves");
  const shapes = theme.shapes;
  const frame = shapes["editorial-frame"] || shapes["gold-frame"];
  const details = Object.entries(shapes).filter(([key, enabled]) => enabled && !["editorial-frame", "gold-frame", "bubbles", "skyline", "grid-glow", "circuit-dots"].includes(key));
  return (
    <div aria-hidden="true" className={cn("card-decorations", `decor-${variant}`, className)}
      style={{ background: getThemeBackgroundCss(theme), "--decor-accent": theme.primaryColor, color: "var(--decor-accent)" } as CSSProperties}>
      {theme.decor.includes("cyber-magazine") && <CyberMagazineArtwork className="decor-artwork decor-field" primaryColor={theme.primaryColor} decorOpacity={(showDecor ?? theme.showDecor ?? true) ? scale * 100 : 0} />}
      <div className="decor-motifs" style={{ opacity: scale }}>
        {theme.decor.filter(decor => decor !== "cyber-magazine").map((decor) => <DecorArtwork key={decor} decor={decor} primaryColor={theme.primaryColor} seed={theme.templateId} fieldIndex={fields.findIndex(key => key === decor)} fieldCount={fields.length} />)}
        <DecorArtwork decor="skyline" className="permanent-skyline" />
        {(showDecor ?? theme.showDecor ?? true) && <>
          {frame && <div className="decor-single-frame" />}
          {details.map(([key], index) => <svg key={key} className="decor-detail" style={{ top: index * 24 }} viewBox="0 0 400 60" preserveAspectRatio="none" fill="none">
            <g stroke="currentColor" strokeOpacity=".18" fill="currentColor" fillOpacity=".1" strokeWidth=".8">
              {["accent-bar", "top-line", "editorial-lines"].includes(key) && <path d="M12 32V12H40M360 12H388V32" fill="none" />}
              {["corner-glow", "aurora-glow"].includes(key) && <circle cx="390" cy="10" r="22" stroke="none" />}
              {key === "orbit-rings" && <path d="M365 0A35 35 0 0 0 400 35M380 0A20 20 0 0 0 400 20" fill="none" />}
              {key === "corner-diamonds" && <path d="M380 8L389 17L380 26L371 17Z" />}
              {key === "leaf-branches" && <path d="M380 0Q370 24 398 42M380 16Q355 8 366 26Q378 30 380 16M384 28Q399 9 398 29Q394 38 384 28" />}
              {key === "organic-blob" && <path d="M380 0C355 15 393 50 405 20V0Z" />}
              {key === "color-blocks" && <rect x="376" y="8" width="30" height="28" rx="10" />}
              {key === "playful-dots" && <><circle cx="379" cy="12" r="3" /><circle cx="390" cy="26" r="2" /><circle cx="397" cy="6" r="4" /></>}
            </g>
          </svg>)}
        </>}
      </div>
    </div>
  );
}
