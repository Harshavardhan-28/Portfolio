"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

/** Small expand affordance for a hero banner — sits mid-right so it never
 * collides with the fixed site header (top) or the hero's own title overlay
 * (bottom). Opens the same lightbox the galleries use, single-image. */
export default function HeroZoom({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Expand image"
        className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white sm:right-6 sm:h-11 sm:w-11"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
      <ImageLightbox
        images={[{ src, alt }]}
        index={open ? 0 : null}
        onClose={() => setOpen(false)}
        onIndexChange={() => {}}
      />
    </>
  );
}
