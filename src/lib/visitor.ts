/** Anonymous visitor id for unique build views (localStorage). */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let vid = localStorage.getItem("vid");
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem("vid", vid);
    }
    return vid;
  } catch {
    return "";
  }
}
