"use client";

import { useEffect, useId, useRef, useState } from "react";
import { emailComposeUrl, profile } from "@/content/profile";
import { BellIcon } from "./icons";
import { cn } from "./ui";

/**
 * Menu-bar bell. Flashes red/yellow until clicked (every page load, on purpose: visitors
 * should see it), then turns white and drops a box with the hiring note and email.
 */
export function Notification() {
  const [seen, setSeen] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    // Click anywhere else closes the box.
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    // Capture + stopPropagation: Esc closes the box only, not the window behind it.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  function toggle() {
    setSeen(true);
    setOpen((o) => !o);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={seen ? "Notifications" : "Notifications, 1 new"}
        title={seen ? "Notifications" : "1 new notification"}
        className={cn(
          "mx-1 flex size-8 cursor-pointer items-center justify-center border-[1.5px] border-ink",
          seen ? "bg-white hover:bg-sun" : "animate-alert bg-coral",
        )}
      >
        <BellIcon />
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={profile.notification.title}
          className="absolute top-full left-0 mt-2 flex w-80 animate-pop flex-col gap-2.5 border-2 border-ink bg-white p-4 text-sm leading-relaxed shadow-hard max-md:fixed max-md:top-14 max-md:right-2 max-md:left-2 max-md:mt-0 max-md:w-auto"
        >
          <p className="font-pixel">{profile.notification.title}</p>
          <p>{profile.notification.message}</p>
          <p>
            <b>Email:</b>{" "}
            <a href={emailComposeUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-violet">
              {profile.email}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
