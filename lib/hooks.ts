"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

/** Subscribe to a media query without an effect + setState round trip. */
export function useMedia(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

export const useWide = (min = 700) => useMedia(`(min-width: ${min}px)`);
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");
export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");

const subscribeTheme = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};

/** Current theme, read from <html data-theme>. */
export function useIsDark() {
  return useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.dataset.theme !== "light",
    () => true
  );
}

export function toggleTheme() {
  const html = document.documentElement;
  const nextDark = html.dataset.theme === "light";
  if (nextDark) delete html.dataset.theme;
  else html.dataset.theme = "light";
  try {
    localStorage.setItem("hk-theme", nextDark ? "dark" : "light");
  } catch {}
}

/** True once the element has scrolled into view (one-shot). */
export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
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
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** Fires once after mount so first paint can render the "before" state. */
export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/**
 * Runs `cb` (rAF-throttled) on scroll/resize, but only while `ref` is within
 * `margin` px of the viewport. Sections that are far off-screen cost nothing.
 */
export function useVisibleScroll(
  ref: RefObject<Element | null>,
  cb: () => void,
  enabled = true,
  margin = 200
) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let ticking = false;
    let attached = false;
    const run = () => {
      ticking = false;
      cbRef.current();
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(run);
    };
    const attach = () => {
      if (attached) return;
      attached = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      run();
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? attach() : detach()), {
      rootMargin: `${margin}px 0px`,
    });
    io.observe(el);
    return () => {
      io.disconnect();
      detach();
    };
  }, [ref, enabled, margin]);
}
