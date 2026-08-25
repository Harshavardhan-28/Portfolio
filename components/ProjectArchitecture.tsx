"use client";

import { useState } from "react";
import Image from "next/image";
import { JetBrains_Mono } from "next/font/google";
import ImageLightbox from "./ImageLightbox";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export default function ProjectArchitecture({
  images,
  captions,
  title,
}: {
  images: string[];
  captions?: Record<string, string>;
  title: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const lightboxImages = images.map((src) => ({ src, alt: captions?.[src] ?? `${title} diagram` }));
  const [main, ...rest] = images;
  const mainCaption = captions?.[main];

  return (
    <div id="architecture" className="border-t border-white/10 px-6 py-12 md:px-20">
      <div className="mb-5 flex items-baseline gap-3.5">
        <span className={`${jetbrainsMono.className} text-xs font-medium uppercase tracking-[0.18em] text-[#00ff41]`}>
          Architecture
        </span>
      </div>
      <figure className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIndex(0)}
          aria-label="Expand architecture diagram"
          className="relative h-72 overflow-hidden rounded-xl border border-white/10 bg-neutral-100 p-5 transition-opacity hover:opacity-90 sm:h-96"
        >
          <Image
            src={main}
            alt={mainCaption ?? `${title} architecture`}
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-contain"
          />
        </button>
        {mainCaption && (
          <figcaption className={`${jetbrainsMono.className} text-[11px] text-neutral-500`}>{mainCaption}</figcaption>
        )}
      </figure>
      {rest.length > 0 && (
        <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {rest.map((src, i) => {
            const caption = captions?.[src];
            return (
              <figure key={src} className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIndex(i + 1)}
                  aria-label={`Expand diagram ${i + 2}`}
                  className="relative h-56 overflow-hidden rounded-xl border border-white/10 bg-neutral-100 p-4 transition-opacity hover:opacity-90"
                >
                  <Image
                    src={src}
                    alt={caption ?? `${title} diagram`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-contain"
                  />
                </button>
                {caption && (
                  <figcaption className={`${jetbrainsMono.className} text-[11px] text-neutral-500`}>
                    {caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      )}
      <ImageLightbox images={lightboxImages} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </div>
  );
}
