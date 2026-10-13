/**
 * Everything personal lives here. Edit this file (and projects.ts / skills.ts)
 * to change what HillOS shows — no component code needs to change.
 */
export const profile = {
  name: "Tharit Putsorn",
  nickname: "Hill",
  role: "Full-Stack Developer",
  location: "Bangkok, Thailand",

  // TODO: replace with your real details
  email: "you@example.com",
  links: {
    github: "https://github.com/your-username",
    linkedin: "https://www.linkedin.com/in/your-profile",
  },
  /** Put your real PDF at /public/resume.pdf */
  resumeUrl: "/resume.pdf",

  about: [
    "Games & Interactive Media grad (First Class Honors, Bangkok University) who spent almost three years in IT sales fixing 100+ customer tech problems a month. Now I fix them in code.",
    "Just finished TechUp's Full-Stack bootcamp. I build with Next.js, TypeScript and Postgres, and I pair with Cursor and Claude for debugging and tests.",
  ],

  status: {
    bootcamp: "TechUp Full-Stack  [done, Oct 2026]",
    lookingFor: "full-stack internship / junior role",
    available: "now",
  },

  todo: [
    { done: true, text: "TechUp Full-Stack bootcamp" },
    { done: true, text: "Neatly Hotel @ Demo Day" },
    { done: false, text: "intern / junior role" },
    { done: false, text: "interview with you", strong: true },
  ],
} as const;

export type Profile = typeof profile;
