"use client";

import Image from "next/image";
import { useState } from "react";
import { FolderIcon } from "@/components/icons";
import { PhotoViewer } from "@/components/PhotoViewer";
import { buttonClass, Chip, cn } from "@/components/ui";
import { projects } from "@/content/projects";

export default function ProjectsApp() {
  const [slug, setSlug] = useState(projects[0]?.slug);
  /** Index of the screenshot open in the full-size viewer, or null. */
  const [viewing, setViewing] = useState<number | null>(null);
  const project = projects.find((p) => p.slug === slug) ?? projects[0];
  if (!project) return <p className="p-6">No projects yet.</p>;

  const images = project.images ?? [];
  const viewed = viewing === null ? undefined : images[viewing];

  return (
    <div className="flex flex-wrap">
      {viewed && <PhotoViewer src={viewed.src} alt={viewed.alt} onClose={() => setViewing(null)} />}

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

      <article className="flex min-w-0 flex-[999_1_320px] flex-col gap-6 p-6">
        {/* Title and kind belong together, so they sit close. */}
        <header className="flex flex-col gap-1.5">
          <h3 className="font-pixel text-2xl leading-tight">{project.name}</h3>
          <p className="text-xs font-bold tracking-wide text-violet uppercase">{project.kind}</p>
        </header>

        {/* Keep lines readable: the window is wide, the text is not. */}
        <div className="flex max-w-[64ch] flex-col gap-3 leading-relaxed">
          <p>{project.summary}</p>
          {project.role && (
            <p>
              <b>My part:</b> {project.role}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
          {(project.liveUrl || project.repoUrl) && (
            <div className="flex flex-wrap gap-2.5">
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
        </div>

        {images.length > 0 ? (
          <ul aria-label="Screenshots" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((image, index) => (
              <li key={image.caption} className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewing(index)}
                  aria-label={`View ${image.caption} full size`}
                  className="group cursor-zoom-in border-2 border-ink bg-white shadow-btn transition-[translate,box-shadow] duration-100 hover:-translate-x-px hover:-translate-y-px hover:shadow-btn-hover"
                >
                  {/* Portrait card: the screenshot is cropped to its middle, the full image opens on click. */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    sizes="200px"
                    quality={80}
                    className="block aspect-2/3 w-full object-cover object-top"
                  />
                </button>
                <span className="truncate text-xs opacity-70">{image.caption}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs opacity-60">No screenshots for this project.</p>
        )}
      </article>
    </div>
  );
}
