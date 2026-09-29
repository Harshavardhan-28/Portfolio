"use client";

import Image from "next/image";
import Link from "next/link";
import { achievements, type Achievement } from "@/lib/achievements";
import { projects } from "@/lib/projects";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const FEATURED_SLUG = "google-cloud-agentic-ai-day";

const thumb = (a: Achievement) => a.previewImage ?? a.image;
const thumbPos = (a: Achievement) => a.previewPosition ?? a.heroPosition ?? "center 20%";
const built = (a: Achievement) =>
  a.facts?.built ?? projects.find((p) => p.slug === a.projectSlug)?.title;

export default function Achievements() {
  const featured = achievements.find((a) => a.slug === FEATURED_SLUG) ?? achievements[0];
  const rest = achievements.filter((a) => a !== featured);
  if (!featured) return null;

  return (
    <section data-sec="hackathons" className="flex flex-col gap-8 px-6 py-16 md:mx-auto md:max-w-[1200px]">
      <SectionHeading
        num="04"
        eyebrow="Hackathons"
        title="Hackathons and achievements"
        balance
        href="/achievements"
        hrefLabel="All hackathons"
      />
      <div className="grid grid-cols-1 items-stretch gap-4 min-[700px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Reveal
          as={Link}
          href={`/achievements/${featured.slug}`}
          className="relative block aspect-[4/5] overflow-hidden rounded-3xl min-[700px]:aspect-[4/3]"
          style={{ background: "var(--surface)" }}
        >
          <Image
            src={thumb(featured)}
            alt={featured.title}
            fill
            sizes="(min-width: 768px) 600px, 100vw"
            className="object-cover"
            style={{ objectPosition: thumbPos(featured) }}
          />
          {featured.facts?.result && (
            <span
              className="mono absolute right-2 top-2 flex items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold uppercase text-black"
              style={{ background: "var(--accent)", letterSpacing: ".04em" }}
            >
              <i className="ph-fill ph-trophy" style={{ fontSize: 14 }} />
              1st prize
            </span>
          )}
          <div
            className="absolute inset-x-2 bottom-2 flex flex-col gap-2 rounded-2xl p-4"
            style={{
              background: "var(--glass)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <span className="mono text-xs font-medium" style={{ color: "var(--muted)" }}>
              {[featured.date, featured.location].filter(Boolean).join(" / ")}
            </span>
            <h3 className="m-0 text-2xl font-semibold" style={{ lineHeight: "32px", letterSpacing: "-0.02em", color: "var(--fg)" }}>
              {featured.title}
            </h3>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium" style={{ color: "var(--accentText)" }}>
                {featured.facts?.result}
              </span>
              {built(featured) && (
                <span className="text-sm" style={{ color: "var(--muted)" }}>
                  Built {projects.find((p) => p.slug === featured.projectSlug)?.title ?? built(featured)}
                </span>
              )}
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col justify-between gap-3">
          {rest.map((h) => (
            <Reveal
              key={h.slug}
              as={Link}
              href={`/achievements/${h.slug}`}
              className="grid flex-1 grid-cols-[96px_minmax(0,1fr)] items-center gap-4 rounded-[20px] border p-2 active:scale-[0.98] min-[700px]:grid-cols-[140px_minmax(0,1fr)]"
              style={{ background: "var(--surface)", borderColor: "var(--line)" }}
            >
              <div className="relative h-[120px] min-h-[120px] overflow-hidden rounded-xl min-[700px]:h-full">
                <Image
                  src={thumb(h)}
                  alt={h.title}
                  fill
                  sizes="140px"
                  className="object-cover"
                  style={{ objectPosition: thumbPos(h) }}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1 pr-2">
                <span className="mono text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {h.date}
                </span>
                <h3 className="m-0 text-lg font-semibold" style={{ lineHeight: "28px", letterSpacing: "-0.01em", color: "var(--fg)" }}>
                  {h.title}
                </h3>
                <span
                  className="text-sm font-medium"
                  style={{ color: h.facts?.result ? "var(--accentText)" : "var(--muted)", textWrap: "pretty" }}
                >
                  {h.facts?.result ?? (built(h) ? `Built ${built(h)}` : "Participant")}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
