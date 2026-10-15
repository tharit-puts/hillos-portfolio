"use client";

import type { CSSProperties } from "react";
import { skillGroupLabels, skills, type SkillGroup } from "@/content/skills";

const groups = Object.keys(skills) as SkillGroup[];

export default function SkillsApp() {
  return (
    <div className="flex flex-col gap-5 p-6">
      {groups.map((group) => (
        <section key={group} aria-labelledby={`skills-${group}`} className="flex flex-col gap-2.5">
          <h3 id={`skills-${group}`} className="font-pixel text-sm uppercase">
            {skillGroupLabels[group]}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {skills[group].map((skill) => (
              <li
                key={skill.name}
                // One CSS variable per tag: Tailwind can't generate a class for a colour only known at runtime.
                style={{ "--brand": skill.color } as CSSProperties}
                className="border-2 border-(--brand) bg-white px-3 py-1.5 text-sm font-bold text-(--brand) transition-colors duration-150 hover:bg-(--brand) hover:text-white"
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
