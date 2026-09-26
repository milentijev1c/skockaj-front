export const THEME_STORAGE_KEY = "skockaj-theme";

export type Theme = "dark" | "light";

export function resolveTheme(value: string | null | undefined): Theme {
  return value === "light" ? "light" : "dark";
}

function readStoredTheme(): Theme {
  try {
    return resolveTheme(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "dark";
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
}

function writeStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private mode / quota — theme still applies for this visit */
  }
}

/* Tiny external store so the toggle can use useSyncExternalStore (no effect setState). */
let cached: Theme | null = null;
const listeners = new Set<() => void>();

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getThemeSnapshot(): Theme {
  if (cached === null) cached = readStoredTheme();
  return cached;
}

export function getServerTheme(): Theme {
  return "dark";
}

export function setTheme(theme: Theme) {
  cached = theme;
  applyTheme(theme);
  writeStoredTheme(theme);
  listeners.forEach((listener) => listener());
}

/** Runs before paint so the first frame never flashes the wrong theme. */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t="dark";var e=document.documentElement;e.setAttribute("data-theme",t);e.style.colorScheme=t}catch(e){var r=document.documentElement;r.setAttribute("data-theme","dark");r.style.colorScheme="dark"}})();`;
