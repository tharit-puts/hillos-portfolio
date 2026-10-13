"use client";

import { useState } from "react";
import { FolderIcon } from "@/components/icons";
import { buttonClass, Chip, cn } from "@/components/ui";
import { projects } from "@/content/projects";

export default function ProjectsApp() {
  const [slug, setSlug] = useState(projects[0]?.slug);
  const project = projects.find((p) => p.slug === slug) ?? projects[0];
  if (!project) return <p className="p-6">No projects yet.</p>;

  return (
    <div className="flex flex-wrap">
      <ul className="flex flex-[1_1_210px] flex-col gap-1 border-ink p-2.5 max-[560px]:border-b-2 min-[561px]:border-r-2">
        <li className="px-2 pb-1 text-xs text-neutral-600">{projects.length} items</li>
        {projects.map((p) => (
          <li key={p.slug}>
            <button
              type="button"
              aria-current={p.slug === project.slug}
              onClick={() => setSlug(p.slug)}
              className={cn(
                "flex min-h-11 w-full cursor-pointer items-center gap-2.5 border-2 p-2 text-left",
                p.slug === project.slug ? "border-ink bg-sun" : "border-transparent hover:border-ink",
              )}
            >
              <FolderIcon />
              {p.slug}/
            </button>
          </li>
        ))}
      </ul>

      <article className="flex min-w-0 flex-[999_1_320px] flex-col gap-3 p-5">
        <h3 className="font-pixel text-2xl">{project.name}</h3>
        <p className="text-xs font-bold tracking-wide text-violet uppercase">{project.kind}</p>
        <p className="leading-relaxed">{project.summary}</p>
        {project.role && (
          <p className="leading-relaxed">
            <b>My part:</b> {project.role}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-1.5 flex flex-wrap gap-2.5">
            {project.liveUrl && (
              <a className={buttonClass.dark} href={project.liveUrl} target="_blank" rel="noreferrer">
                Live demo
              </a>
            )}
            {project.repoUrl && (
              <a className={buttonClass.light} href={project.repoUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
