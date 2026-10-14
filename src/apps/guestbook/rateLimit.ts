export const COOLDOWN_SECONDS = 60;
export const DAILY_LIMIT = 5;
const DAY_SECONDS = 86_400;

/**
 * Decides if a visitor may post, given the times (ISO strings) of their earlier posts.
 * Pure on purpose: the Server Action fetches the rows, this only does the thinking.
 */
export function checkRateLimit(previous: string[], now: number = Date.now()): { ok: true } | { ok: false; error: string } {
  const ages = previous.map((t) => (now - new Date(t).getTime()) / 1000);

  if (ages.some((age) => age < COOLDOWN_SECONDS)) {
    return { ok: false, error: "Slow down, try again in a minute." };
  }
  if (ages.filter((age) => age < DAY_SECONDS).length >= DAILY_LIMIT) {
    return { ok: false, error: "Daily limit reached. Come back tomorrow!" };
  }
  return { ok: true };
}
