import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { achievements } from "@/lib/achievements";
import BackButton from "@/components/BackButton";

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
    <main className="bg-black text-white min-h-screen px-6 md:px-20 py-24 sm:py-32">
      <BackButton href="/#achievements" />

      <span className="text-[#00ff41] text-sm font-bold uppercase tracking-widest">
        {achievement.tag} · {achievement.date}
      </span>
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-none mt-4 mb-8 sm:mb-12">
        {achievement.title}
      </h1>

      <div className="w-full overflow-hidden rounded-2xl border border-white/10 mb-12">
        <Image
          src={achievement.image}
          alt={achievement.title}
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full"
          priority
        />
      </div>

      <div className="max-w-2xl space-y-6">
        {achievement.body.map((line, i) => {
          if (line.startsWith("## ")) {
            return (
              <h2 key={i} className="pt-4 text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-3xl">
                {line.slice(3)}
              </h2>
            );
          }
          if (line.startsWith("> ")) {
            return (
              <blockquote key={i} className="border-l-4 border-[#00ff41]/50 pl-6 font-serif text-2xl italic text-gray-300">
                {line.slice(2)}
              </blockquote>
            );
          }
          const isLead = i === 0;
          return (
            <p
              key={i}
              className={
                isLead
                  ? "text-xl font-light leading-relaxed text-gray-200 sm:text-2xl"
                  : "text-lg leading-relaxed text-gray-300"
              }
            >
              {line}
            </p>
          );
        })}
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
