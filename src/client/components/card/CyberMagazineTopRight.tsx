import { getCyberMagazineColors, isCyberMagazineDefaultColor } from "@/shared/constants/cyber-magazine";
import { toTint } from "@/shared/utils/color";

// Coarse geographic outlines keep the dotted hemisphere recognizable as land,
// rather than a uniform screen of dots. Coordinates are longitude / latitude.
const CONTINENTS = [
  [[-17, 36], [10, 37], [32, 31], [43, 12], [51, 11], [42, -12], [32, -27], [18, -35], [10, -18], [0, -2], [-16, 12]],
  [[-10, 36], [-9, 58], [5, 59], [15, 71], [29, 71], [43, 55], [50, 42], [29, 36], [20, 40], [13, 36]],
  [[28, 42], [39, 60], [68, 74], [110, 73], [143, 60], [150, 47], [124, 30], [121, 20], [109, 19], [104, 7], [94, 16], [80, 7], [70, 25], [56, 25], [51, 12], [42, 13], [35, 30]],
];
function onLand(longitude: number, latitude: number) {
  return CONTINENTS.some(polygon => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
      if ((yi > latitude) !== (yj > latitude) && longitude < (xj - xi) * (latitude - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  });
}

const SILHOUETTE = "M440 0H1080V450C895 401 849 290 703 153C613 69 527 24 440 0Z";
const FIELD = "M440 0H1080V350C1002 345 953 322 905 285C780 205 642 44 440 0Z";
const SEAM = "M440 0C642 44 780 205 905 285C953 322 1002 345 1080 350";
const GOLD_ROUTES = [
  { a: [744, 194], b: [881, -56], c: [1110, 104], nodes: [.32, .77] },
  { a: [770, 274], b: [926, 29], c: [1100, 245], nodes: [.43, .8] },
  { a: [821, 3], b: [1059, 62], c: [1049, 346], nodes: [.58] },
  { a: [823, 264], b: [981, 390], c: [1102, 182], nodes: [.57] },
];
const DOTS = Array.from({ length: 128 * 208 }, (_, i) => {
  const row = Math.floor(i / 208), column = i % 208;
  const jitter = Math.sin(i * 12.9898 + 78.233) * .13;
  const latitude = ((row + jitter) / 127 - .5) * Math.PI;
  const longitude = -Math.PI / 2 + (column + (row % 2) * .5 + jitter) / 207 * Math.PI;
  const x = Math.cos(latitude) * Math.sin(longitude);
  const y = Math.sin(latitude), z = Math.cos(latitude) * Math.cos(longitude);
  const pitch = .16, tilt = -.18;
  const py = y * Math.cos(pitch) - z * Math.sin(pitch);
  const depth = y * Math.sin(pitch) + z * Math.cos(pitch);
  const px = 1130 + 390 * (x * Math.cos(tilt) - py * Math.sin(tilt));
  const sy = 285 + 390 * (x * Math.sin(tilt) + py * Math.cos(tilt));
  const land = onLand(longitude * 180 / Math.PI + 125, -latitude * 180 / Math.PI);
  return { x: px, y: sy, land, r: land ? .65 + depth * .48 : .45,
    opacity: land ? (.2 + depth * .64) * (.85 + .15 * Math.sin(i * .73)) : .018 + depth * .055, depth };
}).filter(dot => dot.depth > .04 && dot.x > 738 && dot.x < 1084 && dot.y > -4 && dot.y < 365);

/** This entire scene is clipped to the existing corner silhouette. It does not
 * change the portrait, controls, footer, white area or other motifs. */
export function CyberMagazineTopRight({ id: ownerId, primaryColor }: { id: string; primaryColor: string }) {
  const id = `${ownerId}-corner`;
  const native = isCyberMagazineDefaultColor(primaryColor);
  const colors = getCyberMagazineColors(primaryColor);
  const tint = (fallback: string, amount: number) => native ? fallback : toTint(primaryColor, amount);
  const cyan = tint("#22CCE3", .4), ice = tint("#BFEAF7", .78);
  const url = (name: string) => `url(#${id}-${name})`;
  return <g data-cyber-top-right="magazine">
    <defs>
      <clipPath id={`${id}-bounds`}><path d={SILHOUETTE} /></clipPath>
      <clipPath id={`${id}-field`}><path d={FIELD} /></clipPath>
      <clipPath id={`${id}-sphere`}><circle cx="1130" cy="285" r="390" /></clipPath>
      <linearGradient id={`${id}-outer`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={native ? "#005B7A" : colors.navy} /><stop offset=".6" stopColor={native ? "#007B98" : colors.surface} /><stop offset="1" stopColor={native ? "#00A0B7" : colors.surface} />
      </linearGradient>
      <linearGradient id={`${id}-inner`} x1="0" y1="0" x2=".6" y2="1">
        <stop stopColor={native ? "#042C4F" : colors.deep} /><stop offset="1" stopColor={native ? "#004763" : colors.navy} />
      </linearGradient>
      <linearGradient id={`${id}-navy`} x1="0" y1="0" x2=".8" y2="1">
        <stop stopColor={native ? "#032B4A" : colors.deep} /><stop offset=".5" stopColor={native ? "#003C59" : colors.navy} /><stop offset="1" stopColor={native ? "#005272" : colors.blue} />
      </linearGradient>
      <radialGradient id={`${id}-sphere-fill`} cx="82%" cy="48%" r="85%">
        <stop stopColor={native ? "#07516F" : colors.surface} /><stop offset=".65" stopColor={native ? "#003450" : colors.navy} /><stop offset="1" stopColor={native ? "#001D39" : colors.deep} />
      </radialGradient>
      <linearGradient id={`${id}-land`} gradientUnits="userSpaceOnUse" x1="780" y1="0" x2="1120" y2="325">
        <stop stopColor={cyan} /><stop offset=".42" stopColor={ice} /><stop offset="1" stopColor={cyan} stopOpacity=".6" />
      </linearGradient>
      <radialGradient id={`${id}-atmosphere`}>
        <stop offset=".86" stopColor={cyan} stopOpacity="0" /><stop offset=".94" stopColor={cyan} stopOpacity=".04" />
        <stop offset=".97" stopColor={cyan} stopOpacity=".55" /><stop offset=".983" stopColor={ice} stopOpacity=".9" />
        <stop offset="1" stopColor={cyan} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-gold`} gradientUnits="userSpaceOnUse" x1="440" y1="0" x2="1080" y2="350">
        <stop stopColor="#B8860B" /><stop offset=".25" stopColor="#E6C766" /><stop offset=".48" stopColor="#FFF4C0" />
        <stop offset=".62" stopColor="#C9A227" /><stop offset=".83" stopColor="#E6C766" /><stop offset="1" stopColor="#C9A227" />
      </linearGradient>
      <linearGradient id={`${id}-route`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#E6C766" stopOpacity=".25" /><stop offset=".5" stopColor="#F7E4A0" stopOpacity=".9" /><stop offset="1" stopColor="#C9A227" stopOpacity=".45" />
      </linearGradient>
      <linearGradient id={`${id}-bars`} x1="0" y1="1" x2="0" y2="0">
        <stop stopColor={cyan} stopOpacity=".15" /><stop offset=".7" stopColor={cyan} stopOpacity=".7" /><stop offset="1" stopColor={tint("#7CC8FF", .56)} />
      </linearGradient>
      <radialGradient id={`${id}-node`}>
        <stop stopColor="#FFFFF0" /><stop offset=".08" stopColor="#FFF8D7" /><stop offset=".22" stopColor="#E6C766" stopOpacity=".85" />
        <stop offset=".48" stopColor="#E6C766" stopOpacity=".22" /><stop offset="1" stopColor="#E6C766" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-haze`}>
        <stop stopColor={ice} stopOpacity=".3" /><stop offset=".35" stopColor={cyan} stopOpacity=".1" /><stop offset="1" stopColor={cyan} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-quiet`}>
        <stop offset="0" stopColor="#111" /><stop offset=".6" stopColor="#333" /><stop offset="1" stopColor="white" />
      </radialGradient>
      <mask id={`${id}-details`} maskUnits="userSpaceOnUse" x="440" y="0" width="640" height="450">
        <rect x="440" width="640" height="450" fill="white" />
        {/* Quiet lower-right pocket for the existing QR/share controls. */}
        <ellipse cx="1006" cy="326" rx="116" ry="62" fill={url("quiet")} />
      </mask>
    </defs>
    <g clipPath={url("bounds")}>
      <path d={SILHOUETTE} fill={url("outer")} />
      <path d="M459 0H1080V429C919 390 846 295 720 164C619 62 541 21 459 0Z" fill={url("inner")} />
      <path d={FIELD} fill={url("navy")} />
      <path d="M453 0C627 48 735 205 850 315C935 394 1020 426 1080 441" stroke={ice} strokeWidth="1.1" opacity=".15" />
      <g clipPath={url("field")}>
        <ellipse cx="1030" cy="170" rx="205" ry="196" fill={url("haze")} opacity=".5" />
        <g data-corner-pixels="true" fill={tint("#4A90C2", .32)}>
          {Array.from({ length: 54 }, (_, i) => {
            if ((i * 7 + 3) % 11 < 3) return null;
            return <rect key={i} x={638 + i % 9 * 15} y={22 + Math.floor(i / 9) * 17} width={i % 4 ? 6 : 9} height={i % 4 ? 6 : 9} opacity={.3 + i % 4 * .1} />;
          })}
        </g>
        <circle cx="1130" cy="285" r="390" fill={url("sphere-fill")} />
        <g mask={url("details")}>
          <g clipPath={url("sphere")}>
            {DOTS.map(({ x, y, r, opacity, land }, i) => <circle key={i} cx={x} cy={y} r={r} opacity={opacity} fill={land ? url("land") : cyan} />)}
            <g stroke={ice} strokeWidth=".7" opacity=".13">
              {[.38, .82].map(n => <ellipse key={n} cx="1130" cy="285" rx={390 * n} ry="390" transform="rotate(24 1130 285)" />)}
              {[-.48, .32].map(n => <ellipse key={n} cx="1130" cy={285 + n * 350} rx={Math.sqrt(1 - n * n) * 390} ry="74" transform="rotate(18 1130 285)" />)}
            </g>
          </g>
          <circle cx="1130" cy="285" r="400" fill={url("atmosphere")} />
          <path d="M755 178C790 78 882 1 980 -24" stroke={cyan} strokeWidth="8" opacity=".08" />
          <path d="M755 178C790 78 882 1 980 -24" stroke={ice} strokeWidth="1.8" opacity=".85" />
          <g data-globe-veins="luminous" strokeLinecap="round">
            {GOLD_ROUTES.map(({ a, b, c, nodes }, index) => {
              const d = `M${a.join(" ")}Q${b.join(" ")} ${c.join(" ")}`;
              return <g key={index}>
                <path d={d} stroke="#E6C766" strokeWidth="4" opacity=".07" />
                <path d={d} stroke={url("route")} strokeWidth="1.15" />
                {nodes.map((t, n) => {
                  const x = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0];
                  const y = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1];
                  const r = n % 2 ? 13 : 18;
                  return <g key={t}>
                    <circle cx={x} cy={y} r={r} fill={url("node")} />
                    <circle cx={x} cy={y} r="1.8" fill="#FFFFED" />
                    {n === 0 && <path d={`M${x - 6} ${y}h12M${x} ${y - 6}v12`} stroke="#FFF4C0" strokeWidth=".75" opacity=".8" />}
                  </g>;
                })}
              </g>;
            })}
          </g>
          <g stroke={ice} strokeWidth=".9" opacity=".6">
            <path d="M725 204Q792 -19 1060 10M802 89Q959 41 1101 195M839 257Q970 120 1105 142" />
            {[[802, 89], [976, 123], [1038, 171], [869, 227]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.8" fill={ice} stroke="none" />)}
          </g>
          <g data-corner-chart="true">
            {[21, 34, 53, 44, 83, 115, 65, 143, 96, 166].map((h, i) => {
              const x = 950 + i * 14, y = 303 - h;
              return <g key={i}>
                <rect x={x} y={y} width={i % 3 ? 6 : 4} height={h} fill={i === 6 ? ice : url("bars")} opacity={i === 6 ? .8 : .75} />
                <path d={`M${x + 3} ${y - 17}V${y}M${x - 1} ${y - 8}h8`} stroke={ice} strokeWidth=".9" opacity=".65" />
                <circle cx={x + 3} cy={y - 17} r="1.3" fill={ice} />
              </g>;
            })}
          </g>
          {Array.from({ length: 29 }, (_, i) => {
            const x = 754 + i * 47 % 330, y = 9 + i * 73 % 313;
            return <g key={i}>
              {i % 8 === 0 && <circle cx={x} cy={y} r="6" fill={url("haze")} />}
              <circle cx={x} cy={y} r={i % 5 ? .75 : 1.3} fill={ice} opacity={i % 3 ? .4 : .8} />
            </g>;
          })}
        </g>
      </g>
      {/* The gold seam sits above every detail and catches two small reflections. */}
      <path d={SEAM} stroke="#E6C766" strokeWidth="15" opacity=".09" />
      <path d="M440 0C642 44 780 205 905 285C953 322 1002 345 1080 350V361C1002 356 950 332 900 295C774 214 635 49 440 3Z" fill={url("gold")} />
      <path d={SEAM} stroke="#FFF1BB" strokeWidth=".9" opacity=".85" />
      {[[847, 247, 12], [1012, 347, 9]].map(([x, y, r]) => <g key={x}>
        <circle cx={x} cy={y} r={r} fill={url("node")} />
        <path d={`M${x - 5} ${y}h10M${x} ${y - 5}v10`} stroke="#FFF7D6" strokeWidth=".75" />
      </g>)}
    </g>
  </g>;
}
