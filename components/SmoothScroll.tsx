'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
