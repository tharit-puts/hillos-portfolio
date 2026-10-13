"use client";

import { useEffect, useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatClock(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${DAYS[d.getDay()]} ${hh}:${mm}`;
}

/** Returns null on the server and first client render, so hydration always matches. */
export function useClock(): string | null {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(formatClock(new Date()));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return now;
}
