"use client";

import { appIds, manifest } from "@/apps/manifest";
import { useOS } from "@/os/OSProvider";
import { AppIcon } from "./icons";

export function DesktopIcons() {
  const { open } = useOS();
  const icons = appIds.filter((id) => manifest[id].onDesktop);

  return (
    <nav
      aria-label="Desktop"
      // md+: one column down the left edge; when the desktop is too short for every icon the column wraps into a second one.
      className="grid grid-cols-3 gap-2 p-4 sm:grid-cols-6 md:absolute md:top-5 md:bottom-5 md:left-10 md:z-1 md:flex md:flex-col md:flex-wrap md:content-start md:gap-x-3 md:gap-y-4 md:p-0"
    >
      {icons.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => open(id)}
          className="group flex w-full cursor-pointer flex-col items-center gap-1.5 px-1 py-2 text-ink md:w-24"
        >
          <span className="transition-transform group-hover:animate-wiggle">
            <AppIcon id={id} />
          </span>
          <span className="border-[1.5px] border-ink bg-white px-1.5 py-0.5 text-xs group-hover:bg-ink group-hover:text-white group-focus-visible:bg-ink group-focus-visible:text-white">
            {manifest[id].label}
          </span>
        </button>
      ))}
    </nav>
  );
}
