"use client";

import { useEffect, useRef } from "react";
import { useIsDark, useMedia, useReducedMotion, useVisibleScroll } from "@/lib/hooks";
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
  const touch = useMedia("(hover: none)");
  const reduce = useReducedMotion();

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
  useVisibleScroll(sectionRef, () => {
    const h = sectionRef.current?.offsetHeight ?? window.innerHeight;
    handle.current?.setScroll(window.scrollY / (h * 0.9));
  });

  return (
    <section
      ref={sectionRef}
      data-sec="home"
      // Height and offsets are pure CSS (svh is stable while mobile URL bars show/hide), so the
      // hero never reflows or rebuilds the flock after hydration or when scrolling on a phone.
      className="relative box-border flex h-[max(640px,100svh)] flex-col justify-end overflow-hidden px-6 pb-28 min-[700px]:h-[max(760px,100svh)]"
    >
      {/* Faint, diffuse green glow centred behind the name (same centre line the birds settle on). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[34%] h-[min(34svh,300px)] min-[700px]:top-[36%] min-[700px]:h-[min(46svh,460px)]"
        style={{
          width: "min(110vw, 1300px)",
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
        className="mono pointer-events-none absolute inset-x-0 top-1/2 flex items-center justify-center gap-2 text-xs min-[700px]:top-[60%]"
        style={{ color: "var(--muted)" }}
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
