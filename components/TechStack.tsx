"use client";

import { useRef } from "react";
import { JetBrains_Mono } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { techStack } from "@/lib/techstack";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"] });

gsap.registerPlugin(ScrollTrigger);

function badgeUrl({ label, logo, color, logoColor = "white" }: (typeof techStack)[number]["items"][number]) {
  const params = new URLSearchParams({
    style: "for-the-badge",
    logo,
    logoColor,
  });
  return `https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?${params.toString()}`;
}

export default function TechStack() {
  const container = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(() => {
    if (!container.current) return;

    gsap.fromTo(
      badgesRef.current,
      { opacity: 0, y: 20, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.02,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: container });

  return (
    <section
      id="techstack"
      ref={container}
      className="relative z-20 w-full py-20 px-6 sm:py-24 md:py-32 md:px-20 scroll-mt-24"
    >
      {/* Same solid panel as Experience — the 3D crystal is still mid-scene
          behind this section and its bloom washes out anything translucent. */}
      <div className="relative rounded-3xl border border-white/10 bg-black/80 backdrop-blur-md px-5 py-8 sm:px-6 sm:py-10 md:px-12 md:py-16">
        <h2 className="text-[clamp(2.25rem,8.5vw,6rem)] font-black uppercase leading-none mb-10 md:mb-16">
          My <br />
          <span className="text-[#00ff41]">Tech Stack</span>
        </h2>

        {/* Divider-row list mirroring the Experience section: label on the
            left, content on the right, rule turning green on hover. */}
        {(() => {
          let badgeIndex = 0;
          return (
            <div className="border-t border-white/10">
              {techStack.map((category) => (
                <div
                  key={category.name}
                  className="group flex flex-col gap-4 border-b border-white/10 py-7 transition-colors duration-500 hover:border-[#00ff41] md:flex-row md:items-center md:gap-10"
                >
                  <span
                    className={`${jetbrainsMono.className} shrink-0 text-[11px] font-medium uppercase tracking-[0.18em] text-[#00ff41] md:w-40 md:text-xs`}
                  >
                    {category.name}
                  </span>
                  <div className="flex flex-wrap gap-2.5 md:gap-3">
                    {category.items.map((item) => {
                      const i = badgeIndex++;
                      return (
                        // eslint-disable-next-line @next/next/no-img-element -- external shields.io badge, not a local/optimizable asset
                        <img
                          key={item.label}
                          ref={(el) => {
                            badgesRef.current[i] = el;
                          }}
                          src={badgeUrl(item)}
                          alt={item.label}
                          height={32}
                          className="h-7 w-auto rounded-md transition-transform duration-300 hover:-translate-y-1 hover:scale-105 md:h-8"
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </section>
  );
}
