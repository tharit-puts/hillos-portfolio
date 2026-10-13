"use client";

import { useCallback, type PointerEvent as ReactPointerEvent } from "react";
import type { Point } from "./types";

const MOBILE_QUERY = "(max-width: 767px)";

/**
 * Pointer-based dragging for a window's title bar.
 * Works for mouse, pen and touch; disabled on phones, where windows are full-screen sheets.
 */
export function useDrag(position: Point, onMove: (p: Point) => void, onStart?: () => void) {
  return useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button, a, input")) return;
      if (window.matchMedia(MOBILE_QUERY).matches) return;

      onStart?.();
      const handle = e.currentTarget;
      const desktop = handle.closest<HTMLElement>("[data-desktop]");
      const bounds = desktop?.getBoundingClientRect();
      const start = { x: e.clientX, y: e.clientY };
      const origin = position;
      handle.setPointerCapture(e.pointerId);

      const move = (ev: PointerEvent) => {
        let x = origin.x + ev.clientX - start.x;
        let y = origin.y + ev.clientY - start.y;
        if (bounds) {
          // keep at least part of the title bar reachable
          x = clamp(x, -200, bounds.width - 120);
          y = clamp(y, 0, bounds.height - 48);
        }
        onMove({ x: Math.round(x), y: Math.round(y) });
      };
      const stop = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", stop);
        handle.removeEventListener("pointercancel", stop);
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", stop);
      handle.addEventListener("pointercancel", stop);
    },
    [position, onMove, onStart],
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
