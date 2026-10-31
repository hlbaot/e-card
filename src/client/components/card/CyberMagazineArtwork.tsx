import { CyberMagazineTopRight } from "./CyberMagazineTopRight";
import { useId } from "react";
import { getCyberMagazineColors, isCyberMagazineDefaultColor } from "@/shared/constants/cyber-magazine";
import type { CardTheme } from "@/shared/types";
import { migrateCardTheme } from "@/shared/utils/migrate-theme";

/** The magazine's dark inks stay colorful at the default setting; zero still hides
 * the artwork, and the full slider range continuously controls its strength. */
export function cyberMagazineOpacity(value = 35) {
  const amount = Math.max(0, Math.min(60, value));
  return amount <= 35 ? amount / 35 * .98 : .98 + (amount - 35) / 25 * .02;
}

/** One vector composition shared by the selector, profile and PNG export.
 * Artwork follows the reference's silhouette; only the perimeter is painted. */
export function CyberMagazineArtwork({ className, primaryColor = "#0F4C75", thumbnail = false, decorOpacity }: {
  className?: string;
  primaryColor?: string;
  thumbnail?: boolean;
  decorOpacity?: number;
}) {
  const id = `cyber-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const native = isCyberMagazineDefaultColor(primaryColor);
  const { deep, navy, blue, surface, cyan, light } = getCyberMagazineColors(primaryColor);
  const paint = (name: string) => `url(#${id}-${name})`;
  const stars = [[837, 83, 9], [910, 160, 8], [998, 224, 7], [1038, 291, 7], [913, 279, 10], [762, 128, 6], [81, 1200, 9], [170, 1402, 7], [876, 1374, 8], [960, 1391, 7], [1044, 1380, 9]];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
      className={className} style={decorOpacity === undefined ? undefined : { opacity: cyberMagazineOpacity(decorOpacity) }}
      data-decor="cyber-magazine" data-thumbnail={thumbnail || undefined} aria-hidden="true" fill="none" pointerEvents="none">
      <defs>
        <linearGradient id={`${id}-blue`} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor={deep} /><stop offset=".55" stopColor={native ? "#00344F" : navy} /><stop offset=".86" stopColor={native ? "#005B76" : blue} /><stop offset="1" stopColor={native ? "#007A92" : surface} />
        </linearGradient>
        <linearGradient id={`${id}-navy`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={deep} /><stop offset=".6" stopColor={navy} /><stop offset="1" stopColor={deep} />
        </linearGradient>
        <linearGradient id={`${id}-teal`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={native ? "#009BB2" : surface} /><stop offset=".45" stopColor={native ? "#00627E" : blue} /><stop offset="1" stopColor={native ? "#003651" : navy} />
        </linearGradient>
        <linearGradient id={`${id}-left-ribbon`} gradientUnits="userSpaceOnUse" x1="0" y1="330" x2="480" y2="790">
          <stop stopColor={native ? "#00415D" : navy} /><stop offset=".42" stopColor={native ? "#008CA7" : surface} />
          <stop offset=".72" stopColor={native ? "#13ACC0" : cyan} /><stop offset="1" stopColor={light} stopOpacity=".25" />
        </linearGradient>
        <radialGradient id={`${id}-left-gloss`}>
          <stop stopColor="#E9FCFF" stopOpacity=".38" /><stop offset=".35" stopColor={light} stopOpacity=".19" />
          <stop offset="1" stopColor={cyan} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-left-gold`} gradientUnits="userSpaceOnUse" x1="0" y1="375" x2="480" y2="790">
          <stop stopColor="#C9A227" /><stop offset=".18" stopColor="#E6C766" /><stop offset=".36" stopColor="#FFF4C3" />
          <stop offset=".55" stopColor="#E6C766" /><stop offset=".82" stopColor="#C9A227" /><stop offset="1" stopColor="#FFF3B0" />
        </linearGradient>
        <clipPath id={`${id}-left-surface`}>
          <path d="M0 295C173 320 252 531 480 790C310 621 163 397 0 465Z" />
        </clipPath>
        <linearGradient id={`${id}-left-fade`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="510" y2="0">
          <stop offset="0" stopColor="white" /><stop offset=".7" stopColor="white" />
          <stop offset=".92" stopColor="#a0a0a0" /><stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id={`${id}-left-soft`} maskUnits="userSpaceOnUse" x="0" y="280" width="520" height="560">
          <rect y="280" width="520" height="560" fill={paint("left-fade")} />
        </mask>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2=".3">
          <stop stopColor="#C9A227" /><stop offset=".25" stopColor="#E6C766" /><stop offset=".48" stopColor="#FFF3B0" /><stop offset=".7" stopColor="#C9A227" /><stop offset="1" stopColor="#E6C766" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="#FFFBE2" /><stop offset=".15" stopColor="#FFF1AA" stopOpacity=".95" /><stop offset=".4" stopColor="#E6C766" stopOpacity=".3" /><stop offset="1" stopColor="#E6C766" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-aura`}>
          <stop stopColor={cyan} stopOpacity=".65" /><stop offset=".5" stopColor={cyan} stopOpacity=".18" /><stop offset="1" stopColor={cyan} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-edge`}><stop stopColor={light} stopOpacity=".22" /><stop offset="1" stopColor={light} stopOpacity="0" /></linearGradient>
        <pattern id={`${id}-dots`} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill={cyan} opacity=".38" /></pattern>
      </defs>
      {/* The footer follows card height; the top composition and icons scale uniformly. */}
      <svg width="100%" height="100%" viewBox="0 0 1080 1440" preserveAspectRatio="none">


      {/* A transparent center, with a pale blue wash restricted to the margins. */}
      <rect width="150" height="1440" fill={paint("edge")} />
      <rect width="150" height="1440" transform="translate(1080 0) scale(-1 1)" fill={paint("edge")} />

      {/* Fine circuit traces at all four outer edges. */}
      <g stroke={blue} strokeWidth="1.15" opacity=".35">
        <path d="M0 895L38 934V1061L84 1107V1202M0 935L21 957V1084L64 1127V1230M0 972L8 980V1098L48 1141V1249" />
        <path d="M1080 1057L1020 1117V1184L999 1205V1289M1080 1095L1040 1135V1204L1018 1226V1301" />
        {[[84, 1202], [64, 1230], [999, 1289], [1018, 1301]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.6" />)}
      </g>
      <g stroke={paint("gold")} strokeWidth="1.3" opacity=".85">
        <path d="M1080 1138L1053 1166V1230L1029 1255M0 977L22 1000V1088L98 1164V1252" />
        {[[1029, 1255], [98, 1252]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4" strokeWidth="2" />)}
      </g>
      <path d="M0 984H51V1228H0ZM1019 925H1080V1282H989Z" fill={paint("dots")} opacity=".22" />

      {/* A full-width footer, rather than a small triangular corner. */}
      <path d="M0 1220C109 1270 169 1378 337 1340C550 1295 665 1313 788 1326C923 1340 1017 1302 1080 1249V1440H0Z" fill={paint("teal")} />
      <path d="M0 1253C140 1325 167 1384 351 1352C540 1313 669 1335 802 1352C934 1368 1021 1339 1080 1301V1440H0Z" fill={paint("blue")} />
      <path d="M0 1338C227 1282 306 1366 492 1354C682 1341 766 1422 1080 1440H0Z" fill={navy} />
      <path d="M0 1267C110 1295 171 1392 337 1341C562 1272 694 1366 811 1351C949 1332 1016 1310 1080 1255" stroke={paint("gold")} strokeWidth="2" />
      <path d="M208 1375C371 1296 510 1322 686 1352C850 1380 939 1428 1080 1440H1026C882 1423 819 1384 681 1361C505 1333 366 1312 208 1375Z" fill={paint("gold")} />
      <path d="M0 1325C259 1272 389 1392 599 1356S928 1453 1080 1322M0 1368C216 1299 371 1404 564 1373S924 1445 1080 1352" stroke={cyan} strokeWidth="1" opacity=".7" />
      <path d="M0 1300H1080V1440H0Z" fill={paint("dots")} opacity=".22" />

      </svg>
      {/* The reference's top composition scales with card width, never its height. */}
      <svg width="100%" height="48%" viewBox="0 0 1080 600" preserveAspectRatio="xMaxYMin meet">
      <CyberMagazineTopRight id={id} primaryColor={primaryColor} />
        <g stroke={blue} strokeWidth="1.4" opacity=".4">
          <path d="M1080 482H1027L997 452H970L945 423M1080 500H1017L984 468H905M1080 564L1033 517H1005L978 489" />
          {[[945, 423], [905, 468], [978, 489]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.6" />)}
        </g>
        <g stroke={paint("gold")} strokeWidth="1.5" opacity=".9">
          <path d="M1080 546L1024 490H934" />
          <circle cx="934" cy="490" r="4" strokeWidth="2" />
        </g>
      </svg>
      {/* The tail curls down outside the portrait instead of pointing at its face. */}
      <svg data-cyber-wave-layer="left" x="0" y="0" width="100%" height="100%"
        viewBox="0 0 1080 1440" preserveAspectRatio="xMinYMin meet">
      {/* Rounded shoulders and a feathered tail echo the reference's fluid ribbon. */}
      <g data-cyber-wave="left" mask={paint("left-soft")}>
        <path d="M0 295C173 320 252 531 480 790C310 621 163 397 0 465Z" fill={paint("left-ribbon")} />
        <path d="M0 295C121.1 312.5 196.1 421.1 308.5 573.6C210 450 110 355 0 397Z" fill={paint("navy")} />
        <g clipPath={paint("left-surface")}>
          <ellipse cx="110" cy="415" rx="155" ry="40" transform="rotate(12 110 415)" fill={paint("left-gloss")} />
        </g>
        <path d="M0 375C124 344 208 452 315 598C364 663 414 727 480 790C398 712 355 661 300 594C208 469 96 372 0 403Z" fill={paint("left-gold")} />
        <path d="M0 375C124 344 208 452 315 598C364 663 414 727 480 790" stroke="#FFF5CE" strokeWidth=".8" opacity=".45" />
        <path d="M0 332C180 354 249 533 462 773" stroke={cyan} strokeWidth="1.1" opacity=".45" />
        <path d="M0 465C123 415 235 538 355 665L130 585H0Z" fill={paint("dots")} opacity=".12" />
      </g>
      </svg>
      {/* Separate anchors keep the left cluster at the left edge on wide cards. */}
      <svg data-cyber-corner="top-left" x="0" y="0" width="100%" height="48%"
        viewBox="0 0 1080 600" preserveAspectRatio="xMinYMin meet">

        <g stroke={blue} strokeWidth="1.4" opacity=".4">
          <path d="M0 48H54L104 0M0 28H40L68 0M0 171H38L73 205H156M0 203H27L62 237H145M0 244H16L51 280H91" />
          {[[20, 25], [156, 205], [145, 237], [91, 280]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.6" />)}
        </g>
        <g stroke={paint("gold")} strokeWidth="1.5" opacity=".9">
          <path d="M0 82L94 182H170L217 234H263M0 131L78 216H157L207 268H297" />
          {[[48, 133], [170, 182], [263, 234], [297, 268]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4" strokeWidth="2" />)}
        </g>
      </svg>
      <svg data-cyber-icon="shield" x="0" y="82.5%" width="20.4%" height="17.5%"
        viewBox="-25 1188 220 252" preserveAspectRatio="xMinYMax meet">
      {/* Luminous security shield, mesh and connection points. */}
      <circle cx="71" cy="1325" r="147" fill={paint("aura")} />
      <g stroke={light} strokeWidth="1" opacity=".6">
        <ellipse cx="71" cy="1325" rx="106" ry="112" /><ellipse cx="71" cy="1325" rx="124" ry="132" strokeDasharray="2 8" />
        <path d="M0 1235L71 1218L132 1240L169 1316L141 1392L72 1425L0 1398M0 1284L132 1240M0 1353L169 1316M71 1218L141 1392M0 1398L132 1240" />
        {[[71, 1218], [132, 1240], [169, 1316], [141, 1392], [72, 1425], [15, 1280]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill={light} />)}
      </g>
      <g stroke={cyan} strokeLinejoin="round">
        <path d="M73 1267Q96 1288 127 1292V1338Q124 1382 73 1408Q22 1382 19 1338V1292Q50 1288 73 1267Z" strokeWidth="12" opacity=".18" />
        <path d="M73 1267Q96 1288 127 1292V1338Q124 1382 73 1408Q22 1382 19 1338V1292Q50 1288 73 1267Z" fill={navy} fillOpacity=".8" strokeWidth="3" />
        <path d="M73 1277Q96 1295 118 1299V1338Q114 1374 73 1398Q32 1374 28 1338V1299Q50 1295 73 1277Z" stroke={light} strokeWidth="1.4" />
        <path d="M73 1285L109 1306V1339Q104 1370 73 1389Q42 1370 37 1339V1306Z" fill={paint("dots")} strokeWidth=".7" />
        <rect x="56" y="1332" width="34" height="36" rx="3" fill={cyan} stroke={light} strokeWidth="1.5" />
        <path d="M61 1331V1320A12 12 0 0 1 85 1320V1331" stroke={light} strokeWidth="4" />
        <path d="M73 1343V1356" stroke={navy} strokeWidth="4" strokeLinecap="round" /><circle cx="73" cy="1343" r="3" fill={navy} />
      </g>
      </svg>
      {stars.filter(([, y]) => y >= 600).map(([x, y, r]) => <svg key={`${x}-${y}`} data-cyber-icon="sparkle"
        x={`${(x - r * 3) / 1080 * 100}%`} y={`${(y - r * 3) / 1440 * 100}%`}
        width={`${r * 6 / 1080 * 100}%`} height={`${r * 6 / 1440 * 100}%`}
        viewBox={`${-r * 3} ${-r * 3} ${r * 6} ${r * 6}`} preserveAspectRatio="xMidYMid meet">
        <circle r={r * 3} fill={paint("glow")} />
        <path d={`M${-r} 0h${r * 2}M0 ${-r}v${r * 2}`} stroke="#FFF5CE" strokeWidth="1" />
        <circle r="2.2" fill="#FFFBE2" />
      </svg>)}
    </svg>
  );
}

/** Inline opacity and literal colors survive SVG-to-PNG serialization. */
export function CyberMagazineExportDecor({ theme: rawTheme }: { theme: CardTheme }) {
  const theme = migrateCardTheme(rawTheme);
  if (theme.decor[0] !== "cyber-magazine" || theme.showDecor === false) return null;
  return <g opacity={cyberMagazineOpacity(theme.decorOpacity)}>
    <CyberMagazineArtwork primaryColor={theme.primaryColor} />
  </g>;
}
