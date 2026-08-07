"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { achievements } from "@/lib/achievements";
import AchievementCard from "./AchievementCard";

gsap.registerPlugin(ScrollTrigger);

export default function Achievements() {
  const container = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
      className="relative z-20 w-full py-32 px-6 md:px-20 scroll-mt-24"
    >
      {/* Secondary scroll target so Header's "Hackathons" link also lands here */}
      <div id="hackathons" className="absolute -top-24" aria-hidden="true" />

      <h2 className="text-6xl md:text-8xl font-black uppercase leading-none mb-16">
        Hackathons &amp; <br />
        <span className="text-[#00ff41]">Achievements</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {achievements.map((achievement, i) => (
          <div
            key={achievement.slug}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
          >
            <AchievementCard achievement={achievement} />
          </div>
        ))}
      </div>
    </section>
  );
}
