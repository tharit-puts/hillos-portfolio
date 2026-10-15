import type { ComponentType } from "react";
import type { AppId } from "@/os/types";
import AboutApp from "./about/AboutApp";
import ContactApp from "./contact/ContactApp";
import GuestbookApp from "./guestbook/GuestbookApp";
import ProjectsApp from "./projects/ProjectsApp";
import ResumeApp from "./resume/ResumeApp";
import SkillsApp from "./skills/SkillsApp";
import TerminalApp from "./terminal/TerminalApp";
import TrashApp from "./trash/TrashApp";

/**
 * Which component renders inside each window.
 * Adding an app = add its id to AppId (os/types.ts), an entry in manifest.ts, an icon in
 * components/icons.tsx, and a line here. TypeScript will point at anything you forget.
 */
export const registry: Record<AppId, ComponentType> = {
  about: AboutApp,
  projects: ProjectsApp,
  terminal: TerminalApp,
  resume: ResumeApp,
  contact: ContactApp,
  skills: SkillsApp,
  guestbook: GuestbookApp,
  trash: TrashApp,
};
