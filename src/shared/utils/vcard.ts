import { getPublicFields, type Employee } from "@/shared/types/employee";

const escape = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

export function websiteUrl(value: string) {
  if (!value || !value.trim()) return "";
  const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

export function createVCard(e: Employee) {
  const pf = getPublicFields(e);
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escape(e.fullName)}`,
    `N:;${escape(e.fullName)};;;`,
    `ORG:${escape(e.company)}`,
    `TITLE:${escape(e.position)}`,
  ];

  if (pf.phone && e.phone.trim()) {
    lines.push(`TEL;TYPE=CELL:${escape(e.phone)}`);
  }
  if (pf.email && e.email.trim()) {
    lines.push(`EMAIL:${escape(e.email)}`);
  }
  if (pf.website && websiteUrl(e.website)) {
    lines.push(`URL:${websiteUrl(e.website)}`);
  }
  if (pf.zalo && e.zalo.trim()) {
    lines.push(
      `X-SOCIALPROFILE;TYPE=zalo:https://zalo.me/${escape(e.zalo.replace(/[^0-9]/g, ""))}`,
    );
  }
  if (pf.offices) {
    for (const o of e.offices) {
      if (o.address.trim()) {
        lines.push(`ADR;TYPE=WORK:;;${escape(o.address)};;;;`);
      }
    }
  }

  lines.push("END:VCARD");
  return lines.join("\r\n") + "\r\n";
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function saveContact(e: Employee) {
  downloadBlob(
    new Blob([createVCard(e)], { type: "text/vcard;charset=utf-8" }),
    `${e.slug}.vcf`,
  );
}
