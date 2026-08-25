import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { achievements } from "@/lib/achievements";
import BackButton from "@/components/BackButton";
import HeroZoom from "@/components/HeroZoom";
import AchievementGallery from "@/components/AchievementGallery";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

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
  const index = achievements.findIndex((a) => a.slug === slug);
  const achievement = achievements[index];
  if (!achievement) notFound();

  const galleryRest = (achievement.gallery ?? []).filter((src) => src !== achievement.image);
  const headings = achievement.body.filter((line) => line.startsWith("## ")).map((line) => line.slice(3));
  const onThisPage = [...headings, ...(galleryRest.length > 0 ? ["Gallery"] : [])];
  const next = achievements.length > 1 ? achievements[(index + 1) % achievements.length] : null;

  const factLabel = `${jetbrainsMono.className} text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500`;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero: anchored to the top — the fixed site header floats directly over it,
          so the gradient darkens both ends rather than just the bottom. */}
      <div className="relative h-85 w-full overflow-hidden sm:h-[70vh] sm:max-h-160 sm:min-h-100">
        <Image
          src={achievement.image}
          alt={achievement.title}
          fill
          style={{ objectPosition: achievement.heroPosition ?? "center top" }}
          className="object-cover grayscale contrast-125"
          priority
        />
        <HeroZoom src={achievement.image} alt={achievement.title} />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.55)_38%,rgba(0,0,0,0.25)_65%,rgba(0,0,0,0.4)_100%)]" />
        <div className="absolute inset-x-6 bottom-8 md:inset-x-20 md:bottom-10">
          <div className={`${jetbrainsMono.className} mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#3ce07b]`}>
            {achievement.tag} · {achievement.date}
            {achievement.location && ` · ${achievement.location}`}
          </div>
          <h1
            className={`${spaceGrotesk.className} max-w-[20ch] text-4xl font-bold uppercase leading-[0.95] tracking-[-0.025em] text-white sm:text-5xl md:text-7xl`}
          >
            {achievement.title}
          </h1>
        </div>
      </div>

      {/* Sidebar + article */}
      <div className="grid grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[270px_1fr] md:gap-14 md:px-20 md:py-16">
        <div className="flex flex-col gap-6">
          <BackButton href="/#achievements" />

          {achievement.facts && (
            <div className="flex flex-col gap-4 rounded-xl border border-white/12 p-5">
              {achievement.facts.result && (
                <div>
                  <div className={factLabel}>Result</div>
                  <div className={`${spaceGrotesk.className} mt-1.5 text-base font-medium text-[#00ff41]`}>
                    {achievement.facts.result}
                  </div>
                </div>
              )}
              {achievement.facts.built && (
                <>
                  <div className="h-px bg-white/10" />
                  <div>
                    <div className={factLabel}>Built</div>
                    <div className={`${spaceGrotesk.className} mt-1.5 text-sm leading-relaxed text-neutral-200`}>
                      {achievement.facts.built}
                    </div>
                  </div>
                </>
              )}
              {achievement.facts.team && (
                <>
                  <div className="h-px bg-white/10" />
                  <div>
                    <div className={factLabel}>Team</div>
                    <div className={`${spaceGrotesk.className} mt-1.5 text-sm leading-relaxed text-neutral-200`}>
                      {achievement.facts.team}
                    </div>
                  </div>
                </>
              )}
              {achievement.facts.stack && achievement.facts.stack.length > 0 && (
                <>
                  <div className="h-px bg-white/10" />
                  <div>
                    <div className={`${factLabel} mb-2`}>Stack</div>
                    <div className="flex flex-wrap gap-1.5">
                      {achievement.facts.stack.map((item) => (
                        <span
                          key={item}
                          className={`${jetbrainsMono.className} rounded-full border border-white/16 px-2.5 py-1 text-[11px] text-neutral-300`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {achievement.repoUrl && (
                <a
                  href={achievement.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${jetbrainsMono.className} mt-1 rounded-lg bg-[#00ff41] py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-black transition-opacity hover:opacity-90`}
                >
                  Repo ↗
                </a>
              )}
            </div>
          )}

          {onThisPage.length > 0 && (
            <nav className={`${jetbrainsMono.className} hidden text-[11px] leading-[1.9] text-neutral-500 md:block`}>
              <div className="mb-1.5 tracking-[0.14em] text-neutral-400">On this page</div>
              {onThisPage.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="block transition-colors hover:text-[#00ff41]"
                >
                  {item}
                </a>
              ))}
            </nav>
          )}
        </div>

        <div className="flex max-w-[70ch] flex-col gap-6">
          {achievement.body.map((line, i) => {
            if (line.startsWith("## ")) {
              const text = line.slice(3);
              return (
                <h2
                  key={i}
                  id={text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                  className={`${spaceGrotesk.className} scroll-mt-24 pt-4 text-2xl font-bold uppercase leading-tight tracking-[-0.02em] text-white sm:text-3xl`}
                >
                  {text}
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
                    ? `${spaceGrotesk.className} text-xl font-normal leading-relaxed text-white sm:text-2xl`
                    : `${spaceGrotesk.className} text-lg leading-relaxed text-gray-300`
                }
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>

      {/* Full-width numbered gallery, click-to-zoom */}
      {galleryRest.length > 0 && (
        <AchievementGallery images={galleryRest} captions={achievement.galleryCaptions} title={achievement.title} />
      )}

      {/* Prev/next footer. Skinny arrow-links work fine as a hover target on
          desktop, but they're a poor tap target on a phone — below `sm` these
          become full-width buttons instead, matching the fact rail's Repo
          button treatment. */}
      <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-9 sm:flex-row sm:items-center sm:justify-between sm:gap-0 md:px-20">
        <Link
          href="/#achievements"
          className={`${jetbrainsMono.className} group flex items-center justify-center gap-2 rounded-lg border border-white/20 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-300 transition-colors hover:border-white/40 hover:text-white sm:justify-start sm:border-0 sm:bg-transparent sm:p-0 sm:text-neutral-400 sm:hover:text-white`}
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          All hackathons
        </Link>
        {next && (
          <Link
            href={`/achievements/${next.slug}`}
            className={`${jetbrainsMono.className} group flex items-center justify-center gap-2 rounded-lg bg-[#00ff41] py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-black transition-opacity hover:opacity-90 sm:justify-end sm:bg-transparent sm:p-0 sm:text-[#00ff41] sm:transition-colors sm:hover:text-white sm:hover:opacity-100`}
          >
            Next: {next.title}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </main>
  );
}
