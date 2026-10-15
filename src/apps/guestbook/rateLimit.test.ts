import { describe, expect, it } from "vitest";
import { checkRateLimit, DAILY_LIMIT } from "./rateLimit";

const NOW = Date.parse("2026-10-14T12:00:00Z");
const ago = (seconds: number) => new Date(NOW - seconds * 1000).toISOString();

describe("checkRateLimit", () => {
  it("allows a first post", () => {
    expect(checkRateLimit([], NOW).ok).toBe(true);
  });

  it("blocks a post within the cooldown", () => {
    expect(checkRateLimit([ago(10)], NOW).ok).toBe(false);
  });

  it("allows a post once the cooldown has passed", () => {
    expect(checkRateLimit([ago(120)], NOW).ok).toBe(true);
  });

  it("blocks once the daily limit is reached", () => {
    const posts = Array.from({ length: DAILY_LIMIT }, (_, i) => ago(300 + i * 600));
    expect(checkRateLimit(posts, NOW).ok).toBe(false);
  });

  it("ignores posts older than a day", () => {
    const posts = Array.from({ length: DAILY_LIMIT }, () => ago(90_000));
    expect(checkRateLimit(posts, NOW).ok).toBe(true);
  });
});
