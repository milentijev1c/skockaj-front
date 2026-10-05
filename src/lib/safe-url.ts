/** Only allow http(s) URLs from scraped/store data in href attributes. */
export function safeHref(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
  } catch {
    /* not absolute */
  }
  return undefined;
}
