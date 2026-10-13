"use client";

import { useCallback, type ReactNode } from "react";
import { manifest } from "@/apps/manifest";
import { useOS } from "@/os/OSProvider";
import type { AppId, Point } from "@/os/types";
import { useDrag } from "@/os/useDrag";
import { CloseIcon, MinimizeIcon } from "./icons";
import { cn } from "./ui";

const chromeButton =
  "flex h-8 w-9 cursor-pointer items-center justify-center border-2 border-ink bg-white text-ink";

export function Window({ id, children }: { id: AppId; children: ReactNode }) {
  const { state, focused, focus, close, minimize, move } = useOS();
  const app = manifest[id];
  const index = state.windows.findIndex((w) => w.id === id);
  const win = state.windows[index];
  const position = win?.position ?? app.defaultPosition;

  const onMove = useCallback((p: Point) => move(id, p), [move, id]);
  const onStart = useCallback(() => focus(id), [focus, id]);
  const startDrag = useDrag(position, onMove, onStart);

  if (!win || win.minimized) return null;
  const isFocused = focused === id;

  return (
    <section
      role="dialog"
      aria-modal={false}
      aria-label={app.title}
      onPointerDown={() => focus(id)}
      style={{ left: position.x, top: position.y, zIndex: 10 + index }}
      className={cn(
        "absolute flex max-h-[calc(100%-16px)] max-w-[calc(100%-16px)] animate-pop flex-col border-2 border-ink bg-white",
        isFocused ? "shadow-hard" : "shadow-hard-sm",
        app.widthClass,
        // Phones: every window becomes a full-screen sheet under the menu bar.
        "max-md:fixed max-md:top-14! max-md:right-2 max-md:bottom-3 max-md:left-2! max-md:max-h-none max-md:w-auto! max-md:max-w-none",
      )}
    >
      <div
        onPointerDown={startDrag}
        className={cn(
          "flex items-center gap-2 border-b-2 border-ink py-1 pr-1.5 pl-3 select-none md:cursor-grab md:touch-none md:active:cursor-grabbing",
          app.titleBarClass,
        )}
      >
        <h2 className={cn("flex-1 truncate font-pixel text-sm", !isFocused && "opacity-60")}>{app.title}</h2>
        <button type="button" className={cn(chromeButton, "hover:bg-sun")} aria-label={`Minimize ${app.label}`} onClick={() => minimize(id)}>
          <MinimizeIcon />
        </button>
        <button type="button" className={cn(chromeButton, "hover:bg-coral")} aria-label={`Close ${app.label}`} onClick={() => close(id)}>
          <CloseIcon />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </section>
  );
}
