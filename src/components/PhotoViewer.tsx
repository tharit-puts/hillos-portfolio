"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/icons";

/**
 * Full-screen photo viewer: nearly the full height of the screen, with the width
 * following the photo's own proportions. Click anywhere, press Esc, or use the button to close.
 */
export function PhotoViewer({ src, alt, onClose }: { src: StaticImageData; alt: string; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButton.current?.focus();

    // Capture phase + stopPropagation: Esc must close the viewer only, not the About window behind it.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex animate-pop cursor-zoom-out items-center justify-center bg-ink/80 p-4"
    >
      <Image
        src={src}
        alt={alt}
        sizes="100vw"
        quality={90}
        className="h-auto max-h-[calc(100dvh-2rem)] w-auto max-w-full border-2 border-ink bg-white object-contain shadow-hard"
      />
      <button
        ref={closeButton}
        type="button"
        aria-label="Close photo"
        onClick={onClose}
        className="absolute top-4 right-4 flex h-10 w-11 cursor-pointer items-center justify-center border-2 border-ink bg-white text-ink hover:bg-coral"
      >
        <CloseIcon />
      </button>
    </div>,
    document.body,
  );
}
