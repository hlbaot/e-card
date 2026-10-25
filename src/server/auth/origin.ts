const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function isAllowedAuthOrigin(
  origin: string | null,
  requestUrl: string,
  configuredUrl: string,
  environment: string,
  fetchSite: string | null,
) {
  if (!origin || fetchSite === "cross-site") return false;
  try {
    const source = new URL(origin);
    if (source.origin !== origin) return false;
    if (origin === new URL(configuredUrl).origin) return true;

    // Next dev can pick a different port when the configured port is occupied.
    const target = new URL(requestUrl);
    return environment === "development"
      && loopbackHosts.has(source.hostname)
      && loopbackHosts.has(target.hostname)
      && (target.protocol === "http:" || target.protocol === "https:")
      && origin === target.origin;
  } catch {
    return false;
  }
}
