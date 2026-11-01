/** Keep the number suitable for dialing and vCard export; preserve the original for display and storage. */
export function normalizePhone(value: string) {
  return value.replace(/[\s().-]/g, "");
}

/** Preserve the user's phone formatting for display. */
export function formatPhone(value: string) {
  return value;
}
