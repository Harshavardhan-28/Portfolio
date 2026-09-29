/* eslint-disable @next/next/no-img-element */
"use client";

import { techStack } from "@/lib/techstack";
import { useIsDark } from "@/lib/hooks";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function TechStack() {
  const dark = useIsDark();
  // Simple Icons tint: pale on dark surfaces, near-black on light ones.
  const ink = dark ? "e6e6e6" : "1c1c1c";

  return (
    <section data-sec="stack" className="flex flex-col gap-8 px-6 py-16 md:mx-auto md:max-w-[1200px]">
      <SectionHeading num="02" eyebrow="Tech stack" title="My tech stack" />
      <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
        {techStack.map((cat) => (
          <Reveal
            key={cat.name}
            className="flex flex-col gap-3 rounded-3xl border p-4"
            style={{ background: "var(--surface)", borderColor: "var(--line)" }}
          >
            <div
              className="mono flex items-center justify-between text-xs font-medium uppercase"
              style={{ letterSpacing: ".08em" }}
            >
              <span style={{ color: "var(--fg)" }}>{cat.name}</span>
              <span style={{ color: "var(--muted)" }}>{String(cat.items.length).padStart(2, "0")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((it) => (
                <span
                  key={it.label}
                  className="flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium"
                  style={{ background: "var(--surface2)", color: "var(--fg)" }}
                >
                  <img
                    src={`https://cdn.simpleicons.org/${it.logo}/${ink}`}
                    alt=""
                    width={16}
                    height={16}
                    loading="lazy"
                    decoding="async"
                    className="block size-4"
                  />
                  {it.label}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
