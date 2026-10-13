export const skills = {
  frontend: ["React", "Next.js", "Vue", "TypeScript", "Tailwind"],
  backend: ["Node", "Express", "Java", "PostgreSQL", "Prisma"],
  tools: ["Git", "Supabase", "Stripe", "Cursor", "Claude"],
} as const;

export type SkillGroup = keyof typeof skills;
