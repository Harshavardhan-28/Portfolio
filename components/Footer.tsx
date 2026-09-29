"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EMAIL, footSocials } from "@/lib/site";
import { useVisibleScroll } from "@/lib/hooks";

const TAGLINE = ["Always", "building", "the", "future."];
const EASE = "cubic-bezier(0.32,0.72,0,1)";

const linkCls = "hover-accent text-base";
const headCls = "mono text-xs font-medium uppercase";

const IST = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** What it's like in Mumbai right now, from the IST time. */
function dayPhase(hour: number, minute: number) {
  const m = hour * 60 + minute;
  if (m >= 5 * 60 && m < 8 * 60)
    return { icon: "ph-sun-horizon", color: "#f5b301", anim: "tod-horizon", label: "Morning in Mumbai" };
  if (m >= 8 * 60 && m < 17 * 60)
    return { icon: "ph-sun", color: "#f5a300", anim: "tod-sun", label: "Daytime in Mumbai" };
  if (m >= 17 * 60 && m < 19 * 60 + 15)
    return { icon: "ph-sun-horizon", color: "#ff6b35", anim: "tod-horizon", label: "Sunset in Mumbai" };
  if (m >= 19 * 60 + 15)
    return { icon: "ph-moon", color: "#8b9bff", anim: "tod-moon", label: "Evening in Mumbai" };
  return { icon: "ph-bed", color: "#8b9bff", anim: "tod-bed", label: "Probably asleep" };
}

function useIstTime() {
  const [now, setNow] = useState<{ time: string; hour: number; minute: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const parts = IST.formatToParts(new Date());
      const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0) % 24;
      const hour = get("hour");
      const minute = get("minute");
      setNow({ time: IST.format(new Date()), hour, minute });
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function Footer({ isHome = false }: { isHome?: boolean }) {
  const now = useIstTime();
  const phase = now ? dayPhase(now.hour, now.minute) : null;
  const taglineRef = useRef<HTMLParagraphElement>(null);

  // Words light up one by one as the tagline scrolls into the lower part of the screen.
  useVisibleScroll(taglineRef, () => {
    const cut = window.innerHeight * 0.72;
    taglineRef.current?.querySelectorAll<HTMLElement>("[data-word]").forEach((w) => {
      w.style.opacity = w.getBoundingClientRect().top < cut ? "1" : "0.28";
    });
  });

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const nav: [string, string][] = [
    ["Home", "/"],
    ["About", "/#about"],
    ["Projects", "/projects"],
    ["Hackathons", "/achievements"],
    ["Experience", "/#experience"],
  ];

  return (
    <footer
      className="box-border flex flex-col gap-16 overflow-hidden border-t px-6 py-24 md:mx-auto md:max-w-[1200px]"
      style={{ containerType: "inline-size", borderColor: "var(--line)" }}
    >
      <div className="flex flex-wrap items-end justify-between gap-10">
        <p
          ref={taglineRef}
          className="m-0 flex max-w-[560px] flex-wrap gap-x-3 gap-y-1 text-5xl font-semibold leading-none"
          style={{ letterSpacing: "-0.045em" }}
        >
          {TAGLINE.map((w, i) => (
            <span
              key={w}
              data-word=""
              style={{
                color: i === 1 ? "var(--accentText)" : "var(--fg)",
                opacity: 0.28,
                transition: `opacity 700ms ${EASE}`,
              }}
            >
              {w}
            </span>
          ))}
        </p>
        <div className="flex max-w-[360px] flex-[1_1_280px] flex-col gap-4">
          <span className="text-base" style={{ color: "var(--muted)", textWrap: "pretty" }}>
            Open to internships and full time roles in software, data and ML.
          </span>
        </div>
      </div>

      <div
        className="grid gap-x-6 gap-y-10 border-t pt-10"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", borderColor: "var(--line)" }}
      >
        <div className="flex flex-col items-start gap-3">
          <span className={headCls} style={{ letterSpacing: ".1em", color: "var(--muted)" }}>Navigate</span>
          {nav.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={(e) => {
                if (isHome && href === "/") {
                  e.preventDefault();
                  scrollTop();
                }
              }}
              className={linkCls}
              style={{ color: "var(--fg)" }}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-start gap-3">
          <span className={headCls} style={{ letterSpacing: ".1em", color: "var(--muted)" }}>Work</span>
          {["PRISM", "Raseed", "Job Hunter", "Cloak402"].map((n, i) => (
            <Link
              key={n}
              href={["/projects/prism", "/projects/raseed", "/projects/job-hunter", "/projects/cloak402"][i]}
              className={linkCls}
              style={{ color: "var(--fg)" }}
            >
              {n}
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-start gap-3">
          <span className={headCls} style={{ letterSpacing: ".1em", color: "var(--muted)" }}>Socials</span>
          {footSocials.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className={linkCls} style={{ color: "var(--fg)" }}>
              {s.name}
            </a>
          ))}
        </div>
        <div className="flex flex-col items-start gap-3">
          <span className={headCls} style={{ letterSpacing: ".1em", color: "var(--muted)" }}>Contact</span>
          <a href={`mailto:${EMAIL}`} className={linkCls} style={{ color: "var(--fg)" }}>
            Mail
          </a>
          <a href="/Harshavardhan_Khamkar_Resume.pdf" download className={linkCls} style={{ color: "var(--fg)" }}>
            Resume (PDF)
          </a>
          <span className="flex items-center gap-2 text-base" style={{ color: "var(--muted)" }}>
            {phase ? (
              <span className="tod-clock relative flex" title={phase.label}>
                <i
                  className={`tod-icon ph-fill ${phase.icon} ${phase.anim}`}
                  role="img"
                  aria-label={phase.label}
                  style={{ fontSize: 18, color: phase.color, display: "block" }}
                />
                {phase.icon === "ph-bed" &&
                  [0, 1, 2].map((n) => (
                    <span key={n} aria-hidden="true" className="tod-z" style={{ animationDelay: `${n}s` }}>
                      z
                    </span>
                  ))}
              </span>
            ) : (
              <span className="size-[18px]" />
            )}
            Mumbai, {now?.time} IST
          </span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="-mx-2 select-none whitespace-nowrap text-center font-bold"
        style={{ fontSize: "26.5cqw", lineHeight: 0.8, letterSpacing: "-0.06em", color: "var(--accentText)" }}
      >
        Khamkar
      </div>

      <div
        className="mono flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t pt-6 text-xs"
        style={{ borderColor: "var(--line)", color: "var(--muted)" }}
      >
        <span>© 2026 Harshavardhan Khamkar. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <span>Privacy policy</span>
          <span>Terms</span>
          <button
            onClick={scrollTop}
            className="mono flex h-8 cursor-pointer items-center gap-1 rounded-full border bg-transparent px-3 text-xs"
            style={{ borderColor: "var(--line)", color: "var(--fg)" }}
          >
            Back to top
            <i className="ph ph-arrow-up" style={{ fontSize: 14 }} />
          </button>
        </div>
      </div>
    </footer>
  );
}
