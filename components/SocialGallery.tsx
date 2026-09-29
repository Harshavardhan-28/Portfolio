"use client";

import Image from "next/image";
import { useState } from "react";
import { socials } from "@/lib/site";
import { useInView, useMedia, useWide } from "@/lib/hooks";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

// Array order = fan order, left to right.
const images = [
  "/images/socials/ethmumbai-portrait.jpg",
  "/images/socials/river-portrait.jpg",
  "/images/socials/sunrise-trek.jpg",
  "/images/socials/social-card.JPG",
  "/images/socials/beach-portrait.jpg",
  "/images/socials/trek.jpg",
];

const EASE = "cubic-bezier(0.32,0.72,0,1)";

/** Photos fan out of a stack when scrolled into view; tap one to pull it forward. */
export default function SocialGallery() {
  const wide = useWide();
  const touch = useMedia("(hover: none)");
  const [ref, fanned] = useInView<HTMLDivElement>(0.4);
  const [focus, setFocus] = useState(-1);

  const mid = (images.length - 1) / 2;
  const spread = wide ? 150 : 34;
  const roll = wide ? 5 : 7;

  return (
    <section data-sec="images" className="flex flex-col gap-8 py-16">
      <SectionHeading num="06" eyebrow="Life" title="What's up on socials" className="px-6 md:mx-auto md:w-full md:max-w-[1200px]" />
      <div
        ref={ref}
        className="relative h-[340px] overflow-hidden min-[700px]:h-[480px]"
        style={{ perspective: 1200 }}
      >
        {images.map((src, i) => {
          const o = i - mid;
          const f = focus === i;
          const transform = !fanned
            ? "translate3d(0,140px,0) scale(0.92)"
            : f
              ? `translate3d(${o * spread * 0.9}px,-16px,60px) rotateZ(0deg) scale(1.1)`
              : `translate3d(${o * spread}px,${Math.abs(o) * (wide ? 16 : 10)}px,0) rotateZ(${o * roll}deg) rotateY(${o * -8}deg) scale(${1 - Math.abs(o) * 0.08})`;
          return (
            <button
              key={src}
              onClick={() => setFocus(f ? -1 : i)}
              aria-label={`Photo ${i + 1}`}
              className="absolute left-1/2 top-10 ml-[-70px] h-[220px] w-[140px] cursor-pointer overflow-hidden rounded-[28px] border p-0 min-[700px]:ml-[-115px] min-[700px]:h-[350px] min-[700px]:w-[230px]"
              style={{
                borderColor: "var(--line)",
                background: "var(--surface)",
                transformOrigin: "50% 92%",
                boxShadow: "0 16px 40px var(--shadow)",
                transition: `transform 900ms ${EASE}, opacity 900ms ${EASE}`,
                transform,
                opacity: fanned ? 1 : 0,
                zIndex: f ? 50 : Math.round(10 - Math.abs(o) * 2),
              }}
            >
              <Image src={src} alt={`Social photo ${i + 1}`} fill sizes="240px" className="object-cover" />
            </button>
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-4 px-6">
        <span className="mono text-xs" style={{ color: "var(--muted)" }}>
          {touch ? "tap a photo to bring it forward" : "click a photo to bring it forward"}
        </span>
        <Reveal className="flex flex-wrap justify-center gap-2">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium"
              style={{ borderColor: "var(--line)", color: "var(--fg)" }}
            >
              <i className={s.icon} style={{ fontSize: 18 }} />
              {s.name}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
