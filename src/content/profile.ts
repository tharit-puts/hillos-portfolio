/**
 * Everything personal lives here. Edit this file (and projects.ts / skills.ts)
 * to change what HillOS shows — no component code needs to change.
 */
export const profile = {
  name: "Tharit Putsorn",
  nickname: "Hill",
  role: "Full-Stack Developer",
  location: "Bangkok, Thailand",

  email: "tharit.puts@gmail.com",
  links: {
    github: "https://github.com/tharit-puts",
    linkedin: "https://www.linkedin.com/in/tharit-puts",
  },
  /** PDF served from /public (the on-screen preview is src/assets/Tharit_Putsorn_Resume.png). */
  resumeUrl: "/Tharit_Putsorn_Resume.pdf",

  about: [
    "Games & Interactive Media grad (First Class Honors, Bangkok University) who spent almost three years in IT sales fixing 100+ customer tech problems a month. Now I fix them in code.",
    "Just finished TechUp's Full-Stack bootcamp. I build with Next.js, TypeScript and Postgres, and I pair with Cursor and Claude for debugging and tests.",
  ],

  status: {
    bootcamp: "TechUp Full-Stack  [done, Oct 2026]",
    lookingFor: "junior full-stack developer role",
    available: "now",
  },

  /** The flashing bell in the menu bar. */
  notification: {
    title: "Hiring?",
    message: "Interested in hiring for a Full Stack Developer position? Get in touch.",
  },

  todo: [
    { done: true, text: "TechUp Full-Stack bootcamp" },
    { done: true, text: "Neatly Hotel @ Demo Day" },
    { done: false, text: "junior full-stack developer role" },
    { done: false, text: "interview with you", strong: true },
  ],
} as const;

export type Profile = typeof profile;

/** Opens a Gmail compose window addressed to me, instead of the computer's default mail app (mailto:). */
export const emailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`;
