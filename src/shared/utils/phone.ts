/** Keep the number suitable for tel links and storage; spacing is presentation only. */
export function normalizePhone(value: string) {
  return value.replace(/[\s().-]/g, "");
}

/** Vietnamese mobile: 0917 895 579; international: +84 917 895 579. */
export function formatPhone(value: string) {
  const phone = normalizePhone(value);
  if (!/^\+?\d*$/.test(phone)) return value;
  if (phone.startsWith("+84")) {
    const national = phone.slice(3);
    return ["+84", national.slice(0, 3), national.slice(3, 6), national.slice(6)].filter(Boolean).join(" ");
  }
  if (phone.startsWith("+")) return phone.replace(/(\d{3})(?=\d)/g, "$1 ");
  return [phone.slice(0, 4), phone.slice(4, 7), phone.slice(7)].filter(Boolean).join(" ");
}
