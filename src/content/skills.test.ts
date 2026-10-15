import { describe, expect, it } from "vitest";
import { skillGroupLabels, skills, type Skill, type SkillGroup } from "./skills";

/** WCAG relative luminance of a #rrggbb colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between white text and the given background. */
function contrastWithWhite(hex: string): number {
  return 1.05 / (luminance(hex) + 0.05);
}

const groups = Object.keys(skills) as SkillGroup[];
const all: Skill[] = groups.flatMap((g) => [...skills[g]]);

describe("skills", () => {
  it("has the three groups with a label each", () => {
    expect(groups).toEqual(["frontend", "backend", "tools"]);
    expect(skillGroupLabels.tools).toBe("Tools & Other");
  });

  it("lists every technology once", () => {
    expect(skills.frontend.map((s) => s.name)).toEqual([
      "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Tailwind CSS",
    ]);
    expect(skills.backend.map((s) => s.name)).toEqual([
      "Node.js", "Express.js", "Java", "Spring Boot", "PostgreSQL", "MongoDB", "Supabase", "Prisma",
    ]);
    expect(skills.tools.map((s) => s.name)).toEqual([
      "Git", "GitHub", "Stripe", "Clerk", "JWT", "Gemini API", "Cursor", "Claude",
    ]);
    const names = all.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("gives every skill a #rrggbb brand colour", () => {
    for (const skill of all) expect(skill.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("keeps white hover text readable on every brand colour (WCAG AA, 4.5:1)", () => {
    for (const skill of all) {
      expect(contrastWithWhite(skill.color), `${skill.name} ${skill.color}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
