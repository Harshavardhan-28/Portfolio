"use client";

import Image from "next/image";
import Link from "next/link";
import type { Achievement } from "@/lib/achievements";

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
  const href = achievement.externalUrl ?? `/achievements/${achievement.slug}`;
  const isExternal = Boolean(achievement.externalUrl);

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group relative block aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 hover:border-[#00ff41] transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,65,0.25)]"
    >
      <Image
        src={achievement.image}
        alt={achievement.title}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-6">
        <span className="text-[#00ff41] text-xs font-bold uppercase tracking-widest block mb-2">
          {achievement.tag} · {achievement.date}
        </span>
        <h3 className="text-2xl font-black text-white uppercase leading-tight transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {achievement.title}
        </h3>
        <span className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-[#00ff41]/50 text-[#00ff41] text-xs font-bold uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-[#00ff41] group-hover:text-black transition-all duration-300 w-fit">
          Read more
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
