'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers fire resize events when the address bar shows/hides as the
// page scrolls. ScrollTrigger's default behavior treats those as real
// viewport resizes and re-measures pinned sections mid-scroll, which is what
// made the pinned ProjectCarousel (and other pin:true sections) finish their
// animation early and then hold on a "blank" frame for the rest of their
// pinned scroll distance on phones. This tells ScrollTrigger to ignore
// address-bar-driven resizes and only react to real ones (orientation
// changes, actual window resizing).
ScrollTrigger.config({ ignoreMobileResize: true });

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Pinned sections (e.g. ProjectCarousel) reserve scroll distance via a
    // spacer sized from the document's layout at the last ScrollTrigger
    // refresh. ignoreMobileResize above stops that from re-running on every
    // address-bar show/hide, but content that loads in after that first
    // measurement — lazy images further down the page, webfonts swapping in
    // and reflowing text — still genuinely changes the document's height.
    // Without picking that up, the spacer/pin math goes stale and later
    // sections (the Footer, most visibly) can end up unreachable. Watch the
    // real content height directly instead of relying on resize events.
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const scheduleRefresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    const resizeObserver = new ResizeObserver(scheduleRefresh);
    resizeObserver.observe(document.body);

    // If we arrived with a #hash (e.g. the nav menu's "Experience" link from
    // another page), the browser jumps there immediately — before the pinned
    // sections above it (ProjectCarousel, Achievements) have registered their
    // pin-spacers and inflated the page's real height. That lands us where
    // the target WAS, not where it ends up. Re-scroll once GSAP has settled.
    const hashId = window.location.hash.slice(1);
    const hashTimer = hashId
      ? setTimeout(() => {
          ScrollTrigger.refresh();
          const target = document.getElementById(hashId);
          if (target) lenis.scrollTo(target, { immediate: true });
        }, 150)
      : undefined;

    return () => {
      clearTimeout(refreshTimer);
      resizeObserver.disconnect();
      clearTimeout(hashTimer);
      gsap.ticker.remove(tick);
      // Reset native scroll before teardown — otherwise whatever deep scrollY
      // Lenis left the page at (e.g. mid-way through the pinned carousel)
      // carries straight into the next route and gets clamped to its bottom.
      lenis.scrollTo(0, { immediate: true });
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
