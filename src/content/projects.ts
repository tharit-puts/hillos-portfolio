export interface Project {
  /** Used as the folder name in Projects/ and in the terminal (`ls projects`). */
  slug: string;
  name: string;
  kind: string;
  summary: string;
  /** What *you* built on a team project. */
  role?: string;
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
}

// TODO: add liveUrl / repoUrl for each project — buttons appear automatically.
export const projects: Project[] = [
  {
    slug: "neatly-hotel",
    name: "Neatly Hotel",
    kind: "Team project · Demo Day 2026",
    summary:
      "Hotel booking platform with a chat widget, an admin dashboard and an AI chatbot.",
    role: "Room search, filters and booking history.",
    stack: ["Next.js", "TypeScript", "Supabase", "Prisma", "Stripe", "Gemini"],
  },
  {
    slug: "schooler",
    name: "Schooler",
    kind: "Team project · Course Flow",
    summary: "Online class management platform for admins and students.",
    role: "Java backend for assignment edit/delete, promo-code CRUD and a drag-and-drop fix.",
    stack: ["Vue", "Java", "Clerk"],
  },
  {
    slug: "blog-post",
    name: "Blog Post",
    kind: "Web app",
    summary: "A blog app, later connected to Supabase for real data.",
    stack: ["React", "Tailwind CSS", "JavaScript", "Supabase"],
  },
  {
    slug: "askhub-api",
    name: "AskHub API",
    kind: "Backend",
    summary: "A Q&A backend with REST endpoints.",
    stack: ["Express", "PostgreSQL"],
  },
];
