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
 * The native footer uses the original artwork; custom colors retain vector motifs. */
export function CyberMagazineArtwork({ className, primaryColor = "#0F4C75", thumbnail = false, decorOpacity, locale = "vi" }: {
  className?: string;
  primaryColor?: string;
  thumbnail?: boolean;
  decorOpacity?: number;
  locale?: "vi" | "en";
}) {
  void locale;
  const id = `cyber-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const native = isCyberMagazineDefaultColor(primaryColor);
  const { deep, navy, blue, surface, cyan: themeCyan, light } = getCyberMagazineColors(primaryColor);
  const cyan = native ? "#13CBE2" : themeCyan;
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
        <linearGradient id={`${id}-left-ribbon`} gradientUnits="userSpaceOnUse" x1="0" y1="330" x2="360" y2="550">
          <stop stopColor={native ? "#00415D" : navy} /><stop offset=".42" stopColor={native ? "#008CA7" : surface} />
          <stop offset=".72" stopColor={native ? "#13ACC0" : cyan} /><stop offset="1" stopColor={light} stopOpacity=".25" />
        </linearGradient>
        <radialGradient id={`${id}-left-gloss`}>
          <stop stopColor="#E9FCFF" stopOpacity=".72" /><stop offset=".35" stopColor={light} stopOpacity=".3" />
          <stop offset="1" stopColor={cyan} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-left-gold`} gradientUnits="userSpaceOnUse" x1="0" y1="375" x2="360" y2="550">
          <stop stopColor="#C9A227" /><stop offset=".18" stopColor="#E6C766" /><stop offset=".36" stopColor="#FFF4C3" />
          <stop offset=".55" stopColor="#E6C766" /><stop offset=".82" stopColor="#C9A227" /><stop offset="1" stopColor="#FFF3B0" />
        </linearGradient>
        <clipPath id={`${id}-left-surface`}>
          <path d="M0 295C145 317 244 465 360 550C239 487 144 405 0 465Z" />
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
        <radialGradient id={`${id}-portrait-halo`}>
          <stop stopColor={light} stopOpacity=".22" /><stop offset=".5" stopColor={light} stopOpacity=".16" />
          <stop offset=".72" stopColor={cyan} stopOpacity=".07" /><stop offset="1" stopColor={light} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-aura`}>
          <stop stopColor={cyan} stopOpacity=".65" /><stop offset=".5" stopColor={cyan} stopOpacity=".18" /><stop offset="1" stopColor={cyan} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-edge`}><stop stopColor={light} stopOpacity=".22" /><stop offset="1" stopColor={light} stopOpacity="0" /></linearGradient>
        <linearGradient id={`${id}-footer-night`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={native ? "#004766" : blue} /><stop offset=".45" stopColor={native ? "#003553" : navy} /><stop offset="1" stopColor={native ? "#002C4C" : deep} />
        </linearGradient>
        <filter id={`${id}-shield-light`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <pattern id={`${id}-shield-mesh`} width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".5" fill={cyan} opacity=".7" /></pattern>
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

      {!native && <g>
      {/* Broad overlapping swells and a single widening gold ribbon match the magazine footer. */}
      <ellipse cx="75" cy="1280" rx="240" ry="175" fill={paint("aura")} opacity=".65" />
      <path d="M0 1290C135 1355 207 1360 349 1322C548 1266 687 1253 820 1290C939 1325 1024 1285 1080 1230V1440H0Z" fill={paint("teal")} />
      <path d="M0 1326C152 1380 235 1320 382 1315C560 1306 688 1264 829 1309C957 1349 1020 1320 1080 1285V1440H0Z" fill={paint("blue")} />
      <path d="M0 1390C167 1411 218 1309 402 1318C633 1329 783 1351 915 1400L1080 1440H0Z" fill={paint("footer-night")} />
      <path d="M0 1326C152 1380 235 1320 382 1315C560 1306 688 1264 829 1309C957 1349 1020 1320 1080 1285" stroke={cyan} strokeWidth="1.5" opacity=".42" />
      <path d="M172 1431C303 1316 345 1281 438 1306C481 1318 511 1324 548 1325C702 1327 799 1360 887 1399C963 1432 1024 1440 1080 1440H956C877 1415 840 1384 769 1362C688 1337 610 1331 548 1328C501 1327 469 1318 436 1310C344 1287 301 1324 172 1431Z" fill={paint("gold")} />
      <path d="M169 1398C301 1296 331 1259 424 1294C554 1343 732 1228 888 1286C960 1313 1013 1312 1080 1281" stroke={paint("gold")} strokeWidth="1.3" opacity=".8" />
      <path d="M116 1440C242 1380 279 1295 362 1300M166 1440C296 1378 331 1320 421 1324M265 1440C369 1358 499 1340 698 1418" stroke={cyan} strokeWidth="1" opacity=".3" />
      <path d="M1080 1288C964 1338 924 1430 827 1386C770 1360 726 1300 657 1309M1080 1356C968 1446 929 1378 844 1353" stroke={paint("gold")} strokeWidth="1" opacity=".65" />
      <path d="M694 1280H1080V1440H944C868 1373 773 1328 694 1280Z" fill={paint("dots")} opacity=".28" />
      <g fill={cyan} opacity=".18">
        {Array.from({ length: 48 }, (_, i) => <rect key={i} x={925 + i % 8 * 20} y={1282 + Math.floor(i / 8) * 17} width={i % 3 ? 6 : 10} height={i % 3 ? 9 : 14} opacity={.3 + i % 4 * .15} />)}
      </g>
      {[[257, 1317, 23], [863, 1336, 25], [942, 1360, 22], [1035, 1356, 24], [960, 1291, 28]].map(([x, y, r]) => <g key={x}>
        <circle cx={x} cy={y} r={r} fill={paint("glow")} />
        <path d={`M${x - 8} ${y}h16M${x} ${y - 15}v30`} stroke="#FFF4C3" strokeWidth="1" opacity=".85" />
        <circle cx={x} cy={y} r="2.5" fill="#FFFFEB" />
      </g>)}

      </g>}

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
      {/* A shorter ribbon sits lower on the left and tapers downward beside the portrait. */}
      <svg data-cyber-wave-layer="left" x="0" y="0" width="100%" height="100%"
        viewBox="0 0 1080 1440" preserveAspectRatio="xMinYMin meet">
      <ellipse cx="540" cy="535" rx="350" ry="295" fill={paint("portrait-halo")} />
      {/* Rounded shoulders and a feathered tail echo the reference's fluid ribbon. */}
      <g data-cyber-wave="left" transform="translate(0 85)" mask={paint("left-soft")}>
        <path d="M0 295C145 317 244 465 360 550C239 487 144 405 0 465Z" fill={paint("left-ribbon")} />
        <path d="M0 295C126 314 207 417 285 492C183 417 101 355 0 397Z" fill={paint("navy")} />
        <g clipPath={paint("left-surface")}>
          <ellipse cx="110" cy="415" rx="195" ry="55" transform="rotate(12 110 415)" fill={paint("left-gloss")} />
        </g>
        <path d="M0 375C141 346 246 465 360 550C237 480 137 374 0 403Z" fill={paint("left-gold")} />
        <path d="M0 375C141 346 246 465 360 550" stroke="#FFF5CE" strokeWidth=".8" opacity=".45" />
        <path d="M0 332C139 352 239 460 352 544" stroke={cyan} strokeWidth="1.1" opacity=".45" />
        <path d="M0 465C108 424 221 488 312 525L130 550H0Z" fill={paint("dots")} opacity=".12" />
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
      {!native && <>
      <svg data-cyber-icon="shield" x="0" y="81%" width="24%" height="19%"
        viewBox="0 0 220 252" preserveAspectRatio="xMinYMax meet">
        <defs>
          <path id={`${id}-shield-shape`} d="M94 35C114 52 136 61 164 66C168 138 148 187 94 221C40 187 20 138 24 66C52 61 74 52 94 35Z" />
          <clipPath id={`${id}-shield-interior`}><use href={`#${id}-shield-shape`} /></clipPath>
          <radialGradient id={`${id}-shield-glass`} cx="50%" cy="40%" r="70%">
            <stop stopColor={native ? "#007DA2" : surface} stopOpacity=".8" />
            <stop offset=".55" stopColor={native ? "#00496B" : blue} stopOpacity=".9" />
            <stop offset="1" stopColor={native ? "#002C4D" : deep} />
          </radialGradient>
          <radialGradient id={`${id}-shield-bloom`}>
            <stop stopColor="#B5F7FF" stopOpacity=".7" /><stop offset=".4" stopColor={cyan} stopOpacity=".4" />
            <stop offset="1" stopColor={cyan} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Fine circular orbits surround the curved glass shield; no polygon cage. */}
        <ellipse cx="94" cy="132" rx="128" ry="133" fill={paint("shield-bloom")} />
        <g stroke={light} strokeWidth=".7" opacity=".5">
          <ellipse cx="94" cy="132" rx="91" ry="108" />
          <ellipse cx="94" cy="132" rx="104" ry="119" strokeDasharray="1 7" />
          <ellipse cx="94" cy="132" rx="118" ry="130" opacity=".65" />
          <path d="M0 65Q82 5 184 57M0 92Q89 27 205 91M0 126Q99 105 215 129M1 205Q103 254 202 182" />
        </g>
        <use href={`#${id}-shield-shape`} fill="none" stroke={cyan} strokeWidth="14" opacity=".2" filter={paint("shield-light")} />
        <use href={`#${id}-shield-shape`} fill={paint("shield-glass")} stroke={cyan} strokeWidth="5" opacity=".95" />
        <g clipPath={paint("shield-interior")}>
          <rect x="22" y="34" width="145" height="190" fill={paint("shield-mesh")} />
          <ellipse cx="94" cy="82" rx="77" ry="60" fill={paint("shield-bloom")} opacity=".35" />
        </g>
        <use href={`#${id}-shield-shape`} fill="none" stroke="#C2FAFF" strokeWidth="1.8" />
        {/* One light-blue padlock with a rounded shackle and a dark keyhole. */}
        <g fill="none" stroke="#8CEBFF" strokeWidth="5" strokeLinecap="round">
          <path d="M80 129V118A14 14 0 0 1 108 118V129" filter={paint("shield-light")} />
          <path d="M80 129V118A14 14 0 0 1 108 118V129" />
        </g>
        <rect x="72" y="130" width="44" height="46" rx="4" fill="#8CEBFF" />
        <path d="M94 142A5 5 0 0 0 91 151L90 164H98L97 151A5 5 0 0 0 94 142Z" fill={native ? "#005071" : navy} />
        {[[10, 84], [40, 24], [84, 14], [143, 26], [189, 93], [199, 132], [182, 186], [94, 239], [35, 213], [8, 170]].map(([x, y]) => <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="9" fill={paint("shield-bloom")} />
          <circle cx={x} cy={y} r="1.8" fill="#D0FAFF" />
        </g>)}
        <circle cx="94" cy="35" r="13" fill={paint("shield-bloom")} />
        <circle cx="94" cy="221" r="14" fill={paint("shield-bloom")} />
      </svg>
      </>}
      {stars.filter(([, y]) => !native && y >= 600).map(([x, y, r]) => <svg key={`${x}-${y}`} data-cyber-icon="sparkle"
        x={`${(x - r * 3) / 1080 * 100}%`} y={`${(y - r * 3) / 1440 * 100}%`}
        width={`${r * 6 / 1080 * 100}%`} height={`${r * 6 / 1440 * 100}%`}
        viewBox={`${-r * 3} ${-r * 3} ${r * 6} ${r * 6}`} preserveAspectRatio="xMidYMid meet">
        <circle r={r * 3} fill={paint("glow")} />
        <path d={`M${-r} 0h${r * 2}M0 ${-r}v${r * 2}`} stroke="#FFF5CE" strokeWidth="1" />
        <circle r="2.2" fill="#FFFBE2" />
      </svg>)}
      {native && <CyberMagazineReferenceFooter id={id} />}
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

/** Original reference pixels preserve the painted waves, shield and lighting
 * with baked raster text removed so the card footer motto renders as crisp DOM text. */
function CyberMagazineReferenceFooter({ id }: { id: string }) {
  return <svg data-cyber-footer="reference" width="100%" height="100%"
    viewBox="0 0 1392 328" preserveAspectRatio="xMidYMax meet">
    <defs>
      <linearGradient id={`${id}-reference-top-fade`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="50"><stop stopColor="black" /><stop offset="1" stopColor="white" /></linearGradient>
      <mask id={`${id}-reference-top`} maskUnits="userSpaceOnUse" x="0" y="0" width="1392" height="328"><rect width="1392" height="328" fill={`url(#${id}-reference-top-fade)`} /></mask>
      <linearGradient id={`${id}-reference-center-fade`} gradientUnits="userSpaceOnUse" x1="0" y1="138" x2="0" y2="215">
        <stop stopColor="black" /><stop offset=".35" stopColor="black" />
        <stop offset=".7" stopColor="#888" /><stop offset="1" stopColor="white" />
      </linearGradient>
      <filter id={`${id}-reference-feather`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
      <mask id={`${id}-reference-frame`} maskUnits="userSpaceOnUse" x="0" y="0" width="1392" height="328">
        <rect x="-30" y="138" width="1452" height="222" fill={`url(#${id}-reference-center-fade)`} />
        <g fill="white" filter={`url(#${id}-reference-feather)`}>
          <path d="M-30 -30H112V85L160 165V360H-30Z" />
          <path d="M1298 -30H1422V360H1262V165L1298 90Z" />
        </g>
      </mask>
      <clipPath id={`${id}-reference-left`}><rect x="-30" y="-30" width="250.5" height="388" /></clipPath>
      <clipPath id={`${id}-reference-mid`}><rect x="219.5" y="-30" width="1021" height="388" /></clipPath>
      <clipPath id={`${id}-reference-right`}><rect x="1239.5" y="-30" width="182.5" height="388" /></clipPath>
      <g id={`${id}-reference-art`} mask={`url(#${id}-reference-top)`}>
        <g mask={`url(#${id}-reference-frame)`}>
          <image href="/images/brand/cyber-magazine-footer-reference.png" x="-48" y="0" width="1572" height="360" />
        </g>
      </g>
    </defs>
    <g data-cyber-footer-slice="left"><g clipPath={`url(#${id}-reference-left)`}><use href={`#${id}-reference-art`} /></g></g>
    <g data-cyber-footer-slice="mid"><g clipPath={`url(#${id}-reference-mid)`}><use href={`#${id}-reference-art`} /></g></g>
    <g data-cyber-footer-slice="right"><g clipPath={`url(#${id}-reference-right)`}><use href={`#${id}-reference-art`} /></g></g>
  </svg>;
}
