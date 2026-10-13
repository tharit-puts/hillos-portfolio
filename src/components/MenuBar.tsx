"use client";

import { useOS } from "@/os/OSProvider";
import type { AppId } from "@/os/types";
import { useClock } from "@/os/useClock";
import { CupIcon, LogoIcon } from "./icons";
import { cn } from "./ui";

const MENU: Array<{ id: AppId; label: string; highlight?: boolean }> = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "terminal", label: "Terminal" },
  { id: "contact", label: "Hire me", highlight: true },
];

export function MenuBar() {
  const { open, state, refill } = useOS();
  const clock = useClock();
  const low = state.coffee < 25;

  return (
    <header className="relative z-[100] flex min-h-11 items-center justify-between gap-x-3 border-b-2 border-ink bg-white px-3 py-0.5 md:flex-wrap">
      <nav aria-label="Main" className="flex flex-wrap items-center">
        <span className="flex items-center gap-2 pr-3 font-pixel text-base font-bold">
          <LogoIcon />
          HillOS
        </span>
        {MENU.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => open(m.id)}
            className={cn(
              "min-h-9 cursor-pointer px-2.5 hover:bg-ink hover:text-white",
              // phones keep one row: desktop icons already cover these
              m.highlight ? "font-bold text-violet" : "max-md:hidden",
            )}
          >
            {m.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3 text-[13px]">
        <button
          type="button"
          onClick={refill}
          aria-label={`Coffee level ${state.coffee}%. Click to refill.`}
          title="Every window you open costs a sip. Click to refill."
          className="flex min-h-8 cursor-pointer items-center gap-1.5 border-[1.5px] border-ink px-2 hover:bg-sun"
        >
          <CupIcon />
          <span className="relative inline-block h-2.5 w-12 border-[1.5px] border-ink">
            <span
              className={cn("absolute inset-y-0 left-0 transition-[width] duration-500", low ? "bg-coral" : "bg-mint")}
              style={{ width: `${state.coffee}%` }}
            />
          </span>
          <span className="w-12 text-left">{low ? "refill?" : `${state.coffee}%`}</span>
        </button>
        <span aria-label="Local time" className="min-w-[72px] text-right tabular-nums max-md:hidden">
          {clock ?? " "}
        </span>
      </div>
    </header>
  );
}
