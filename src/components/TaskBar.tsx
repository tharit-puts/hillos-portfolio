"use client";

import { useEffect, useRef, useState } from "react";
import { appIds, manifest } from "@/apps/manifest";
import { useOS } from "@/os/OSProvider";
import { AppIcon, LogoIcon, PowerIcon } from "./icons";
import { cn } from "./ui";

const taskButton =
  "relative flex size-11 cursor-pointer items-center justify-center border-2 border-transparent hover:border-ink hover:bg-lilac";

/**
 * Windows-style taskbar: Start button in the middle, then one button per open or minimized app.
 * Apps are listed in a fixed order (not z-order) so buttons don't jump around when focus changes.
 */
export function TaskBar({ onShutdown }: { onShutdown: () => void }) {
  const { state, focused, toggleFromTaskbar } = useOS();
  const [menuOpen, setMenuOpen] = useState(false);
  const startRef = useRef<HTMLDivElement>(null);

  const running = appIds.filter((id) => state.windows.some((w) => w.id === id));

  // Close the Start menu on outside click or Esc (Esc must not also close the focused window).
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!startRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [menuOpen]);

  return (
    <footer className="sticky bottom-0 z-100 flex h-14 shrink-0 items-center justify-center gap-1 border-t-2 border-ink bg-white px-2">
      <div ref={startRef} className="relative">
        <button
          type="button"
          aria-label="Start"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className={cn(taskButton, menuOpen && "border-ink bg-sun hover:bg-sun")}
        >
          <LogoIcon size={26} />
        </button>

        {menuOpen && (
          <div
            role="menu"
            aria-label="Start"
            className="absolute bottom-full left-1/2 mb-3 w-56 -translate-x-1/2 animate-pop border-2 border-ink bg-white shadow-hard-sm"
          >
            <p className="flex items-center gap-2 border-b-2 border-ink bg-sun px-3 py-2 font-pixel text-sm">
              <LogoIcon />
              HillOS
            </p>
            <div className="p-2">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onShutdown();
                }}
                className="flex min-h-11 w-full cursor-pointer items-center gap-2.5 px-3 font-bold hover:bg-coral"
              >
                <PowerIcon />
                Shut down
              </button>
            </div>
          </div>
        )}
      </div>

      {running.map((id) => {
        const win = state.windows.find((w) => w.id === id);
        const isFocused = focused === id;
        return (
          <button
            key={id}
            type="button"
            aria-label={win?.minimized ? `${manifest[id].label} (minimized)` : manifest[id].label}
            aria-pressed={isFocused}
            title={manifest[id].label}
            onClick={() => toggleFromTaskbar(id)}
            className={cn(taskButton, isFocused && "border-ink bg-lilac")}
          >
            <span className="flex size-7 items-center justify-center [&>svg]:h-full [&>svg]:w-auto">
              <AppIcon id={id} />
            </span>
            {/* running indicator: long violet bar on the focused window, short grey dash otherwise */}
            <span
              aria-hidden
              className={cn(
                "absolute bottom-0.5 left-1/2 h-1 -translate-x-1/2 transition-[width]",
                isFocused ? "w-5 bg-violet" : "w-2 bg-neutral-400",
              )}
            />
          </button>
        );
      })}
    </footer>
  );
}
