"use client";

import { useRef } from "react";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { experience } from "@/lib/experience";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"] });

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const container = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!container.current) return;

    gsap.fromTo(
      rowsRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
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
      id="experience"
      ref={container}
      className="relative z-20 w-full py-20 px-6 sm:py-24 md:py-32 md:px-20 scroll-mt-24"
    >
      {/* Solid backdrop: the 3D crystal can still be mid-scene behind this
          section, and its bright bloom particles wash out plain text —
          a dark glass panel keeps the content legible regardless. */}
      <div className="relative rounded-3xl border border-white/10 bg-black/80 backdrop-blur-md px-5 py-8 sm:px-6 sm:py-10 md:px-12 md:py-16">
        <h2 className="text-[clamp(2.25rem,8.5vw,6rem)] font-black uppercase leading-none mb-10 md:mb-16">
          Work <br />
          <span className="text-[#00ff41]">Experience</span>
        </h2>

        <div className="border-t border-white/10">
          {experience.map((job, i) => (
            <div
              key={`${job.org}-${job.date}`}
              ref={(el) => {
                rowsRef.current[i] = el;
              }}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-6 py-8 border-b border-white/10 hover:border-[#00ff41] transition-colors duration-500"
            >
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                <h3
                  className={`${spaceGrotesk.className} text-2xl md:text-4xl font-bold uppercase leading-tight tracking-[-0.015em] text-white group-hover:text-[#00ff41] transition-colors duration-300`}
                >
                  {job.role}
                </h3>
                <span className={`${spaceGrotesk.className} text-lg md:text-xl font-normal text-gray-300`}>
                  {job.org}
                </span>
              </div>
              <span
                className={`${jetbrainsMono.className} text-[11px] md:text-xs font-medium uppercase tracking-[0.18em] text-[#00ff41]`}
              >
                {job.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
