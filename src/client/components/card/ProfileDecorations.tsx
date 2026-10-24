import type { CardTheme } from "@/shared/types/employee";
import { getProfileDecorPlacements } from "@/shared/utils/decor-layout";
import { DecorIllustration } from "./DecorIllustration";

/** Disjoint preset slots keep combined motifs separate and contacts unpainted. */
export function ProfileDecorations({ theme }: { theme: CardTheme }) {
  const placements = getProfileDecorPlacements(theme.decor);
  return (
    <svg className="qtm-safe-decor" viewBox="0 0 390 694" preserveAspectRatio="none" aria-hidden="true">
      {placements.map(({ decor, x, y, width, height }, index) => (
        <svg key={index} data-decor={decor} data-decor-slot={index}
          x={x} y={y} width={width} height={height}
          viewBox="0 0 120 100" preserveAspectRatio="none" overflow="hidden" opacity=".8">
          <DecorIllustration decor={decor} variant={index === 0 ? "halo" : "edge"} />
        </svg>
      ))}
    </svg>
  );
}

/** Footer art moves with its own section, including when offices add rows. */
export function ProfileFooterDecorations({ theme }: { theme: CardTheme }) {
  const extraMotifs = theme.decor.filter(key => key !== "skyline" && key !== "waves");
  return <svg className="qtm-footer-decor" viewBox="0 0 400 100" aria-hidden="true">
    {!theme.decor.includes("skyline") && extraMotifs.length > 0 && <svg data-decor={extraMotifs[0]} x="70" y="0" width="260" height="100" viewBox="0 0 120 100" overflow="hidden" opacity=".65"><DecorIllustration decor={extraMotifs[0]} /></svg>}
    {theme.decor.includes("waves") && !theme.decor.includes("skyline") && extraMotifs.length === 0 && <g data-decor="waves" fill="currentColor" opacity=".13">
      <path d="M0 65Q80 15 200 60T400 45V100H0Z" /><path d="M0 85Q120 40 260 80T400 65V100H0Z" />
    </g>}
    {theme.decor.includes("skyline") && <g data-decor="skyline" fill="currentColor" opacity=".25">
      <path d="M0 100V94H24V61H39V94H54V42H72V94H89V58H102V94H116V26H131V12H136V26H148V94H244V47H260V94H275V24L284 8L293 24V94H310V55H329V94H346V69H363V94H400V100Z" />
      <path fillRule="evenodd" d="M172 96V69H228V96ZM192 96H208V82A8 8 0 0 0 192 82Z M165 69L200 49L235 69Z M178 56V43H222V56Z M171 43L200 28L229 43Z" />
    </g>}
  </svg>;
}
