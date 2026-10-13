"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClass, cn } from "@/components/ui";
import { profile } from "@/content/profile";

export default function ContactApp() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Clipboard can be blocked (http, old browsers). The address is still visible to copy by hand.
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-col gap-3.5 p-6">
      <p className="font-pixel text-xl">Let&apos;s build something.</p>
      <p className="leading-relaxed">
        Open to {profile.status.lookingFor}s. Available {profile.status.available}.
      </p>
      <div className="flex items-center gap-2.5 border-2 border-ink py-2 pr-2 pl-3.5">
        <a href={`mailto:${profile.email}`} className="min-w-0 flex-1 truncate underline-offset-4 hover:underline">
          {profile.email}
        </a>
        <button type="button" onClick={copy} className={cn(buttonClass.dark, "min-h-9 px-3")} aria-live="polite">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <a className={buttonClass.light} href={profile.links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className={buttonClass.light} href={profile.links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
    </div>
  );
}
