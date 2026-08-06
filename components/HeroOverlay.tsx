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

      // Split + Blur + Fade Out
      tl.to(line1Ref.current, {
        x: -250,
        y: -100,
        opacity: 0,        // FADE OUT completely
        filter: "blur(10px)" // Add motion blur
      }, 0)
      .to(line2Ref.current, {
        x: 250,
        y: 100,
        opacity: 0,        // FADE OUT completely
        filter: "blur(10px)"
      }, 0);
    },
    { scope: containerRef }
  );

  return (
    <div
        ref={containerRef}
        className="h-screen w-full flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="flex flex-col items-center justify-center">
        <h1
            ref={line1Ref}
            className="block text-[12vw] md:text-[10vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent stroke-white will-change-[transform,opacity,filter]"
            style={{ WebkitTextStroke: "2px white" }}
        >
            Harshavardhan
        </h1>
        <h1
            ref={line2Ref}
            className="block text-[12vw] md:text-[10vw] font-black uppercase leading-[0.85] tracking-tighter text-[#00ff41] will-change-[transform,opacity,filter]"
        >
            Khamkar
        </h1>
      </div>
    </div>
  );
}
