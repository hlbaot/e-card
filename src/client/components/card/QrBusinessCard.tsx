"use client";

import { CyberMagazineExportDecor } from "./CyberMagazineArtwork";

import { formatPhone } from "@/shared/utils/phone";

import { QRCodeSVG } from "qrcode.react";
import { useId, type Ref, type SVGProps } from "react";
import { getPublicFields, type Employee } from "@/shared/types";
import { capitalizeFirstLetter } from "@/shared/utils/format-text";
import { CyberSecurityBusinessCard } from "./CyberSecurityBusinessCard";
import { CardName } from "./CardName";

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

const INK = "#17566d";

// Logo QTM vẽ bằng vector để bản xem trước và PNG tải về giống nhau.
const dumbbells = [
  { a: [203, 50], b: [57, 203] },
  { a: [253, 230], b: [107, 375] },
  { a: [423, 277], b: [277, 425] },
];

// Connected silhouettes keep the soft, narrow necks visible in both SVG and PNG.
const connectedBlobs = [
  // Small upper bulb connected to the larger bulb below it.
  "M1018 115C1031 115 1040 124 1040 137C1040 149 1030 155 1028 166C1024 180 1030 188 1040 197C1060 215 1051 243 1028 253C1004 263 979 247 979 224C979 206 991 196 1002 182C1010 171 1009 160 1001 151C986 135 995 115 1018 115Z",
  // Branching cluster at the right edge, with a small hanging bulb.
  "M964 267C981 267 992 277 1000 288C1013 306 1030 301 1044 287L1065 271V336C1050 324 1039 319 1025 320C1003 321 994 337 982 350C974 360 975 369 982 377C994 391 986 410 969 411C951 412 941 397 949 382C956 369 958 359 950 349C943 341 930 337 930 319C930 293 941 267 964 267Z",
  // A narrow waist joins the two bulbs beside the contact block.
  "M871 333C884 333 893 343 893 355C893 366 884 373 881 383C877 395 884 403 895 414C915 435 901 468 876 470C851 472 834 451 846 428C853 414 865 403 864 389C864 378 850 371 850 356C850 343 859 333 871 333Z",
  // Linked round forms rising from the bottom edge.
  "M691 640C690 617 706 601 726 601C745 601 751 615 769 614C784 613 787 600 798 592C812 582 831 589 835 604C839 620 826 628 829 640Z",
  // Fill the lower-left QR gap with a small linked pair, leaving its white margin clear.
  "M851 500C860 500 867 507 867 516C867 525 859 530 860 540C861 551 875 556 878 569C883 587 867 600 851 595C835 591 830 575 838 562C844 552 852 547 851 538C850 529 837 526 837 516C837 507 843 500 851 500Z",
  "M803 640C804 624 817 614 831 617C845 620 849 633 861 632C875 631 877 616 891 615C906 613 918 624 918 640Z",
  // Large curved cluster continuing beyond the bottom/right edges.
  "M1050 405C1026 403 1011 419 1012 440C1013 459 1028 465 1029 482C1030 499 1011 506 1001 520C985 541 998 559 989 574C981 588 965 582 956 569C946 554 929 554 921 567C912 581 920 595 934 602C949 610 952 623 950 640H1050Z",
];
const blobDots: Array<[number, number, number]> = [
  [958, 170, 8],
  [964, 464, 22],
  [916, 513, 8],
  [819, 487, 7],
  [792, 564, 10],
  [884, 605, 5],
];

/** A self-contained vector: the preview and downloaded PNG share this artwork. */
export function QrBusinessCard(props: {
  employee: Employee;
  url: string;
  svgRef?: Ref<SVGSVGElement>;
}) {
  return props.employee.theme.businessCardType === "an-ninh-mang"
    ? <CyberSecurityBusinessCard {...props} />
    : <QtmBusinessCard {...props} />;
}

