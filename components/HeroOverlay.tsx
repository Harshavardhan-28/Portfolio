'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Split + Blur + Fade Out.
      // The split distance is viewport-relative: a hard ±250px is most of a
      // phone's width, which shoved the lines far outside the viewport and
      // (before the container clipped) stretched the whole document.
      const split = () => Math.min(250, window.innerWidth * 0.4);

      tl.to(line1Ref.current, {
        x: () => -split(),
        y: -100,
        opacity: 0,        // FADE OUT completely
        filter: "blur(10px)" // Add motion blur
      }, 0)
      .to(line2Ref.current, {
        x: () => split(),
        y: 100,
        opacity: 0,        // FADE OUT completely
        filter: "blur(10px)"
      }, 0);
    },
    { scope: containerRef }
  );

  // overflow-hidden below is load-bearing: the outro tween translates the two
  // name lines sideways, and without clipping here those transforms widen the
  // document itself on narrow screens. That makes mobile browsers zoom out to
  // fit, which also drags the fixed header wider than the visible viewport and
  // pushes the menu button off-screen.
  return (
    <div
        ref={containerRef}
        className="h-screen w-full flex flex-col items-center justify-center pointer-events-none overflow-hidden"
    >
      <div className="flex w-full max-w-full flex-col items-center justify-center px-4">
        <h1
            ref={line1Ref}
            className="block max-w-full text-center text-[9vw] sm:text-[9vw] md:text-[10vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent stroke-white wrap-break-word will-change-[transform,opacity,filter]"
            style={{ WebkitTextStroke: "2px white" }}
        >
            Harshavardhan
        </h1>
        <h1
            ref={line2Ref}
            className="block max-w-full text-center text-[9vw] sm:text-[9vw] md:text-[10vw] font-black uppercase leading-[0.85] tracking-tighter text-[#00ff41] wrap-break-word will-change-[transform,opacity,filter]"
        >
            Khamkar
        </h1>
      </div>
    </div>
  );
}
