/** Entries this browser wrote: entry id → delete token. Lives in localStorage. */
export type Mine = Record<string, string>;

const KEY = "hillos:guestbook:mine";

export function parseMine(raw: string | null): Mine {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
    const mine: Mine = {};
    for (const [id, token] of Object.entries(value)) {
      if (typeof token === "string") mine[id] = token;
    }
    return mine;
  } catch {
    return {};
  }
}

// localStorage can be blocked (private mode, site data cleared). The guestbook still works without it.
export function loadMine(): Mine {
  try {
    return parseMine(window.localStorage.getItem(KEY));
  } catch {
    return {};
  }
}

export function saveMine(mine: Mine): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(mine));
  } catch {
    // ignore
  }
}
