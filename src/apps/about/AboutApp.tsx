"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import hillPhoto from "@/assets/hill-photo.jpg";
import { buttonClass } from "@/components/ui";
import { profile } from "@/content/profile";
import { useOS } from "@/os/OSProvider";
import { PhotoViewer } from "./PhotoViewer";

const PHOTO_ALT = `${profile.nickname}, standing by a river`;

const STATUS: Array<[label: string, value: string]> = [
  ["Bootcamp", profile.status.bootcamp],
  ["Looking for", profile.status.lookingFor],
  ["Available", profile.status.available],
];

export default function AboutApp() {
  const { open } = useOS();
  const [viewing, setViewing] = useState(false);
  const closeViewer = useCallback(() => setViewing(false), []);

  return (
    <div className="flex flex-col gap-5 p-6 leading-relaxed">
      {viewing && <PhotoViewer src={hillPhoto} alt={PHOTO_ALT} onClose={closeViewer} />}
      {/* The photo floats right, so the text wraps around it. */}
      <div className="flow-root space-y-3.5">
        <button
          type="button"
          onClick={() => setViewing(true)}
          aria-label="View photo larger"
          title="Click to enlarge"
          className="float-right mb-2 ml-4 cursor-zoom-in"
        >
          <Image
            src={hillPhoto}
            alt={PHOTO_ALT}
            sizes="176px"
            quality={85}
            className="block aspect-7/8 w-32 border-2 border-ink object-cover object-[70%_40%] shadow-hard-sm sm:w-44"
          />
        </button>
        <p className="font-pixel text-3xl leading-tight">
          {profile.name.split(" ")[0]} &quot;{profile.nickname}&quot;
          <br />
          {profile.name.split(" ").slice(1).join(" ")}
        </p>
        <p className="font-bold text-violet">
          {profile.role} · {profile.location.split(",")[0]}
        </p>
        {profile.about.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button type="button" className={buttonClass.dark} onClick={() => open("projects")}>
          Open Projects/
        </button>
        <button type="button" className={buttonClass.light} onClick={() => open("resume")}>
          Resume
        </button>
      </div>

      <section aria-label="Status" className="flex flex-col gap-1.5 border-2 border-ink bg-white p-3.5">
        <h3 className="font-pixel text-sm">STATUS</h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          {STATUS.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="opacity-60">{label}</dt>
              <dd className="font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
