"use client";

import { useState } from "react";
import Image from "next/image";
import { JetBrains_Mono } from "next/font/google";
import ImageLightbox from "./ImageLightbox";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export default function AchievementGallery({
  images,
  captions,
  title,
}: {
  images: string[];
  captions?: Record<string, string>;
  title: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const lightboxImages = images.map((src) => ({ src, alt: captions?.[src] ?? title }));

  return (
    <div id="gallery" className="scroll-mt-24 border-t border-white/10 px-6 py-12 md:px-20">
      <div className="mb-5 flex items-baseline gap-3.5">
        <span className={`${jetbrainsMono.className} text-xs font-medium uppercase tracking-[0.18em] text-[#00ff41]`}>
          Gallery
        </span>
        <span className={`${jetbrainsMono.className} text-xs text-neutral-500`}>
          {String(images.length).padStart(2, "0")} photos
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
        {images.map((src, i) => {
          const caption = captions?.[src];
          return (
            <figure key={src} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Expand photo ${i + 1}`}
                className="relative aspect-4/3 overflow-hidden rounded-xl border border-white/10 transition-opacity hover:opacity-90"
              >
                <Image src={src} alt={caption ?? title} fill className="object-cover" />
              </button>
              <figcaption className={`${jetbrainsMono.className} text-[11px] text-neutral-500`}>
                {String(i + 1).padStart(2, "0")}
                {caption && ` · ${caption}`}
              </figcaption>
            </figure>
          );
        })}
      </div>
      <ImageLightbox images={lightboxImages} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </div>
  );
}
