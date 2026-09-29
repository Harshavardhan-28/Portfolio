import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function SectionHeading({
  num,
  eyebrow,
  title,
  className = "",
  balance = false,
  href,
  hrefLabel,
}: {
  num: string;
  eyebrow: string;
  title: string;
  className?: string;
  balance?: boolean;
  /** When set, a round arrow beside the heading links to the section's full page. */
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <Reveal className={`flex items-end justify-between gap-4 ${className}`}>
      <div className="flex min-w-0 flex-col gap-3">
        <span
          className="mono text-xs font-medium uppercase"
          style={{ letterSpacing: ".12em", color: "var(--accentText)" }}
        >
          {num} / {eyebrow}
        </span>
        <h2
          className="m-0 text-4xl font-semibold"
          style={{
            lineHeight: "40px",
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            textWrap: balance ? "balance" : undefined,
          }}
        >
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          aria-label={hrefLabel}
          title={hrefLabel}
          className="group flex size-12 flex-none items-center justify-center rounded-full text-black active:scale-95"
          style={{ background: "var(--accent)" }}
        >
          <i
            className="ph ph-arrow-up-right transition-transform duration-500 group-hover:rotate-45"
            style={{ fontSize: 22 }}
          />
        </Link>
      )}
    </Reveal>
  );
}
