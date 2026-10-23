import type { CSSProperties, ReactNode } from "react";
import type { CardTheme, DecorKey } from "@/shared/types/employee";
import { getThemeBackgroundCss } from "@/config/card-themes";
import { migrateCardTheme } from "@/shared/utils/migrate-theme";
import { cn } from "@/shared/utils/cn";

function FloatingShape({ x, y, size = "20%", children }: { x: string; y: string; size?: string; children: ReactNode }) {
  return <svg x={x} y={y} width={size} height={size} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">{children}</svg>;
}

/** The same sparse geometry is used for the card and the selector thumbnails.
 * Each motif has fewer than ten shapes; no repeating paint or animation. */
export function DecorArtwork({ decor, className, seed = "bubble-blue" }: { decor: DecorKey; className?: string; seed?: string }) {
  const bottom = decor === "skyline" || decor === "waves";
  // Stable compositions vary by theme/motif; never jump when opacity or form data changes.
  const layout = [...seed + decor].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 3;
  const transform = bottom ? undefined : layout === 1 ? "scaleX(-1)" : layout === 2 ? "scaleY(-1)" : undefined;
  return (
    <svg aria-hidden="true" data-decor={decor} viewBox={bottom ? "0 0 400 100" : undefined}
      preserveAspectRatio={decor === "waves" ? "none" : "xMidYMax meet"} fill="none"
      className={cn("decor-artwork", bottom ? "decor-bottom" : "decor-field", className)}>
      <g style={{ transform, transformOrigin: "50% 50%" }}>
        {decor === "blobs" && <g fill="currentColor" fillOpacity=".3">
          <FloatingShape x="-9%" y="2%" size="24%"><path d="M12 14C48-12 102 21 85 58S26 109 10 76S-10 30 12 14Z" /></FloatingShape>
          <FloatingShape x="88%" y="23%"><path d="M23 20C58-8 103 25 82 60S36 102 15 77S-2 41 23 20Z" /></FloatingShape>
          <FloatingShape x="-10%" y="43%" size="22%"><path d="M19 14C58-8 102 19 84 54S98 96 52 94S-14 47 19 14Z" fillOpacity=".7" /></FloatingShape>
          <FloatingShape x="91%" y="65%"><path d="M23 20C58-8 103 25 82 60S36 102 15 77S-2 41 23 20Z" /></FloatingShape>
          <FloatingShape x="-6%" y="83%" size="18%"><path d="M12 14C48-12 102 21 85 58S26 109 10 76S-10 30 12 14Z" fillOpacity=".65" /></FloatingShape>
          <FloatingShape x="76%" y="9%" size="3%"><circle cx="50" cy="50" r="48" /></FloatingShape>
          <FloatingShape x="13%" y="34%" size="2%"><circle cx="50" cy="50" r="48" /></FloatingShape>
          <FloatingShape x="82%" y="80%" size="3%"><circle cx="50" cy="50" r="48" /></FloatingShape>
        </g>}
        {decor === "circles" && <>
          <g stroke="currentColor" strokeOpacity=".38" strokeWidth="1.2">
            <FloatingShape x="86%" y="8%" size="26%"><circle cx="50" cy="50" r="45" /><circle cx="56" cy="58" r="38" /></FloatingShape>
            <FloatingShape x="-14%" y="40%" size="28%"><circle cx="50" cy="50" r="47" /></FloatingShape>
            <FloatingShape x="89%" y="73%" size="22%"><circle cx="50" cy="50" r="45" /></FloatingShape>
          </g>
          <g fill="currentColor" fillOpacity=".2">
            <FloatingShape x="-4%" y="3%" size="13%"><circle cx="50" cy="50" r="48" /></FloatingShape>
            <FloatingShape x="92%" y="48%" size="12%"><circle cx="50" cy="50" r="48" /></FloatingShape>
            <FloatingShape x="-5%" y="84%" size="18%"><circle cx="50" cy="50" r="48" /></FloatingShape>
          </g>
        </>}
        {decor === "skyline" && <g fill="currentColor" stroke="none">
          <path fillOpacity=".42" d="M0 100V94H36V66H52V94H66V42H83V94H99V57H112V94H126V29H141V16H146V29H155V94H244V46H260V94H275V26L284 10L293 26V94H310V54H329V94H342V68H360V94H400V100Z" />
          <path fillOpacity=".55" fillRule="evenodd" d="M172 96V68H228V96ZM192 96H208V81A8 8 0 0 0 192 81Z M165 68L200 49L235 68Z M178 56V43H222V56Z M171 43L200 28L229 43Z" />
          <path fillOpacity=".4" d="M18 96V82C4 81 8 64 20 64C32 64 36 81 22 82V96Z M371 96V78C357 77 361 60 373 60C385 60 389 77 375 78V96Z" />
        </g>}
        {decor === "waves" && <g fill="currentColor" fillOpacity=".22" stroke="currentColor" strokeOpacity=".3" strokeWidth="1">
          <path d="M0 48C100 10 240 100 400 44V100H0Z" />
          <path d="M0 76C130 36 290 105 400 68V100H0Z" />
        </g>}
        {decor === "bokeh" && <g fill="currentColor" fillOpacity=".24">
          {[ ["1%", "17%", "10%"], ["86%", "2%", "17%"], ["17%", "7%", "3%"], ["94%", "40%", "8%"], ["-7%", "67%", "15%"], ["83%", "61%", "3%"], ["89%", "88%", "12%"], ["18%", "85%", "2%"] ].map(([x, y, size]) => <FloatingShape key={y} x={x} y={y} size={size}><circle cx="50" cy="50" r="48" /></FloatingShape>)}
        </g>}
      </g>
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
  const scale = Math.max(0, Math.min(100, opacity ?? theme.decorOpacity ?? 65)) / 100;
  const shapes = theme.shapes;
  const frame = shapes["editorial-frame"] || shapes["gold-frame"];
  const details = Object.entries(shapes).filter(([key, enabled]) => enabled && !["editorial-frame", "gold-frame", "bubbles", "skyline", "grid-glow", "circuit-dots"].includes(key));
  return (
    <div aria-hidden="true" className={cn("card-decorations", `decor-${variant}`, className)}
      style={{ background: getThemeBackgroundCss(theme), "--decor-accent": theme.primaryColor, color: "var(--decor-accent)" } as CSSProperties}>
      <div className="decor-motifs" style={{ opacity: scale }}>
        {theme.decor.map((decor) => <DecorArtwork key={decor} decor={decor} seed={theme.templateId} />)}
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
