"use client";

import { useId, type Ref, type SVGProps } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getPublicFields, type Employee } from "@/shared/types";

type IconProps = SVGProps<SVGSVGElement>;
function Phone(props: IconProps) {
  return <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02z" /></svg>;
}
function Mail(props: IconProps) {
  return <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m3 6 9 7 9-7M3 18l6-5m12 5-6-5" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
}
function MapPin(props: IconProps) {
  return <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path fillRule="evenodd" d="M12 1.5a8 8 0 0 0-8 8C4 15.5 12 23 12 23s8-7.5 8-13.5a8 8 0 0 0-8-8Zm0 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" /></svg>;
}
function Globe(props: IconProps) {
  return <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="10" /><g fill="none" stroke="white" strokeWidth="1.3"><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 9h18M3 15h18" /></g></svg>;
}

function wrapText(value: string, limit: number, maxLines = 2) {
  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > limit) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines.length > maxLines
    ? [...lines.slice(0, maxLines - 1), `${lines[maxLines - 1].slice(0, limit - 1)}…`]
    : lines;
}

// Separate vertical and horizontal traces reproduce the reference chip motif.
const verticalTracks = [
  { d: "M-100-128-160-188V-240", end: [-160, -240] },
  { d: "M-24-128V-230", end: [-24, -230] },
  { d: "M24-128V-230", end: [24, -230] },
  { d: "M100-128 160-188V-240", end: [160, -240] },
  { d: "M-112-128-172-198V-266H-192V-248", end: [-192, -248] },
  { d: "M-88-128-148-198V-280" },
  { d: "M-64-128V-170L-120-226V-270H-98V-234", end: [-98, -234] },
  { d: "M-40-128V-194L-80-234V-280" },
  { d: "M-12-128V-252", end: [-12, -252] },
  { d: "M12-128V-252", end: [12, -252] },
  { d: "M40-128V-194L80-234V-280" },
  { d: "M64-128V-170L120-226V-270H98V-234", end: [98, -234] },
  { d: "M88-128 148-198V-280" },
  { d: "M112-128 172-198V-266H192V-248", end: [192, -248] },
];
const horizontalTracks = [
  { d: "M128-70H208", end: [208, -70] },
  { d: "M128-44H238" },
  { d: "M128 0H238" },
  { d: "M128 54H204", end: [204, 54] },
  { d: "M128 80H238" },
  { d: "M128-112 224-198H234" },
  { d: "M128-96 220-178", end: [220, -178] },
  { d: "M128-84H238" },
  { d: "M128-56H224", end: [224, -56] },
  { d: "M128-32H238" },
  { d: "M128-8H194V-16H238" },
  { d: "M128 16H204V8H224", end: [224, 8] },
  { d: "M128 40H238" },
  { d: "M128 68H224", end: [224, 68] },
  { d: "M128 92H238" },
  { d: "M128 108 220 190", end: [220, 190] },
  { d: "M128 128 224 214H234" },
];

/** A self-contained vector: the preview and downloaded PNG share this artwork. */
export function QrBusinessCard({ employee: e, url, svgRef }: {
  employee: Employee;
  url: string;
  svgRef?: Ref<SVGSVGElement>;
}) {
  const id = useId().replace(/:/g, "");
  const pf = getPublicFields(e);
  const rows = [
    ...(pf.phone && e.phone ? [{ Icon: Phone, value: e.phone }] : []),
    ...(pf.email && e.email ? [{ Icon: Mail, value: e.email }] : []),
    ...(pf.website && e.website ? [{ Icon: Globe, value: e.website.replace(/^https?:\/\//, "").replace(/\/$/, "") }] : []),
    ...(pf.offices && e.offices[0]?.address ? [{ Icon: MapPin, value: e.offices[0].address }] : []),
  ];
  const position = wrapText(e.position || "", 38);

  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 560" width="1050" height="560"
      data-export-background="#042345"
      role="img" aria-label={`Danh thiếp QR của ${e.fullName}`}
      style={{ display: "block", width: "100%", height: "auto", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <defs>
        <clipPath id={`${id}-clip`}><rect width="1050" height="560" rx="40" /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="1050" height="560" fill="#042345" />
        {/* The top/bottom fan stays vertical; the side rails stay horizontal. */}
        <g transform="translate(810 280)" fill="none" stroke="#69b5d8"
          strokeWidth="3" strokeOpacity=".7" strokeLinejoin="miter">
          {[1, -1].map((direction) => <g key={`vertical-${direction}`} transform={`scale(1 ${direction})`}>
            {verticalTracks.map(({ d, end }, index) => <g key={index}>
              <path d={d} />
              {end && <rect x={end[0] - 4} y={end[1] - 4} width="8" height="8" fill="#042345" />}
            </g>)}
            <rect x="-16" y="-190" width="8" height="8" fill="#042345" />
            <rect x="8" y="-190" width="8" height="8" fill="#042345" />
            <rect x="-4" y="-272" width="8" height="8" fill="#042345" />
          </g>)}
          {[1, -1].map((direction) => <g key={`horizontal-${direction}`} transform={`scale(${direction} 1)`}>
            {horizontalTracks.map(({ d, end }, index) => <g key={index}>
              <path d={d} />
              {end && <rect x={end[0] - 4} y={end[1] - 4} width="8" height="8" fill="#042345" />}
            </g>)}
          </g>)}
        </g>
        <rect x="682" y="152" width="256" height="256" fill="#042345" stroke="#69b5d8" strokeWidth="3" strokeOpacity=".8" />
        <rect x="700" y="170" width="220" height="220" fill="white" />
        <QRCodeSVG x="700" y="170" value={url} size={220} level="H" marginSize={4} bgColor="#ffffff" fgColor="#04172d" />
        <text x="60" y="116" fill="#ffffff" fontSize="48" fontWeight="700"
          textLength={e.fullName.length > 18 ? 450 : undefined} lengthAdjust="spacingAndGlyphs">{e.fullName}</text>
        {position.map((line, i) => <text key={i} x="60" y={156 + i * 28} fill="#b7ccdf" fontSize="24">{line}</text>)}
        <path d={`M60 ${position.length > 1 ? 210 : 182}H136`} stroke="#59d7e8" strokeWidth="4" />
        {rows.map(({ Icon, value }, index) => {
          const lines = wrapText(value, 36);
          const y = 296 + index * 60;
          return <g key={index}>
            <circle cx="78" cy={y + 1} r="20" fill="#ffffff" />
            <Icon x="66" y={y - 11} width="24" height="24" color="#042345" />
            {lines.map((line, i) => <text key={i} x="114" y={y + 7 + i * 22} fill="#e2ecf5" fontSize="21"
              textLength={line.length > 34 ? 410 : undefined} lengthAdjust="spacingAndGlyphs">{line}</text>)}
          </g>;
        })}
        <rect x="1" y="1" width="1048" height="558" rx="39" fill="none" stroke="#78dcf3" strokeOpacity=".28" strokeWidth="2" />
      </g>
    </svg>
  );
}
