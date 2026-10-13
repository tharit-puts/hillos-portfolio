import type { AppId, Point } from "@/os/types";

export interface AppManifest {
  id: AppId;
  /** Label under the desktop icon. */
  label: string;
  /** Text in the window's title bar. */
  title: string;
  /** Where the window first appears (px from the desktop's top-left). */
  defaultPosition: Point;
  /** Tailwind width class for the window on tablet/desktop. */
  widthClass: string;
  /** Tailwind background class for the title bar. */
  titleBarClass: string;
  /** Show an icon on the desktop? */
  onDesktop: boolean;
}

/**
 * Metadata only — no React components here, so the window manager can import
 * it without circular imports. Components are wired up in registry.tsx.
 */
export const manifest: Record<AppId, AppManifest> = {
  about: {
    id: "about",
    label: "About.txt",
    title: "About.txt",
    defaultPosition: { x: 600, y: 32 },
    widthClass: "w-[520px]",
    titleBarClass: "bg-sun",
    onDesktop: true,
  },
  projects: {
    id: "projects",
    label: "Projects/",
    title: "Projects/",
    defaultPosition: { x: 200, y: 150 },
    widthClass: "w-[720px]",
    titleBarClass: "bg-sky",
    onDesktop: true,
  },
  terminal: {
    id: "terminal",
    label: "Terminal",
    title: "hill@os: ~",
    defaultPosition: { x: 1200, y: 96 },
    widthClass: "w-[580px]",
    titleBarClass: "bg-white",
    onDesktop: true,
  },
  resume: {
    id: "resume",
    label: "Resume.pdf",
    title: "Resume.pdf",
    defaultPosition: { x: 180, y: 24 },
    widthClass: "w-[900px]",
    titleBarClass: "bg-coral",
    onDesktop: true,
  },
  contact: {
    id: "contact",
    label: "Contact.app",
    title: "Contact.app",
    defaultPosition: { x: 560, y: 240 },
    widthClass: "w-[460px]",
    titleBarClass: "bg-sky",
    onDesktop: true,
  },
  trash: {
    id: "trash",
    label: "Trash",
    title: "Trash",
    defaultPosition: { x:320, y: 450 },
    widthClass: "w-[380px]",
    titleBarClass: "bg-neutral-200",
    onDesktop: true,
  },
};

export const appIds = Object.keys(manifest) as AppId[];

export function isAppId(value: string): value is AppId {
  return value in manifest;
}
