"use client";

import { useRef } from "react";
import { experience } from "@/lib/experience";
import { useVisibleScroll } from "@/lib/hooks";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // The green line fills as the timeline scrolls through the viewport.
  useVisibleScroll(timelineRef, () => {
    const tl = timelineRef.current;
    const fill = fillRef.current;
    if (!tl || !fill) return;
    const r = tl.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (window.innerHeight * 0.65 - r.top) / r.height));
    fill.style.height = `calc(${p} * (100% - 16px))`;
  });

  return (
    <section data-sec="experience" className="flex flex-col gap-8 px-6 py-16 md:mx-auto md:max-w-[1200px]">
      <SectionHeading num="05" eyebrow="Experience" title="Work experience" />
      <div ref={timelineRef} className="relative flex flex-col gap-8 pl-8 md:max-w-[720px]">
        <div className="absolute bottom-2 left-[7px] top-2 w-0.5 rounded-sm" style={{ background: "var(--line)" }} />
        <div
          ref={fillRef}
          className="absolute left-[7px] top-2 h-0 w-0.5 rounded-sm"
          style={{ background: "var(--accent)" }}
        />
        {experience.map((job, i) => (
          <Reveal
            key={job.role + job.org}
            className="relative flex flex-col gap-2 rounded-[20px] border p-4"
            style={{ background: "var(--surface)", borderColor: "var(--line)" }}
          >
            <span
              className={`absolute -left-8 top-5 box-border size-4 rounded-full border-2 ${i === 0 ? "pulse-dot" : ""}`}
              style={{ borderColor: "var(--accent)", background: i === 0 ? "#00FF41" : "var(--bg)" }}
            />
            <span
              className="mono text-xs font-medium uppercase"
              style={{ letterSpacing: ".08em", color: "var(--accentText)" }}
            >
              {job.date}
            </span>
            <h3 className="m-0 text-xl font-semibold" style={{ lineHeight: "28px", letterSpacing: "-0.01em", color: "var(--fg)" }}>
              {job.role}
            </h3>
            <span className="text-base" style={{ color: "var(--muted)" }}>
              {job.org}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
