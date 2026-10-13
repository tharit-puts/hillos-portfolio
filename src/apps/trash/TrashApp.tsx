"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui";
import { useOS } from "@/os/OSProvider";

const MESSAGES = [
  "Nothing here. Every bug I found got fixed.",
  "Still empty. Clean code only.",
  "OK, you really like clicking. Here are my projects instead.",
];

export default function TrashApp() {
  const { open } = useOS();
  const [clicks, setClicks] = useState(0);

  function empty() {
    const next = clicks + 1;
    setClicks(next);
    if (next >= MESSAGES.length - 1) open("projects");
  }

  return (
    <div className="flex flex-col gap-3.5 p-6 leading-relaxed">
      <p aria-live="polite">{MESSAGES[Math.min(clicks, MESSAGES.length - 1)]}</p>
      <button type="button" className={buttonClass.dark} onClick={empty}>
        Empty Trash
      </button>
    </div>
  );
}
