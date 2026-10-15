import type { StaticImageData } from "next/image";
import blogAdmin from "@/assets/blog-post/admin-panel-blog-post.png";
import blogArticle from "@/assets/blog-post/-blog-post-blog-post.png";
import blogLanding from "@/assets/blog-post/landing-page-blog-post.png";
import blogLogin from "@/assets/blog-post/login-blog-post.png";
import cfAdmin from "@/assets/course-flow/admin-panel-control-cf.png";
import cfLanding from "@/assets/course-flow/landing-page-cf.png";
import cfLogin from "@/assets/course-flow/login-cf.png";
import cfMyCourses from "@/assets/course-flow/my-courses-cf.png";
import neatlyAnalytics from "@/assets/neatly/analytics-dashboard-neatly.png";
import neatlyLanding from "@/assets/neatly/landing-page-neatly.png";
import neatlyPayment from "@/assets/neatly/payment-neatly.png";
import neatlySearch from "@/assets/neatly/searching-neatly.png";

export interface ProjectImage {
  src: StaticImageData;
  /** Short label shown under the thumbnail. */
  caption: string;
  /** What the screenshot shows, for screen readers. */
  alt: string;
}

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
  /** Screenshots shown in a row under the details. Click one to see it full size. */
  images?: ProjectImage[];
}

// liveUrl / repoUrl / images are optional: the matching button or gallery appears automatically when set.
export const projects: Project[] = [
  {
    slug: "neatly-hotel",
    name: "Neatly Hotel",
    kind: "Team project · Demo Day 2026",
    summary:
      "Hotel booking platform with a chat widget, an admin dashboard and an AI chatbot.",
    role: "Room search, filters and booking history.",
    stack: ["Next.js", "TypeScript", "Supabase", "Prisma", "Stripe", "Gemini"],
    liveUrl: "https://neatly-hotel-sigma.vercel.app/",
    repoUrl: "https://github.com/beamMiter/Neatly-Hotel",
    images: [
      { src: neatlyLanding, caption: "Landing page", alt: "Neatly Hotel landing page with the room search bar" },
      { src: neatlySearch, caption: "Room search", alt: "Neatly Hotel room search page" },
      { src: neatlyPayment, caption: "Payment", alt: "Neatly Hotel payment page" },
      { src: neatlyAnalytics, caption: "Analytics dashboard", alt: "Neatly Hotel admin analytics dashboard" },
    ],
  },
  {
    slug: "course-flow",
    name: "Course Flow",
    kind: "Team project · Schooler",
    summary: "Online class management platform for admins and students.",
    role: "Java backend for assignment edit/delete, promo-code CRUD and a drag-and-drop fix.",
    stack: ["Vue", "Java", "Clerk"],
    liveUrl: "https://course-flow-project.vercel.app/",
    repoUrl: "https://github.com/vutthipatrchi/CourseFlow-Project",
    images: [
      { src: cfLanding, caption: "Landing page", alt: "Course Flow landing page" },
      { src: cfLogin, caption: "Login", alt: "Course Flow login page" },
      { src: cfMyCourses, caption: "My courses", alt: "Course Flow student page listing enrolled courses and progress" },
      { src: cfAdmin, caption: "Admin panel", alt: "Course Flow admin panel" },
    ],
  },
  {
    slug: "blog-post",
    name: "Blog Post",
    kind: "Web app",
    summary: "A blog app, later connected to Supabase for real data.",
    stack: ["React", "Tailwind CSS", "JavaScript", "Supabase"],
    liveUrl: "https://tharit-puts-project.vercel.app/",
    repoUrl: "https://github.com/tharit-puts/tharit-puts-project",
    images: [
      { src: blogLanding, caption: "Landing page", alt: "Blog Post landing page" },
      { src: blogLogin, caption: "Login", alt: "Blog Post login page" },
      { src: blogArticle, caption: "Create article", alt: "Blog Post form for creating a new article" },
      { src: blogAdmin, caption: "Admin panel", alt: "Blog Post admin panel" },
    ],
  },
  {
    slug: "askhub-api",
    name: "AskHub API",
    kind: "Backend",
    summary: "A Q&A backend with REST endpoints.",
    stack: ["Express", "PostgreSQL"],
  },
];
