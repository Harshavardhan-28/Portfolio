"use client";

import { useEffect, useRef, useState } from "react";
import { useIsDark, useMedia, useReducedMotion, useVisibleScroll, useWide } from "@/lib/hooks";
import Reveal from "@/components/Reveal";

type BirdHandle = {
  setTheme: (dark: boolean) => void;
  setScroll: (p: number) => void;
  dispose: () => void;
};

/** Hero: the name is drawn by a flock of tiny birds on a canvas. */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handle = useRef<BirdHandle | null>(null);
  const dark = useIsDark();
  const wide = useWide();
  const touch = useMedia("(hover: none)");
  const reduce = useReducedMotion();
  const [heroH, setHeroH] = useState(800);

  // Fill the viewport (never shorter than the wordmark needs).
  // Mobile URL bars resize the viewport while scrolling; ignore small height
  // changes so the canvas isn't rebuilt (and the flock restarted) each time.
  useEffect(() => {
    let lastW = 0;
    const measure = () => {
      const w = window.innerWidth;
      const h = Math.max(w >= 700 ? 760 : 640, window.innerHeight);
      setHeroH((cur) => (w !== lastW || Math.abs(h - cur) > 160 ? h : cur));
      lastW = w;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const isDark = document.documentElement.dataset.theme !== "light";
    import("@/lib/birds").then((m) =>
      m.mountBirds(canvasRef.current, { dark: isDark, reduceMotion: reduce }).then((h: BirdHandle) => {
        if (cancelled) return h.dispose();
        handle.current = h;
      })
    );
    return () => {
      cancelled = true;
      handle.current?.dispose();
      handle.current = null;
    };
  }, [reduce]);

  useEffect(() => handle.current?.setTheme(dark), [dark]);

  // Birds drift upward and fade as the hero scrolls away (only while it's on screen).
  useVisibleScroll(sectionRef, () => handle.current?.setScroll(window.scrollY / (heroH * 0.9)));

  return (
    <section
      ref={sectionRef}
      data-sec="home"
      className="relative box-border flex min-h-[640px] flex-col justify-end overflow-hidden px-6 pb-28"
      style={{ height: heroH }}
    >
      {/* Faint, diffuse green glow centred behind the name (same centre line the birds settle on). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2"
        style={{
          top: heroH * (wide ? 0.36 : 0.34),
          width: "min(110vw, 1300px)",
          height: wide ? "min(46vh, 460px)" : "min(34vh, 300px)",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(closest-side, var(--glow) 0%, transparent 100%)",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 block size-full"
        style={{ touchAction: "pan-y" }}
      />
      <span
        className="mono pointer-events-none absolute inset-x-0 flex items-center justify-center gap-2 text-xs"
        style={{ top: Math.round(heroH * (wide ? 0.6 : 0.5)), color: "var(--muted)" }}
      >
        <i className="ph ph-bird" style={{ fontSize: 14 }} />
        {touch ? "touch the flock" : "move your cursor through the flock"}
      </span>
      <div className="pointer-events-none relative flex flex-col gap-4">
        <Reveal
          className="mono flex items-center gap-2 text-xs font-medium uppercase"
          style={{ letterSpacing: ".12em", color: "var(--accentText)" }}
        >
          <span className="pulse-dot size-2 rounded-full" style={{ background: "var(--accent)" }} />
          Software engineer / Mumbai
        </Reveal>
        <h1 className="sr-only">
          <span>Harshavardhan</span> <span>Khamkar</span>
        </h1>
        <Reveal
          as="p"
          delay={160}
          className="m-0 max-w-[340px] text-base"
          style={{ lineHeight: "24px", color: "var(--muted)", textWrap: "pretty" }}
        >
          I build ML systems, data pipelines and agentic AI products. Two time hackathon winner.
        </Reveal>
        <Reveal delay={240} className="pointer-events-auto mt-2 flex items-center gap-4">
          <button
            onClick={() =>
              document
                .querySelector<HTMLElement>('[data-sec="projects"]')
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="press flex h-12 cursor-pointer items-center gap-2 rounded-full border-0 px-5 text-base font-semibold text-black"
            style={{ background: "var(--accent)", transition: "transform 500ms var(--ease)" }}
          >
            See my work
            <i className="ph ph-arrow-down" style={{ fontSize: 18 }} />
          </button>
          <a
            href="/Harshavardhan_Khamkar_Resume.pdf"
            download
            className="flex h-12 items-center gap-2 text-sm font-medium"
            style={{ color: "var(--fg)" }}
          >
            <i className="ph ph-file-text" style={{ fontSize: 18 }} />
            Resume
          </a>
        </Reveal>
      </div>
    </section>
  );
}
