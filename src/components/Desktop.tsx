"use client";

import { useEffect } from "react";
import { appIds } from "@/apps/manifest";
import { registry } from "@/apps/registry";
import { profile } from "@/content/profile";
import { OSProvider, useOS } from "@/os/OSProvider";
import { BootScreen } from "./BootScreen";
import { DesktopIcons } from "./DesktopIcons";
import { MenuBar } from "./MenuBar";
import { StickyNote } from "./StickyNote";
import { Window } from "./Window";

export default function Desktop() {
  return (
    <OSProvider>
      <DesktopScreen />
    </OSProvider>
  );
}

function DesktopScreen() {
  const { state, focused, close } = useOS();

  // On phones, start on the clean desktop instead of stacked full-screen windows.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      state.windows.forEach((w) => close(w.id));
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esc closes the focused window (but not while typing in the terminal).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !focused) return;
      if ((e.target as HTMLElement | null)?.tagName === "INPUT") return;
      close(focused);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, close]);

  return (
    <div className="flex min-h-dvh flex-col text-sm text-ink">
      <MenuBar />
      <main data-desktop className="bg-desk relative flex-1 overflow-hidden md:min-h-[720px]">
        <h1 className="sr-only">
          {profile.name} — {profile.role}
        </h1>
        <DesktopIcons />
        <StickyNote />
        {/*
          Render in a fixed order and let z-index handle stacking. Re-ordering DOM nodes on
          pointerdown (to bring a window forward) would make the browser drop the click.
        */}
        {appIds
          .filter((id) => state.windows.some((w) => w.id === id))
          .map((id) => {
            const App = registry[id];
            return (
              <Window key={id} id={id}>
                <App />
              </Window>
            );
          })}
      </main>
      <BootScreen />
    </div>
  );
}
