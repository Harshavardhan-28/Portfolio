"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CollectionItem, CollectionKind } from "@/lib/collection";
import { useFinePointer } from "@/lib/hooks";
import Reveal from "@/components/Reveal";

const CLIP_SHOWN = "inset(0% 0 0 0 round 24px)";
const CLIP_HIDDEN = "inset(100% 0 0 0 round 24px)";

const COPY = {
  projects: {
    words: ["All", "projects"],
    eyebrow: (n: number) => `Index / ${String(n).padStart(2, "0")} projects`,
    intro: "ML systems, data pipelines, agentic AI and on chain privacy. Pick one to read the full write up.",
    aspect: "16/10",
  },
  hackathons: {
    words: ["Hackathons"],
    eyebrow: (n: number) => `Index / ${String(n).padStart(2, "0")} events`,
    intro: "Stories from the build weekends: what we shipped, what broke and what we learned along the way.",
    aspect: "4/3",
  },
} as const;

function Card({ item, index, total, delay, aspect }: { item: CollectionItem; index: number; total: number; delay: number; aspect: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const clipDelay = (index % 3) * 90;
  return (
    <Link
      ref={ref}
      href={`${item.base}/${item.slug}`}
      data-cardlink=""
      className="flex flex-col gap-4"
      style={{ cursor: "none" }}
    >
      <div
        className="relative overflow-hidden rounded-3xl border"
        style={{
          aspectRatio: aspect,
          background: "var(--surface)",
          borderColor: "var(--line)",
          clipPath: seen ? CLIP_SHOWN : CLIP_HIDDEN,
          transition: `clip-path 1100ms var(--ease) ${clipDelay + delay}ms`,
        }}
      >
        {item.cardImage ? (
          <Image
            src={item.cardImage}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            style={{
              objectPosition: item.cardPos,
              transform: `scale(${seen ? 1 : 1.15})`,
              transition: `transform 1400ms var(--ease) ${clipDelay + delay}ms`,
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--surface)" }}>
            <span
              className="text-[180px] font-bold leading-none"
              style={{ letterSpacing: "-0.06em", color: "transparent", WebkitTextStroke: "1.5px var(--strokeLetter)" }}
            >
              {item.title.charAt(0)}
            </span>
          </div>
        )}
        <span
          className="mono absolute left-2 top-2 rounded-2xl px-2 py-1 text-xs font-medium"
          style={{
            background: "var(--glass)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "var(--fg)",
          }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {item.badge && (
          <span
            className="mono absolute right-2 top-2 flex items-center gap-1 rounded-2xl px-2.5 py-1 text-xs font-semibold uppercase text-black"
            style={{ background: "var(--accent)" }}
          >
            <i className="ph-fill ph-trophy" style={{ fontSize: 12 }} />
            Winner
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 px-1">
        <div className="mono flex justify-between gap-3 text-xs font-medium uppercase" style={{ letterSpacing: ".08em" }}>
          <span style={{ color: "var(--accentText)" }}>{item.meta}</span>
          <span style={{ color: "var(--muted)" }}>{item.meta2}</span>
        </div>
        <h2 className="m-0 text-[30px] font-semibold" style={{ lineHeight: "36px", letterSpacing: "-0.03em", color: "var(--fg)" }}>
          {item.title}
        </h2>
        <p
          className="m-0 text-base"
          style={{
            lineHeight: "24px",
            color: "var(--muted)",
            textWrap: "pretty",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.sub}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {item.cardTags.map((t) => (
            <span
              key={t}
              className="mono rounded-lg border px-2 py-1 text-xs"
              style={{ borderColor: "var(--line)", color: "var(--muted)" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function CollectionList({ kind, items }: { kind: CollectionKind; items: CollectionItem[] }) {
  const copy = COPY[kind];
  const isP = kind === "projects";
  const fine = useFinePointer();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("All");

  const cats = isP ? ["All", ...new Set(items.map((i) => i.category))] : ["All", "Winners"];
  const matches = (it: CollectionItem, c: string) =>
    c === "All" || (isP ? it.category === c : it.winner);
  const shown = items.filter((it) => matches(it, filter));

  const onGridMove = (e: React.MouseEvent) => {
    const c = cursorRef.current;
    if (!fine || !c) return;
    c.style.left = e.clientX + "px";
    c.style.top = e.clientY + "px";
    const on = !!(e.target as HTMLElement).closest("[data-cardlink]");
    c.style.transform = `translate(-50%,-50%) scale(${on ? 1 : 0})`;
  };
  const onGridLeave = () => {
    if (cursorRef.current) cursorRef.current.style.transform = "translate(-50%,-50%) scale(0)";
  };

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 pb-24 pt-32">
      <div className="flex flex-col gap-4">
        <span
          className="mono flex items-center gap-2 text-xs font-medium uppercase"
          style={{ letterSpacing: ".12em", color: "var(--accentText)" }}
        >
          <span className="pulse-dot size-2 rounded-full" style={{ background: "var(--accent)" }} />
          {copy.eyebrow(items.length)}
        </span>
        <h1
          aria-label={copy.words.join(" ")}
          className="m-0 flex flex-wrap font-semibold"
          style={{
            columnGap: "0.22em",
            fontSize: "clamp(48px,11vw,128px)",
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
            color: "var(--fg)",
          }}
        >
          {copy.words.map((w, wi) => (
            <span key={w} aria-hidden="true" className="inline-flex overflow-hidden pb-[0.08em]">
              {[...w].map((c, ci) => (
                <span
                  key={ci}
                  className="inline-block"
                  style={{
                    color: wi === 1 || !isP ? "var(--accentText)" : "var(--fg)",
                    animation: `hkrise 1000ms var(--ease) ${80 + (wi * 4 + ci) * 35}ms both`,
                  }}
                >
                  {c}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <Reveal
          as="p"
          delay={200}
          className="m-0 max-w-[560px] text-lg"
          style={{ lineHeight: "28px", color: "var(--muted)", textWrap: "pretty" }}
        >
          {copy.intro}
        </Reveal>
      </div>

      <Reveal delay={280} role="tablist" aria-label="Filter" className="flex flex-wrap gap-2">
        {cats.map((c) => {
          const sel = c === filter;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={sel}
              onClick={() => setFilter(c)}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium active:scale-[0.96]"
              style={{
                borderColor: sel ? "var(--fg)" : "var(--line)",
                background: sel ? "var(--fg)" : "transparent",
                color: sel ? "var(--bg)" : "var(--fg)",
                transition: "background-color 500ms var(--ease), color 500ms var(--ease)",
              }}
            >
              {c}
              <span className="mono text-xs opacity-70">{items.filter((it) => matches(it, c)).length}</span>
            </button>
          );
        })}
      </Reveal>

      {/* key on the filter so cards replay their wipe-in when it changes */}
      <div
        key={filter}
        onMouseMove={onGridMove}
        onMouseLeave={onGridLeave}
        className="grid gap-x-4 gap-y-6"
        style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,340px),1fr))" }}
      >
        {shown.map((it, i) => (
          <Card
            key={it.slug}
            item={it}
            index={items.indexOf(it)}
            total={items.length}
            delay={i * 60}
            aspect={copy.aspect}
          />
        ))}
      </div>

      {shown.length === 0 && (
        <div
          className="flex flex-col items-center gap-3 rounded-3xl border px-6 py-16 text-center"
          style={{ borderColor: "var(--line)" }}
        >
          <i className="ph ph-binoculars" style={{ fontSize: 32, color: "var(--muted)" }} />
          <span className="text-base font-medium" style={{ color: "var(--fg)" }}>
            Nothing in this filter yet.
          </span>
          <button
            onClick={() => setFilter("All")}
            className="h-10 cursor-pointer rounded-full border-0 px-4 text-sm font-semibold text-black"
            style={{ background: "var(--accent)" }}
          >
            Show everything
          </button>
        </div>
      )}

      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[65] flex h-10 items-center gap-1 rounded-full px-4 text-sm font-semibold text-black"
        style={{
          background: "var(--accent)",
          transform: "translate(-50%,-50%) scale(0)",
          transition: "transform 500ms var(--ease)",
        }}
      >
        View
        <i className="ph ph-arrow-up-right" style={{ fontSize: 14 }} />
      </div>
    </main>
  );
}
