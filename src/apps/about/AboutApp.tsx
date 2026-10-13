"use client";

import { buttonClass } from "@/components/ui";
import { profile } from "@/content/profile";
import { useOS } from "@/os/OSProvider";

export default function AboutApp() {
  const { open } = useOS();
  return (
    <div className="flex flex-col gap-3.5 p-6 leading-relaxed">
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
      <div className="flex flex-wrap gap-2.5">
        <button type="button" className={buttonClass.dark} onClick={() => open("projects")}>
          Open Projects/
        </button>
        <button type="button" className={buttonClass.light} onClick={() => open("terminal")}>
          Try the terminal
        </button>
      </div>
    </div>
  );
}