function QtmBusinessCard({ employee: e, url, svgRef }: {
  employee: Employee;
  url: string;
  svgRef?: Ref<SVGSVGElement>;
}) {
  const id = useId().replace(/:/g, "");
  const pf = getPublicFields(e);
  const website = e.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  type Row = { Icon: typeof Phone | null; label: string; value: string };
  const rows: Row[] = [
    ...(pf.offices
      ? e.offices.filter((o) => o.address).slice(0, 3).map((o, i): Row => ({
          Icon: i === 0 ? MapPin : null, label: o.label || "Office", value: o.address,
        }))
      : []),
    ...(pf.phone && e.phone ? [{ Icon: Phone, label: "Mobile", value: formatPhone(e.phone) }] : []),
    ...(pf.email && e.email ? [{ Icon: Mail, label: "Email", value: e.email }] : []),
    ...(pf.website && website ? [{ Icon: Globe, label: "Web", value: website }] : []),
  ];
  const company = wrapText((e.company || "").toUpperCase(), 40);
  const contactRows = rows.map((row) => ({ ...row, lines: wrapText(row.value, 48) }));
  const firstContactY = 398 + Math.max(0, company.length - 1) * 30;
  const lineCount = contactRows.reduce((count, row) => count + row.lines.length, 0);
  const rowGap = 6;
  const lineHeight = Math.min(28, (608 - firstContactY - Math.max(0, rows.length - 1) * rowGap) / Math.max(1, lineCount - 1));
  const contactFontSize = Math.min(24, lineHeight - 2);
  const iconSize = Math.min(25, lineHeight);
  let cursor = firstContactY;

  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 640" width="1050" height="640"
      data-export-background="#ffffff"
      role="img" aria-label={`Danh thiếp của ${e.fullName}`}
      style={{ display: "block", width: "100%", height: "auto", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <defs>
        <clipPath id={`${id}-clip`}><rect width="1050" height="640" rx="8" /></clipPath>
        {dumbbells.map(({ a, b }, i) => (
          <linearGradient key={i} id={`${id}-g${i}`} gradientUnits="userSpaceOnUse"
            x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}>
            <stop offset="0" stopColor="#3ccbc8" /><stop offset="1" stopColor="#1f74a4" />
          </linearGradient>
        ))}
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="1050" height="640" fill="#ffffff" />

        <CyberMagazineExportDecor theme={e.theme} />
        <g fill="#c7e7f2">
          {connectedBlobs.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g fill="#c7e7f2">
          {blobDots.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
        </g>

        <g transform="translate(66 62) scale(.1667)">
          {dumbbells.map(({ a, b }, i) => (
            <g key={i}>
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={`url(#${id}-g${i})`} strokeWidth="46" />
              <circle cx={a[0]} cy={a[1]} r="55" fill="#3ccbc8" />
              <circle cx={b[0]} cy={b[1]} r="55" fill="#1f74a4" />
            </g>
          ))}
          <polygon fill="#3ccbc8" transform="translate(397 85)"
            points="0,-70 14,-30 52,-48 36,-10 70,8 30,22 30,60 0,34 -30,60 -30,22 -70,8 -36,-10 -52,-48 -14,-30" />
        </g>
        <text x="158" y="141" fill={INK} fontSize="68" fontWeight="600" letterSpacing="3">QTM</text>

        <g transform="translate(0 -32)">
          <CardName name={e.fullName} color={INK} />
          <text x="73" y="334" fill={INK} fontSize="20" fontWeight="400" fontStyle="italic">{capitalizeFirstLetter(e.position)}</text>
        </g>

        {company.map((line, i) => <text key={i} x="73" y={354 + i * 30} fill={INK} fontSize="23" fontWeight="700">{line}</text>)}
        {contactRows.map(({ Icon, label, lines }, index) => {
          const y = cursor;
          cursor += lines.length * lineHeight + rowGap;
          return <g key={index}>
            {Icon && <Icon x="38" y={y - iconSize * .8} width={iconSize} height={iconSize} color={INK} />}
            <text x="76" y={y} fill={INK} fontSize={contactFontSize} fontWeight="600">{label}</text>
            <text x="228" y={y} fill={INK} fontSize={contactFontSize}>:</text>
            {lines.map((line, i) => <text key={i} x="244" y={y + i * lineHeight} fill={INK} fontSize={contactFontSize} fontWeight="600">{line}</text>)}
          </g>;
        })}
        <rect x="860" y="54" width="124" height="124" rx="8" fill="#ffffff" />
        <QRCodeSVG x="868" y="62" value={url} size={108} level="M" marginSize={0} bgColor="#ffffff" fgColor="#17566d" />
        <rect x="1" y="1" width="1048" height="638" rx="8" fill="none" stroke="#c4c8cc" strokeWidth="2" />
      </g>
    </svg>
  );
}
