"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CollectionItem, CollectionKind, Shot } from "@/lib/collection";
import { useWide } from "@/lib/hooks";
import Reveal from "@/components/Reveal";

const factLabel = "mono text-xs font-medium uppercase";
const h2Cls = "m-0 text-[30px] font-semibold";

export default function CollectionDetail({
  kind,
  item,
  next,
}: {
  kind: CollectionKind;
  item: CollectionItem;
  next: CollectionItem;
}) {
  const isP = kind === "projects";
  const wide = useWide(900);
  const barRef = useRef<HTMLDivElement>(null);
  const parRef = useRef<HTMLDivElement>(null);
  const [tocId, setTocId] = useState("");
  const [lb, setLb] = useState(-1);
  const [lbShown, setLbShown] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  const [backHover, setBackHover] = useState(false);

  const shots: Shot[] = [...item.gallery, ...item.arch];
  const headings = item.blocks.filter((b) => b.kind === "h");
  const toc = [
    ...headings.map((b) => ({ id: b.id, label: b.text })),
    ...(item.gallery.length ? [{ id: "gallery", label: item.galleryTitle }] : []),
    ...(item.arch.length ? [{ id: "architecture", label: "Architecture" }] : []),
  ];

  // Reading progress bar, hero parallax, and "on this page" tracking.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      if (parRef.current) parRef.current.style.transform = `translateY(${Math.min(y, 800) * 0.12}px)`;
      let cur = "";
      document.querySelectorAll<HTMLElement>("[data-h]").forEach((h) => {
        if (h.getBoundingClientRect().top < vh * 0.35) cur = h.dataset.h ?? "";
      });
      setTocId(cur);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lightbox: keyboard control + page scroll lock.
  useEffect(() => {
    if (lb < 0) return;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setLbShown(true), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lb >= 0]);

  const closeLb = () => {
    setLb(-1);
    setLbShown(false);
  };
  const step = (dir: number) => {
    setLbShown(false);
    setLb((i) => (i + dir + shots.length) % shots.length);
    setTimeout(() => setLbShown(true), 40);
  };
  const goHeading = (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-h="${id}"]`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: "smooth" });
  };

  const frameBg = (s: Shot) => (s.frame === "white" ? "#fff" : "var(--surface2)");
  const open = lb >= 0 ? shots[lb] : null;

  return (
    <>
      <div
        ref={barRef}
        className="fixed inset-x-0 top-0 z-[70] h-0.5"
        style={{ background: "var(--accent)", transformOrigin: "0 50%", transform: "scaleX(0)" }}
      />
      <main className="pt-24">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6">
          <Reveal
            as={Link}
            href={`/${isP ? "projects" : "achievements"}`}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            className="flex items-center gap-3.5 self-start text-[15px] font-medium"
            style={{ lineHeight: "20px", letterSpacing: "-0.01em", color: "var(--fg)" }}
          >
            <span
              className="flex size-11 items-center justify-center rounded-full border"
              style={{
                borderColor: backHover ? "var(--accent)" : "var(--line)",
                background: backHover ? "var(--accent)" : "transparent",
                color: backHover ? "#000" : "var(--fg)",
                transition: "background-color 500ms var(--ease), border-color 500ms var(--ease), color 500ms",
              }}
            >
              <i
                className="ph ph-arrow-left"
                style={{
                  fontSize: 18,
                  transform: `translateX(${backHover ? -3 : 0}px)`,
                  transition: "transform 600ms var(--ease)",
                }}
              />
            </span>
            <span className="flex flex-col items-start gap-0.5">
              <span className="mono text-[11px] font-medium uppercase" style={{ lineHeight: "14px", letterSpacing: ".12em", color: "var(--muted)" }}>
                Back to
              </span>
              {isP ? "All projects" : "All hackathons"}
            </span>
          </Reveal>

          <div
            className="relative overflow-hidden rounded-3xl border"
            style={{
              height: wide ? "min(62vh,560px)" : 320,
              background: "var(--surface)",
              borderColor: "var(--line)",
            }}
          >
            {item.heroImage ? (
              <div ref={parRef} className="absolute left-0 w-full" style={{ top: "-8%", height: "116%", willChange: "transform" }}>
                <Image
                  src={item.heroImage}
                  alt={item.title}
                  fill
                  priority
                  sizes="(min-width: 1200px) 1152px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: item.heroPos }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-bold leading-none"
                  style={{
                    fontSize: "min(60vw,420px)",
                    letterSpacing: "-0.06em",
                    color: "transparent",
                    WebkitTextStroke: "1.5px var(--strokeLetter)",
                  }}
                >
                  {item.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Reveal className="flex items-center gap-3">
              {item.logo && (
                <span
                  className="relative size-12 overflow-hidden rounded-xl border"
                  style={{ background: "#fff", borderColor: "var(--line)" }}
                >
                  <Image
                    src={item.logo}
                    alt=""
                    fill
                    sizes="48px"
                    style={{ objectFit: item.logoFit }}
                  />
                </span>
              )}
              <span className={factLabel} style={{ letterSpacing: ".12em", color: "var(--accentText)" }}>
                {item.eyebrow}
              </span>
            </Reveal>
            <h1
              className="m-0 font-semibold"
              style={{
                fontSize: "clamp(48px,9vw,112px)",
                lineHeight: 0.95,
                letterSpacing: "-0.05em",
                color: "var(--fg)",
                textWrap: "balance",
              }}
            >
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="block" style={{ animation: "hkrise 1100ms var(--ease) 150ms both" }}>
                  {item.title}
                </span>
              </span>
            </h1>
            {item.tagline && (
              <Reveal
                as="p"
                delay={250}
                className="m-0 max-w-[680px] text-xl"
                style={{ lineHeight: "28px", color: "var(--muted)", textWrap: "pretty" }}
              >
                {item.tagline}
              </Reveal>
            )}
          </div>
        </div>

        <div
          className="mx-auto grid max-w-[1200px] items-start gap-12 px-6 py-16"
          style={{ gridTemplateColumns: wide ? "280px minmax(0,1fr)" : "minmax(0,1fr)" }}
        >
          <aside className="flex flex-col gap-6" style={wide ? { position: "sticky", top: 96 } : undefined}>
            <Reveal
              className="flex flex-col gap-4 rounded-3xl border p-5"
              style={{ background: "var(--surface)", borderColor: "var(--line)" }}
            >
              {item.facts.map((f) => (
                <div key={f.label} className="flex flex-col gap-1 border-b pb-4" style={{ borderColor: "var(--line)" }}>
                  <span className={factLabel} style={{ letterSpacing: ".1em", color: "var(--muted)" }}>{f.label}</span>
                  <span className="text-base font-medium" style={{ color: f.accent ? "var(--accentText)" : "var(--fg)", textWrap: "pretty" }}>
                    {f.value}
                  </span>
                </div>
              ))}
              {item.stack.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className={factLabel} style={{ letterSpacing: ".1em", color: "var(--muted)" }}>Stack</span>
                  <div className="flex flex-wrap gap-1">
                    {item.stack.map((t) => (
                      <span key={t} className="mono rounded-full border px-2.5 py-1 text-xs" style={{ borderColor: "var(--line)", color: "var(--fg)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                {item.links.map((l) => {
                  const Tag = l.external ? "a" : Link;
                  return (
                    <Tag
                      key={l.label}
                      href={l.url}
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex h-12 items-center justify-between rounded-full border px-4 text-sm font-semibold active:scale-[0.98]"
                      style={{
                        borderColor: l.primary ? "var(--accent)" : "var(--line)",
                        background: l.primary ? "var(--accent)" : "transparent",
                        color: l.primary ? "#000" : "var(--fg)",
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <i className={l.icon} style={{ fontSize: 18 }} />
                        {l.label}
                      </span>
                      <i className="ph ph-arrow-up-right" style={{ fontSize: 16 }} />
                    </Tag>
                  );
                })}
              </div>
            </Reveal>
            {wide && toc.length > 1 && (
              <nav aria-label="On this page" className="flex flex-col gap-1 pl-1">
                <span className={`${factLabel} mb-2`} style={{ letterSpacing: ".1em", color: "var(--muted)" }}>
                  On this page
                </span>
                {toc.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => goHeading(t.id)}
                    className="flex cursor-pointer items-center gap-2 border-0 bg-transparent py-1 text-left text-sm"
                    style={{ color: tocId === t.id ? "var(--fg)" : "var(--muted)", transition: "color 400ms var(--ease)" }}
                  >
                    <span
                      className="h-0.5 rounded-sm"
                      style={{ width: tocId === t.id ? 16 : 0, background: "var(--accent)", transition: "width 500ms var(--ease)" }}
                    />
                    {t.label}
                  </button>
                ))}
              </nav>
            )}
          </aside>

          <article className="flex max-w-[720px] flex-col gap-6">
            <Reveal
              as="p"
              className="m-0 text-2xl"
              style={{ lineHeight: "32px", letterSpacing: "-0.01em", color: "var(--fg)", textWrap: "pretty" }}
            >
              {item.lead}
            </Reveal>
            <Reveal as="span" className="block h-0.5 w-16" style={{ background: "var(--accentLine)" }}>
              {null}
            </Reveal>
            {item.blocks.map((b, i) =>
              b.kind === "h" ? (
                <Reveal
                  key={i}
                  as="h2"
                  data-h={b.id}
                  className={h2Cls}
                  style={{ margin: "24px 0 0", lineHeight: "36px", letterSpacing: "-0.03em", color: "var(--fg)", scrollMarginTop: 96 }}
                >
                  {b.text}
                </Reveal>
              ) : (
                <Reveal
                  key={i}
                  as="p"
                  className="m-0 text-lg"
                  style={{ lineHeight: "28px", color: "var(--body)", textWrap: "pretty" }}
                >
                  {b.text}
                </Reveal>
              )
            )}
          </article>
        </div>

        {item.gallery.length > 0 && (
          <section data-h="gallery" className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 pb-16 pt-8" style={{ scrollMarginTop: 96 }}>
            <Reveal className="flex items-baseline justify-between gap-4">
              <h2 className={h2Cls} style={{ lineHeight: "36px", letterSpacing: "-0.03em", color: "var(--fg)" }}>
                {item.galleryTitle}
              </h2>
              <span className="mono text-xs" style={{ color: "var(--muted)" }}>
                {item.gallery.length} {item.gallery.length === 1 ? "image" : "images"}
              </span>
            </Reveal>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))" }}>
              {item.gallery.map((g, i) => (
                <Reveal
                  key={g.src}
                  as="button"
                  onClick={() => setLb(i)}
                  className="flex cursor-zoom-in flex-col gap-2 rounded-3xl border p-2 text-left hover:border-[var(--accentLine)]"
                  style={{ background: "var(--surface)", borderColor: "var(--line)" }}
                >
                  <span
                    className="group relative block overflow-hidden rounded-2xl"
                    style={{ aspectRatio: isP ? "16/10" : "4/3", background: frameBg(g) }}
                  >
                    <Image
                      src={g.src}
                      alt={g.cap}
                      fill
                      sizes="(min-width: 640px) 380px, 100vw"
                      style={{ objectFit: g.fit }}
                    />
                  </span>
                  <span className="flex gap-2 px-2 pb-2 pt-1 text-sm" style={{ lineHeight: "20px", color: "var(--muted)" }}>
                    <span className="mono text-xs font-medium" style={{ lineHeight: "20px", color: "var(--accentText)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {g.cap}
                  </span>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {item.arch.length > 0 && (
          <section data-h="architecture" className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 pb-16 pt-8" style={{ scrollMarginTop: 96 }}>
            <Reveal as="h2" className={h2Cls} style={{ lineHeight: "36px", letterSpacing: "-0.03em", color: "var(--fg)" }}>
              Architecture
            </Reveal>
            {item.arch.map((g, i) => (
              <Reveal
                key={g.src}
                as="button"
                onClick={() => setLb(item.gallery.length + i)}
                className="flex cursor-zoom-in flex-col gap-2 rounded-3xl border p-2 text-left"
                style={{ background: "var(--surface)", borderColor: "var(--line)" }}
              >
                <span className="block overflow-hidden rounded-2xl bg-white">
                  {/* Diagrams have arbitrary aspect ratios; let the browser size them. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={g.cap} className="block w-full object-contain" style={{ maxHeight: 640 }} />
                </span>
                <span className="px-2 pb-2 pt-1 text-sm" style={{ lineHeight: "20px", color: "var(--muted)" }}>
                  {g.cap}
                </span>
              </Reveal>
            ))}
          </section>
        )}

        <Link
          href={`${next.base}/${next.slug}`}
          onMouseEnter={() => setNextHover(true)}
          onMouseLeave={() => setNextHover(false)}
          className="block overflow-hidden border-t"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-6 px-6 pb-20 pt-16">
            <div className="flex min-w-0 flex-col gap-3">
              <span className={factLabel} style={{ letterSpacing: ".12em", color: "var(--muted)" }}>
                {isP ? "Next project" : "Next hackathon"}
              </span>
              <span
                className="font-semibold"
                style={{
                  fontSize: "clamp(48px,9vw,112px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.05em",
                  color: nextHover ? "var(--accentText)" : "var(--fg)",
                  transition: "color 600ms var(--ease)",
                }}
              >
                {next.title}
              </span>
            </div>
            <span
              className="flex size-[72px] flex-none items-center justify-center rounded-full text-black"
              style={{
                background: "var(--accent)",
                transform: `rotate(${nextHover ? 45 : 0}deg)`,
                transition: "transform 700ms var(--ease)",
              }}
            >
              <i className="ph ph-arrow-up-right" style={{ fontSize: 28 }} />
            </span>
          </div>
        </Link>
      </main>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={closeLb}
          className="fixed inset-0 z-[80] box-border flex flex-col items-center justify-center gap-4 px-4 pb-6 pt-16"
          style={{ background: "var(--menuBg)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={lb}
            src={open.src}
            alt={open.cap}
            onClick={(e) => e.stopPropagation()}
            className="block rounded-2xl object-contain"
            style={{
              maxWidth: "min(1200px,100%)",
              maxHeight: "calc(100% - 96px)",
              background: open.frame === "white" ? "#fff" : "transparent",
              opacity: lbShown ? 1 : 0,
              animation: "hkpop 700ms var(--ease) both",
            }}
          />
          <div className="flex items-center gap-4 text-sm" style={{ color: "var(--fg)" }} onClick={(e) => e.stopPropagation()}>
            <LbBtn label="Previous image" icon="arrow-left" onClick={() => step(-1)} />
            <span className="max-w-[420px] text-center" style={{ textWrap: "balance" }}>
              {open.cap}{" "}
              <span className="mono text-xs" style={{ color: "var(--muted)" }}>
                {lb + 1} / {shots.length}
              </span>
            </span>
            <LbBtn label="Next image" icon="arrow-right" onClick={() => step(1)} />
          </div>
          <button
            onClick={closeLb}
            aria-label="Close"
            className="absolute right-4 top-4 flex size-11 cursor-pointer items-center justify-center rounded-full border-0"
            style={{ background: "var(--fg)", color: "var(--bg)" }}
          >
            <i className="ph ph-x" style={{ fontSize: 18 }} />
          </button>
        </div>
      )}
    </>
  );
}

function LbBtn({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex size-11 cursor-pointer items-center justify-center rounded-full border"
      style={{ borderColor: "var(--line)", background: "var(--surface)", color: "var(--fg)" }}
    >
      <i className={`ph ph-${icon}`} style={{ fontSize: 18 }} />
    </button>
  );
}
