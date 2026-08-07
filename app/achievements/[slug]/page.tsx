import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { achievements } from "@/lib/achievements";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return achievements.map((achievement) => ({ slug: achievement.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const achievement = achievements.find((a) => a.slug === slug);
  return { title: achievement ? `${achievement.title} — Harsh Khamkar` : "Achievement" };
}

export default async function AchievementPage({ params }: Props) {
  const { slug } = await params;
  const achievement = achievements.find((a) => a.slug === slug);
  if (!achievement) notFound();

  const galleryRest = (achievement.gallery ?? []).filter((src) => src !== achievement.image);

  return (
    <main className="bg-black text-white min-h-screen px-6 md:px-20 py-32">
      <Link
        href="/#achievements"
        className="group flex items-center gap-3 mb-12 px-5 py-2.5 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-neutral-300 hover:border-[#00ff41] hover:text-[#00ff41] hover:shadow-[0_0_20px_rgba(0,255,65,0.5)] transition-all duration-300 w-fit"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
        </svg>
        Back
      </Link>

      <span className="text-[#00ff41] text-sm font-bold uppercase tracking-widest">
        {achievement.tag} · {achievement.date}
      </span>
      <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mt-4 mb-12">
        {achievement.title}
      </h1>

      <div className="relative w-full h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden border border-white/10 mb-12">
        <Image src={achievement.image} alt={achievement.title} fill className="object-cover" priority />
      </div>

      <div className="max-w-2xl space-y-6 text-lg text-gray-300">
        {achievement.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {galleryRest.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16">
          {galleryRest.map((src) => (
            <div key={src} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
              <Image src={src} alt={achievement.title} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
