import { describe, expect, it } from "vitest";
import { projects } from "./projects";

describe("projects", () => {
  it("has a unique slug for each project", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses https links", () => {
    for (const p of projects) {
      for (const url of [p.liveUrl, p.repoUrl]) {
        if (url) expect(url, `${p.slug} ${url}`).toMatch(/^https:\/\//);
      }
    }
  });

  it("gives every screenshot a caption and alt text, with no repeated captions in a project", () => {
    for (const p of projects) {
      const images = p.images ?? [];
      for (const image of images) {
        expect(image.caption.trim(), `${p.slug} caption`).not.toBe("");
        expect(image.alt.trim(), `${p.slug} ${image.caption} alt`).not.toBe("");
        expect(image.src, `${p.slug} ${image.caption} src`).toBeTruthy();
      }
      const captions = images.map((i) => i.caption);
      expect(new Set(captions).size, `${p.slug} captions`).toBe(captions.length);
    }
  });

  it("shows four screenshots for the three web projects", () => {
    for (const slug of ["neatly-hotel", "course-flow", "blog-post"]) {
      expect(projects.find((p) => p.slug === slug)?.images, slug).toHaveLength(4);
    }
  });
});
