const RESERVED_SUBDOMAINS = new Set(["www"]);

/** Removes ports, casing differences, and trailing dots from a Host header. */
export function normalizeHostname(host: string): string {
  return host.trim().toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
}

/** Resolves a single subdomain label relative to the configured root domain. */
export function resolveSiteSlug(
  host: string,
  rootDomain = "localhost",
): string | null {
  const hostname = normalizeHostname(host);
  const normalizedRoot = normalizeHostname(rootDomain);

  if (
    hostname === normalizedRoot ||
    hostname === `www.${normalizedRoot}` ||
    !hostname.endsWith(`.${normalizedRoot}`)
  ) {
    return null;
  }

  const prefix = hostname.slice(0, -(normalizedRoot.length + 1));
  if (!prefix || prefix.includes(".") || RESERVED_SUBDOMAINS.has(prefix)) {
    return null;
  }

  return prefix;
}

/** Maps a site subdomain request to the matching internal path fallback. */
export function sitePathname(slug: string, pathname: string): string {
  const suffix = pathname === "/" ? "" : pathname;
  return `/sites/${slug}${suffix}`;
}
