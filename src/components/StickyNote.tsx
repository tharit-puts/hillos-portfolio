import { profile } from "@/content/profile";
import { cn } from "./ui";

export function StickyNote() {
  return (
    <aside
      aria-label="To-do list"
      className="mx-4 mb-6 -rotate-3 border-2 border-ink bg-sun p-4 shadow-hard-sm transition-transform duration-300 hover:scale-[1.03] hover:rotate-0 md:absolute md:right-7 md:bottom-9 md:z-[2] md:m-0 md:w-[240px]"
    >
      <p className="mb-2.5 font-pixel text-sm">todo.txt</p>
      <ul className="flex flex-col gap-1.5 text-[13px] leading-snug">
        {profile.todo.map((t) => (
          <li key={t.text} className={cn("strong" in t && t.strong && "font-bold")}>
            [{t.done ? "x" : " "}] {t.text}
          </li>
        ))}
      </ul>
    </aside>
  );
}
