"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Extra attribute hook, e.g. the portrait's grayscale → colour reveal. */
  photo?: boolean;
  [key: string]: unknown;
};

/**
 * Blur-fade reveal: content starts 48px low, blurred and transparent, then
 * eases in the first time it scrolls into view. Applied imperatively (not via
 * state) so server-rendered markup stays visible if JS never runs.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
  style,
  photo,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const img = photo ? el.querySelector("img") : null;
    el.style.opacity = "0";
    el.style.transform = "translateY(48px)";
    el.style.filter = "blur(8px)";
    el.style.transition =
      "opacity 900ms var(--ease), transform 900ms var(--ease), filter 900ms var(--ease)";

    let timer: ReturnType<typeof setTimeout>;
    let cleanup: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        timer = setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "none";
          el.style.filter = "none";
          if (img) {
            img.style.filter = "grayscale(0)";
            img.style.transform = "scale(1)";
          }
          // Drop the inline animation state so the element stops holding a
          // compositor layer and regains its own hover/press transitions.
          cleanup = setTimeout(() => {
            el.style.transition = "";
            el.style.transform = "";
            el.style.filter = "";
            el.style.opacity = "";
          }, 1000);
        }, delay);
        io.disconnect();
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, [delay, photo]);

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}
