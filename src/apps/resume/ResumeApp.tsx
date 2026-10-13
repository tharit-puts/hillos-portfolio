"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import resumeImage from "@/assets/Tharit_Putsorn_Resume.png";
import { buttonClass } from "@/components/ui";
import { profile } from "@/content/profile";

/** The resume is shown at this fraction of the image's real size (0.5 = 50%). */
const RESUME_ZOOM = 0.5;

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
      {/* Scroll with the mouse wheel; on narrow screens it also pans sideways. */}
      <div
        tabIndex={0}
        role="region"
        aria-label={`${profile.name} — resume`}
        className="h-[60dvh] overflow-auto border-2 border-ink bg-white md:h-120"
      >
        <Image
          src={resumeImage}
          alt={`${profile.name} resume`}
          width={Math.round(resumeImage.width * RESUME_ZOOM)}
          quality={90}
          className="h-auto max-w-none"
        />
      </div>
      <div className="relative h-4 border-2 border-ink bg-white" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Download progress">
        <div className="absolute inset-y-0 left-0 bg-violet transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-[13px]" aria-live="polite">{label}</p>
      <div className="flex flex-wrap gap-2.5">
        <a className={buttonClass.dark} href={profile.resumeUrl} download onClick={startFakeProgress}>
          Download resume.pdf
        </a>
        <a className={buttonClass.light} href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </a>
      </div>
    </div>
  );
}
