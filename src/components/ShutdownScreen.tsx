"use client";

import { LogoIcon, Spinner } from "./icons";

export type PowerState = "on" | "shutting-down" | "off";

/** How long the "Shutting down…" screen stays before the screen goes dark. */
export const SHUTDOWN_MS = 2500;

/** Full-screen overlay for the shutdown sequence. Renders nothing while the OS is on. */
export function ShutdownScreen({
  power,
  onPowerOn,
}: {
  power: PowerState;
  onPowerOn: () => void;
}) {
  if (power === "on") return null;

  if (power === "shutting-down") {
    return (
      <div className="fixed inset-0 z-300 flex flex-col items-center justify-center gap-5 bg-term p-6 text-center text-term-text">
        <Spinner className="size-8 text-sun" />
        <div className="flex flex-col gap-1.5" aria-live="polite">
          <p className="font-pixel text-lg">Shutting down…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-300 grid place-items-center bg-black">
      <button
        type="button"
        aria-label="Power on HillOS"
        title="Power on"
        onClick={onPowerOn}
        className="cursor-pointer p-4 text-sun opacity-80 transition-opacity hover:opacity-100"
      >
        <LogoIcon size={64} />
      </button>
    </div>
  );
}
