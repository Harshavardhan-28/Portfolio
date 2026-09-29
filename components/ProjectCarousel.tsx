"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { useVisibleScroll, useWide } from "@/lib/hooks";
import SectionHeading from "@/components/SectionHeading";

const FEATURED = 3;

/**
 * Selected works. On phones the cards are sticky and stack: as the next card
 * slides over, the one beneath shrinks and dims. On wide screens it's a grid.
 */
export default function ProjectCarousel() {
  const wide = useWide();
  const gridRef = useRef<HTMLDivElement>(null);
  const featured = projects.slice(0, FEATURED);

  const applyStack = () => {
    const grid = gridRef.current;
    if (!grid) return;
    const wraps = [...grid.querySelectorAll<HTMLElement>("[data-stack]")];
    wraps.forEach((w, i) => {
      const card = w.querySelector<HTMLElement>("[data-card]");
      const next = wraps[i + 1];
      if (!card) return;
      if (wide) {
        card.style.transform = "";
        card.style.filter = "";
        return;
      }
      let p = 0;
      if (next) {
        const a = w.getBoundingClientRect();
        const b = next.getBoundingClientRect();
        p = Math.max(0, Math.min(1, 1 - (b.top - a.top) / a.height));
      }
      card.style.transform = `scale(${1 - p * 0.06})`;
      card.style.filter = p > 0.01 ? `brightness(${1 - p * 0.35})` : "";
    });
  };
  useVisibleScroll(gridRef, applyStack, !wide, 0);
  // Switching to the wide layout clears any leftover stack styling.
  useEffect(() => {
    if (wide) applyStack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wide]);

  return (
    <section data-sec="projects" className="flex flex-col gap-8 px-6 py-16 md:mx-auto md:max-w-[1200px]">
      <SectionHeading
        num="03"
        eyebrow="Projects"
        title="Selected works"
        href="/projects"
        hrefLabel={`View all ${projects.length} projects`}
      />
      <div
        ref={gridRef}
        className="grid grid-cols-1 items-start gap-4 min-[700px]:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"
      >
        {featured.map((p, i) => (
          <div
            key={p.slug}
            data-stack=""
            className="sticky top-[var(--stack-top)] min-[700px]:relative min-[700px]:top-0"
            style={{ "--stack-top": `${72 + i * 12}px` } as React.CSSProperties}
          >
            <Link
              href={`/projects/${p.slug}`}
              data-card=""
              className="flex flex-col rounded-3xl border p-2"
              style={{
                background: "var(--surface)",
                borderColor: "var(--line)",
                transformOrigin: "center top",
                boxShadow: "0 -12px 32px var(--shadow)",
              }}
            >
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ aspectRatio: "16/10", background: "var(--surface2)" }}
              >
                {p.image && (
                  <Image
                    src={p.image}
                    alt={`${p.title} screenshot`}
                    fill
                    sizes="(min-width: 768px) 400px, 100vw"
                    className="object-cover"
                    style={{ objectPosition: "center top" }}
                  />
                )}
                <span
                  className="mono absolute left-2 top-2 rounded-lg px-2 py-1 text-xs font-medium"
                  style={{
                    background: "var(--glass)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    color: "var(--fg)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col gap-2 px-2 pb-2 pt-4">
                <span
                  className="mono text-xs font-medium uppercase"
                  style={{ letterSpacing: ".1em", color: "var(--accentText)" }}
                >
                  {p.category}
                </span>
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="m-0 text-2xl font-semibold"
                    style={{ lineHeight: "32px", letterSpacing: "-0.02em", color: "var(--fg)" }}
                  >
                    {p.title}
                  </h3>
                  <span
                    className="flex size-9 flex-none items-center justify-center rounded-full"
                    style={{ background: "var(--surface2)", color: "var(--fg)" }}
                  >
                    <i className="ph ph-arrow-up-right" style={{ fontSize: 18 }} />
                  </span>
                </div>
                <p
                  className="m-0 text-sm"
                  style={{
                    lineHeight: "20px",
                    color: "var(--muted)",
                    textWrap: "pretty",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.summary}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {p.tags.slice(0, 3).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                  {p.tags.length > 3 && <Tag>+{p.tags.length - 3}</Tag>}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="mono rounded-lg border px-2 py-1 text-xs"
      style={{ borderColor: "var(--line)", color: "var(--muted)" }}
    >
      {children}
    </span>
  );
}
