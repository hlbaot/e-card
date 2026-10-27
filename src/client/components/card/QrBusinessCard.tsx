"use client";

import { useId, type Ref } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { getPublicFields, type Employee } from "@/shared/types";

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
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 600" width="1050" height="600"
      role="img" aria-label={`Danh thiếp QR của ${e.fullName}`}
      style={{ display: "block", width: "100%", height: "auto", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <defs>
        <linearGradient id={`${id}-bg`} x2="1" y2="1">
          <stop stopColor="#082a48" /><stop offset="1" stopColor="#04172d" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="#16cde0" stopOpacity=".17" /><stop offset="1" stopColor="#16cde0" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-clip`}><rect width="1050" height="600" rx="40" /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="1050" height="600" fill={`url(#${id}-bg)`} />
        <circle cx="810" cy="300" r="340" fill={`url(#${id}-glow)`} />
        {/* Circuit traces travel away from the QR, leaving its quiet zone intact. */}
        {[0, 90, 180, 270].map((rotation) => (
          <g key={rotation} transform={`rotate(${rotation} 810 300)`} fill="none" stroke="#57c6e9" strokeWidth="2.5" strokeOpacity=".64">
            {[-84, -56, -28, 0, 28, 56, 84].map((offset, i) => {
              const end = 72 + (i % 3) * 22;
              const bend = 144 - (i % 2) * 18;
              const x = 810 + offset;
              const endX = x + offset * .48;
              return <g key={offset}>
                <path d={`M${x} 162V${bend}L${endX} ${bend - 36}V${end}`} />
                <rect x={endX - 4} y={end - 8} width="8" height="8" fill="#082a48" />
              </g>;
            })}
          </g>
        ))}
        <rect x="672" y="162" width="276" height="276" rx="18" fill="#08283f" stroke="#5dd9ee" strokeWidth="2" />
        <rect x="691" y="181" width="238" height="238" rx="8" fill="white" />
        <QRCodeSVG x="695" y="185" value={url} size={230} level="H" marginSize={4} bgColor="#ffffff" fgColor="#04172d" />
        <text x="810" y="490" textAnchor="middle" fill="#a5e9f4" fontSize="13" letterSpacing="3">QUÉT ĐỂ KẾT NỐI</text>
        <text x="60" y="66" fill="#70dcec" fontSize="14" fontWeight="700" letterSpacing="3">DIGITAL BUSINESS CARD</text>
        <text x="60" y="132" fill="#ffffff" fontSize="42" fontWeight="700"
          textLength={e.fullName.length > 22 ? 490 : undefined} lengthAdjust="spacingAndGlyphs">{e.fullName}</text>
        {position.map((line, i) => <text key={i} x="60" y={174 + i * 28} fill="#b7ccdf" fontSize="22">{line}</text>)}
        <path d={`M60 ${position.length > 1 ? 224 : 198}H136`} stroke="#59d7e8" strokeWidth="4" />
        <text x="60" y="258" fill="#7bdeeb" fontSize="15" fontWeight="700" letterSpacing="1"
          textLength={(e.companyShort || e.company).length > 44 ? 490 : undefined} lengthAdjust="spacingAndGlyphs">{e.companyShort || e.company}</text>
        {rows.map(({ Icon, value }, index) => {
          const lines = wrapText(value, 42);
          const y = 308 + index * 56;
          return <g key={index}>
            <circle cx="78" cy={y + 1} r="18" fill="#dff8fc" />
            <Icon x="68" y={y - 9} width="20" height="20" color="#08334e" strokeWidth="2.3" />
            {lines.map((line, i) => <text key={i} x="114" y={y + 7 + i * 22} fill="#e2ecf5" fontSize="19"
              textLength={line.length > 38 ? 480 : undefined} lengthAdjust="spacingAndGlyphs">{line}</text>)}
          </g>;
        })}
        <path d="M60 550H530" stroke="#76ddec" strokeOpacity=".2" />
        <text x="60" y="574" fill="#88a8c2" fontSize="12" letterSpacing="2">QUALITY · TECHNOLOGY · MINDSET</text>
        <rect x="1" y="1" width="1048" height="598" rx="39" fill="none" stroke="#78dcf3" strokeOpacity=".28" strokeWidth="2" />
      </g>
    </svg>
  );
}
