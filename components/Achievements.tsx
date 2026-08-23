"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { achievements } from "@/lib/achievements";
import AchievementCard from "./AchievementCard";

gsap.registerPlugin(ScrollTrigger);

const HOME_PREVIEW_COUNT = 3;

export default function Achievements() {
  const container = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const previewAchievements = achievements.slice(0, HOME_PREVIEW_COUNT);
  const hasMore = achievements.length > HOME_PREVIEW_COUNT;

  useGSAP(() => {
    if (!container.current) return;

    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 60 },
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
      id="achievements"
      ref={container}
      className="relative z-20 w-full py-20 px-6 sm:py-24 md:py-32 md:px-20 scroll-mt-24"
    >
      {/* Secondary scroll target so Header's "Hackathons" link also lands here */}
      <div id="hackathons" className="absolute -top-24" aria-hidden="true" />

      {/* Fluid rather than a jump to text-8xl at md: "ACHIEVEMENTS" is 12
          characters, and 96px of it is wider than this section's content box
          between 768px and ~1000px — which widened the whole document. */}
      <h2 className="text-[clamp(2.25rem,8.5vw,6rem)] font-black uppercase leading-none mb-10 md:mb-16">
        Hackathons &amp; <br />
        <span className="text-[#00ff41]">Achievements</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {previewAchievements.map((achievement, i) => (
          <div
            key={achievement.slug}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
          >
            <AchievementCard achievement={achievement} />
          </div>
        ))}

        {hasMore && (
          <div
            ref={(el) => {
              cardsRef.current[previewAchievements.length] = el;
            }}
          >
            <Link
              href="/achievements"
              className="group relative flex aspect-[3/4] flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[#111] transition-all duration-500 hover:border-[#00ff41] hover:shadow-[0_0_30px_rgba(0,255,65,0.25)]"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00ff41] text-[#00ff41] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#00ff41] group-hover:text-black">
                <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <h3 className="text-center text-lg font-black uppercase leading-tight text-white">
                View All <br /> <span className="text-[#00ff41]">Achievements</span>
              </h3>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
