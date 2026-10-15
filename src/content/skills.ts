export interface Skill {
  name: string;
  /**
   * The technology's brand colour, used for the border and text of its tag (and as the fill on hover).
   * Light brand colours (JavaScript yellow, React cyan, ...) are darkened just enough to keep
   * at least 4.5:1 contrast against white, so the white hover text stays readable.
   * skills.test.ts enforces that.
   */
  color: string;
}

export const skills = {
  frontend: [
    { name: "HTML", color: "#CF4823" },
    { name: "CSS", color: "#1572B6" },
    { name: "JavaScript", color: "#837610" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "React", color: "#387E92" },
    { name: "Next.js", color: "#000000" },
    { name: "Vue", color: "#378461" },
    { name: "Tailwind CSS", color: "#048197" },
  ],
  backend: [
    { name: "Node.js", color: "#2D872D" },
    { name: "Express.js", color: "#000000" },
    { name: "Java", color: "#AD6500" },
    { name: "Spring Boot", color: "#50832E" },
    { name: "PostgreSQL", color: "#336791" },
    { name: "MongoDB", color: "#3A853B" },
    { name: "Supabase", color: "#28845B" },
    { name: "Prisma", color: "#2D3748" },
  ],
  tools: [
    { name: "Git", color: "#D1462C" },
    { name: "GitHub", color: "#181717" },
    { name: "Stripe", color: "#635BFF" },
    { name: "Clerk", color: "#6C47FF" },
    { name: "JWT", color: "#BA32DE" },
    { name: "Gemini API", color: "#836CA4" },
    { name: "Cursor", color: "#000000" },
    { name: "Claude", color: "#B06046" },
  ],
} as const satisfies Record<string, readonly Skill[]>;

export type SkillGroup = keyof typeof skills;

export const skillGroupLabels = {
  frontend: "Frontend",
  backend: "Backend",
  tools: "Tools & Other",
} as const satisfies Record<SkillGroup, string>;
