import type { AppId } from "@/os/types";
import { cn } from "./ui";

/** Desktop icons, drawn as inline SVG so they stay crisp and need no image files. */
export function AppIcon({ id }: { id: AppId }) {
  const common = { "aria-hidden": true, strokeWidth: 2.5, stroke: "currentColor" } as const;
  switch (id) {
    case "about":
      return (
        <svg width="44" height="52" viewBox="0 0 44 52" {...common}>
          <path d="M3 3h26l12 12v34H3z" fill="#fff" />
          <path d="M29 3v12h12" fill="var(--color-sun)" />
          <path d="M10 24h22M10 31h22M10 38h14" />
        </svg>
      );
    case "projects":
      return (
        <svg width="52" height="44" viewBox="0 0 52 44" {...common}>
          <path d="M3 7h17l5 5h24v29H3z" fill="var(--color-sun)" />
          <path d="M3 16h46" />
        </svg>
      );
    case "terminal":
      return (
        <svg width="52" height="44" viewBox="0 0 52 44" {...common}>
          <rect x="3" y="3" width="46" height="38" fill="var(--color-ink)" />
          <path d="M11 15l7 6-7 6" stroke="var(--color-mint)" strokeWidth="3" fill="none" />
          <path d="M23 29h12" stroke="var(--color-mint)" strokeWidth="3" />
        </svg>
      );
    case "resume":
      return (
        <svg width="44" height="52" viewBox="0 0 44 52" {...common}>
          <path d="M3 3h26l12 12v34H3z" fill="#fff" />
          <rect x="8" y="32" width="28" height="12" fill="var(--color-coral)" strokeWidth="2" />
          <path d="M10 14h12M10 21h20" />
        </svg>
      );
    case "contact":
      return (
        <svg width="52" height="44" viewBox="0 0 52 44" {...common}>
          <rect x="3" y="7" width="46" height="32" fill="var(--color-sky)" />
          <path d="M3 9l23 17L49 9" fill="none" />
        </svg>
      );
    case "skills":
      return (
        <svg width="52" height="44" viewBox="0 0 52 44" {...common}>
          <rect x="3" y="3" width="46" height="38" fill="#fff" />
          <rect x="9" y="9" width="15" height="11" fill="var(--color-sun)" strokeWidth="2" />
          <rect x="28" y="9" width="15" height="11" fill="var(--color-sky)" strokeWidth="2" />
          <rect x="9" y="24" width="15" height="11" fill="var(--color-coral)" strokeWidth="2" />
          <rect x="28" y="24" width="15" height="11" fill="var(--color-mint)" strokeWidth="2" />
        </svg>
      );
    case "guestbook":
      return (
        <svg width="44" height="52" viewBox="0 0 44 52" {...common}>
          <path d="M5 3h34v46H5z" fill="var(--color-mint)" />
          <path d="M12 3v46M19 16h14M19 24h14M19 32h9" />
        </svg>
      );
    case "trash":
      return (
        <svg width="40" height="50" viewBox="0 0 40 50" {...common}>
          <path d="M5 12h30l-3 35H8z" fill="#fff" />
          <path d="M2 8h36M14 8V3h12v5M15 19v20M25 19v20" fill="none" />
        </svg>
      );
  }
}

export function CloseIcon() {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 12 12">
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

export function MinimizeIcon() {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 12 12">
      <path d="M1 10h10" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

export function LogoIcon({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="7.5" fill="#fff" stroke="currentColor" strokeWidth="2" />
      <path d="M9 1.5a7.5 7.5 0 0 1 0 15z" fill="currentColor" />
    </svg>
  );
}

export function PowerIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8 1.5v6" />
      <path d="M4.2 4a5.5 5.5 0 1 0 7.6 0" />
    </svg>
  );
}

/** Same as shadcn/ui's <Spinner /> (lucide "loader-circle" + animate-spin). Size it with size-* classes. */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function CupIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2 5h9v5a4 4 0 0 1-4 4h-1a4 4 0 0 1-4-4z" />
      <path d="M11 6h1.5a2 2 0 0 1 0 4H11" />
      <path d="M5 1.5v1.5M8 1.5v1.5" />
    </svg>
  );
}

export function FolderIcon() {
  return (
    <svg aria-hidden width="22" height="18" viewBox="0 0 22 18">
      <path d="M1 2h7l2 2h11v13H1z" fill="var(--color-sun)" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
