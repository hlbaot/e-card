"use client";

import { formatPhone } from "@/shared/utils/phone";

import { useId, type Ref } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { Employee } from "@/shared/types";

const INK = "#183c70";

function wrap(value: string, limit: number, maxLines = 3) {
  const lines: string[] = [];
  for (const word of value.trim().split(/\s+/)) {
    const last = lines.length - 1;
    if (last < 0 || `${lines[last]} ${word}`.length > limit) lines.push(word);
    else lines[last] += ` ${word}`;
  }
  return lines.length > maxLines
    ? [...lines.slice(0, maxLines - 1), `${lines[maxLines - 1].slice(0, limit - 1)}…`]
    : lines;
}

export function CyberSecurityBusinessCard({ employee: e, url, svgRef }: {
  employee: Employee;
  url: string;
  svgRef?: Ref<SVGSVGElement>;
}) {
  const id = useId().replace(/:/g, "");
  const name = e.fullName.toLocaleUpperCase("vi-VN");
  const nameSize = Math.min(32, 760 / Math.max(name.length, 1));
  const position = wrap(e.position.trim(), 40, 2);
  const rows = [
    ...(e.phone ? [{ Icon: Phone, lines: [formatPhone(e.phone)] }] : []),
    ...(e.email ? [{ Icon: Mail, lines: [e.email] }] : []),
    ...e.offices.filter(o => o.address).slice(0, 2).map(o => ({ Icon: MapPin, lines: wrap(o.address, 33) })),
  ];
  const contactTop = 339 + Math.max(0, position.length - 1) * 31;
  const rowGap = 18;
  const lineCount = rows.reduce((n, row) => n + row.lines.length, 0);
  const lineHeight = Math.min(36, (540 - contactTop - rows.length * rowGap) / Math.max(1, lineCount));
  // Both columns share one vertical center, regardless of wrapped contact lines.
  const centerY = 320;
  const brandTop = 128;
  const brandBottom = 393;
  const brandOffset = centerY - (brandTop + brandBottom) / 2;
  const detailsTop = 226 - nameSize * .8;
  const detailsBottom = rows.length
    ? contactTop + (lineCount - 1) * lineHeight + (rows.length - 1) * rowGap + 7
    : 269 + Math.max(0, position.length - 1) * 31;
  const detailsOffset = centerY - (detailsTop + detailsBottom) / 2;
  const dividerHalfHeight = Math.max(brandBottom - brandTop, detailsBottom - detailsTop) / 2 + 16;
  let y = contactTop;

  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 600" width="1050" height="600"
      role="img" aria-label={`Danh thiếp An ninh mạng của ${e.fullName}`} data-export-background="#ffffff"
      style={{ display: "block", width: "100%", height: "auto", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <defs>
        <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#10254a" /><stop offset=".5" stopColor="#214b7c" /><stop offset="1" stopColor="#559ac4" />
        </linearGradient>
      </defs>
      <rect width="1050" height="600" fill="white" />
      <path d="M0 0H264C148 31 45 104 0 218Z" fill={`url(#${id}-blue)`} />
      <path d="M0 0H181C88 35 26 88 0 139Z" fill="#387aa7" opacity=".65" />
      <path d="M0 0H99C49 26 17 56 0 84Z" fill="#5397bb" opacity=".7" />
      <path d="M1050 600H787C911 568 1002 494 1050 383Z" fill={`url(#${id}-blue)`} />
      <path d="M1050 600H865C957 566 1020 511 1050 461Z" fill="#387aa7" opacity=".65" />
      <path d="M1050 600H947C995 575 1030 545 1050 516Z" fill="#5397bb" opacity=".7" />
      <g transform={`translate(0 ${brandOffset})`}>
      {/* Trim transparent padding while keeping the complete logo centered in its column. */}
      <svg x="40" y="206" width="390" height="109" viewBox="150 300 1400 390">
        <image href="/logo_anninhmang.png" width="1672" height="941" />
      </svg>
      </g>
      <path d={`M467 ${centerY - dividerHalfHeight}V${centerY + dividerHalfHeight}`} stroke={INK} strokeWidth="1.5" />
      <g transform={`translate(18 ${detailsOffset})`}>
      <text x="489" y="226" fill={INK} fontSize={nameSize} fontWeight="800"
        {...(name.length > 35 ? { textLength: 510, lengthAdjust: "spacingAndGlyphs" as const } : {})}>{name}</text>
      {position.map((line, i) => <text key={i} x="489" y={263 + i * 31} fill={INK} fontSize="22" fontWeight="400" fontStyle="italic">{line}</text>)}
      {rows.map(({ Icon, lines }, index) => {
        const rowY = y;
        y += lines.length * lineHeight + rowGap;
        return <g key={index}>
          <circle cx="505" cy={rowY - 8} r="16" fill="none" stroke={INK} strokeWidth="1.4" />
          <Icon x="494" y={rowY - 19} width="22" height="22" color={INK} strokeWidth="1.5" />
          {lines.map((line, i) => <text key={i} x="537" y={rowY + i * lineHeight} fill={INK}
            fontSize={Math.min(27, lineHeight - 2, 800 / Math.max(line.length, 1))} fontWeight="500">{line}</text>)}
        </g>;
      })}
      </g>
      <rect x="904" y="26" width="120" height="120" fill="white" />
      <QRCodeSVG x="912" y="34" value={url} size={104} level="M" marginSize={0} fgColor={INK} bgColor="#ffffff" />
    </svg>
  );
}
