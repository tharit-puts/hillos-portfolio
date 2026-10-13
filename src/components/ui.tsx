import type { ReactNode } from "react";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 border-2 border-ink px-4 font-bold shadow-btn " +
  "transition-[translate,box-shadow] duration-100 cursor-pointer " +
  "hover:-translate-x-px hover:-translate-y-px hover:shadow-btn-hover " +
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

export const buttonClass = {
  dark: cn(buttonBase, "bg-ink text-white"),
  light: cn(buttonBase, "bg-white text-ink"),
};

export function Chip({ children }: { children: ReactNode }) {
  return <span className="inline-block border-[1.5px] border-ink bg-white px-2 py-0.5 text-xs">{children}</span>;
}
