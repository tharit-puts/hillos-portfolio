"use client";

import { useEffect, useState } from "react";
import { projects } from "@/content/projects";

const STORAGE_KEY = "hillos:booted";

const LINES = [
  "HillOS v26.10",
  "checking coffee levels .......... ok",
  `mounting /projects .............. ${projects.length} found`,
  "loading personality ............. done",
  "welcome, visitor.",
];

/**
 * Shows a short boot sequence once per browser session, then fades out by itself (pure CSS).
 * `always` skips the once-per-session check (used when powering back on after a shutdown).
 */
export function BootScreen({ always = false }: { always?: boolean }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (always) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) setShow(false);
      else sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // storage blocked (private mode etc.) — just show the boot every time
    }
  }, [always]);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200] flex animate-boot-out items-center justify-center bg-term p-6 text-term-text"
    >
      <div className="flex w-full max-w-md flex-col gap-1.5 text-sm">
        {LINES.map((line, i) => (
          <p
            key={line}
            className="animate-line-in"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            {i === 0 ? <span className="font-pixel text-lg text-sun">{line}</span> : line}
          </p>
        ))}
      </div>
    </div>
  );
}
