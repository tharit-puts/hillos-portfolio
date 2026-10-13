"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui";
import { profile } from "@/content/profile";

/** The progress bar is just for fun — the real download starts immediately. */
export default function ResumeApp() {
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(timer.current), []);

  function startFakeProgress() {
    window.clearInterval(timer.current);
    setProgress(0);
    timer.current = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 9);
        if (next === 100) window.clearInterval(timer.current);
        return next;
      });
    }, 60);
  }

  const label = progress === 0 ? "Ready." : progress < 100 ? `Downloading… ${progress}%` : "Saved to your downloads.";

  return (
    <div className="flex flex-col gap-3.5 p-6">
      <div aria-hidden className="flex flex-col gap-2 border-2 border-ink bg-neutral-50 p-4">
        <p className="font-bold uppercase">{profile.name}</p>
        <p className="text-xs text-violet">{profile.role}</p>
        <div className="h-2 w-[90%] bg-neutral-300" />
        <div className="h-2 w-[70%] bg-neutral-300" />
        <div className="h-2 w-[82%] bg-neutral-300" />
      </div>
      <div className="relative h-4 border-2 border-ink bg-white" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Download progress">
        <div className="absolute inset-y-0 left-0 bg-violet transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-[13px]" aria-live="polite">{label}</p>
      <a className={buttonClass.dark} href={profile.resumeUrl} download onClick={startFakeProgress}>
        Download resume.pdf
      </a>
    </div>
  );
}
