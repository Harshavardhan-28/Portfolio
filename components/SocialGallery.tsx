"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 7 Cards to match the reference density
const images = [1, 2, 3, 4, 5, 6, 7];

const cardImageSrc = "/social-card.JPG";

export default function SocialGallery() {
  const container = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(() => {
    const centerIndex = Math.floor(images.length / 2);

    const mm = gsap.matchMedia();

    // Every viewport must match exactly one condition. Leaving the desktop
    // range out entirely means the callback never runs there, so the cards
    // keep their default styles — all seven absolutely positioned on top of
    // each other, unfanned.
    mm.add(
      {
        isMobile: "(max-width: 639px)",
        isTablet: "(min-width: 640px) and (max-width: 1023px)",
        isDesktop: "(min-width: 1024px)",
      },
      (context) => {
        const { isMobile, isTablet } = context.conditions as {
          isMobile: boolean;
          isTablet: boolean;
          isDesktop: boolean;
        };

        // Derive the spread from the fan's real width and card size rather
        // than hard-coding px per breakpoint: a fixed value that fits at
        // 1440px pushes the outer cards past the edge at 1024px (and past the
        // viewport on tablets, which widened the document). The outer cards
        // are rotated, so their visual footprint is ~1.45x the base card
        // width, and rotating about a low origin shifts them outward too —
        // ROT_PAD covers that. Mobile keeps its hand-tuned spread: the fan is
        // meant to run past the edges there, and the section clips it.
        const ROT_PAD = 90;
        const fanEl = cardsRef.current[centerIndex]?.parentElement;
        const fanW = fanEl?.clientWidth ?? window.innerWidth;
        const cardW = cardsRef.current[centerIndex]?.offsetWidth ?? 240;

        const spreadX = isMobile
          ? 58
          : Math.max(
              40,
              Math.min(160, (fanW / 2 - cardW * 0.72 - ROT_PAD) / centerIndex)
            );
        const liftY = isMobile ? 8 : isTablet ? 13 : 18;
        const rotZ = isMobile ? 6 : isTablet ? 8 : 10;
        const rotY = isMobile ? 8 : isTablet ? 11 : 14;
        const scaleStep = isMobile ? 0.1 : isTablet ? 0.08 : 0.06;

        // 1. Initial State: All cards bunched at bottom
        gsap.set(cardsRef.current, {
          x: 0,
          y: 140,
          opacity: 0,
          rotateZ: 0,
          rotateY: 0,
          scale: 0.92,
          transformOrigin: "50% 92%",
        });

        // 2. The "Fan Out" Animation
        gsap.to(cardsRef.current, {
          scrollTrigger: {
            trigger: container.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.05,

          // --- THE TUNED MATH ---
          x: (i) => (i - centerIndex) * spreadX,
          y: (i) => Math.abs(i - centerIndex) * liftY,
          rotateZ: (i) => (i - centerIndex) * rotZ,
          rotateY: (i) => (i - centerIndex) * -rotY,
          scale: (i) => 1 - Math.abs(i - centerIndex) * scaleStep,
        });
      }
    );

    return () => mm.revert();
  }, { scope: container });

  return (
    <section ref={container} className="py-20 sm:py-24 md:py-32 bg-black overflow-hidden relative z-20 min-h-screen flex flex-col items-center">

      {/* Header */}
      <div className="text-center mb-12 relative z-10 px-6">
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase text-white leading-[0.9] sm:leading-[0.8]">
          What's Up <br/>
          <span className="text-transparent stroke-white font-serif italic" style={{ WebkitTextStroke: "1px #fff" }}>On Socials</span>
        </h2>
      </div>

      {/* The Fan Container */}
      <div
        className="relative w-full max-w-350 h-102.5 sm:h-120 md:h-150 flex justify-center items-center mt-10"
        style={{ perspective: 1200 }}
      >
        {images.map((_, i) => {
           const centerIndex = Math.floor(images.length / 2);
           // Calculate Z-Index: Center is highest, sides drop down
           const zIndex = 10 - Math.abs(i - centerIndex);

           return (
            <div
              key={i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="absolute w-52.5 h-82.5 sm:w-60 sm:h-95 lg:w-70 lg:h-110 bg-neutral-950 rounded-[36px] border border-white/10 overflow-hidden shadow-2xl origin-bottom cursor-pointer group will-change-transform"
              style={{ zIndex, transformStyle: "preserve-3d" }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={cardImageSrc}
                  alt="Social post"
                  fill
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 240px, 210px"
                  className="object-cover"
                  priority={i === Math.floor(images.length / 2)}
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
              </div>
            </div>
           );
        })}
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-10 relative z-10">
         <p className="text-gray-500 font-serif italic text-xl mb-6">Follow me on social media</p>
         <div className="flex justify-center gap-8 text-white font-bold uppercase text-sm tracking-widest">
            {[
              { name: 'X', url: 'https://x.com/hrshvrdhxn' },
              { name: 'Instagram', url: '' },
              { name: 'GitHub', url: 'https://github.com/Harshavardhan-28' },
              { name: 'LinkedIn', url: 'https://www.linkedin.com/in/harshavardhan-khamkar/' }
            ].map((social) => (
                <a key={social.name} href={social.url || '#'} target={social.url ? '_blank' : ''} rel={social.url ? 'noopener noreferrer' : ''} className="hover:text-[#00ff41] transition-colors">{social.name}</a>
            ))}
         </div>
      </div>
    </section>
  );
}
