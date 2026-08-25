"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Array order = fan order, left to right: item 0 is the leftmost (outermost)
// card, the last item is the rightmost, and the middle two — indices 2 and 3
// — are the raised center pair. Reorder this list to reorder the fan.
const images = [
  "/images/socials/river-portrait.jpg",
  "/images/socials/ethmumbai-portrait.jpg",
  "/images/socials/sunrise-trek.jpg",
  "/images/socials/social-card.JPG",
  "/images/socials/beach-portrait.jpg",
  "/images/socials/trek.jpg",
];
// A fractional midpoint (2.5 for 6 cards) keeps the spread symmetric with no
// single "center" card — the two middle cards sit at ±0.5 instead of one
// card at 0, giving the raised center *pair* rather than a lone peak.
const centerIndex = (images.length - 1) / 2;

export default function SocialGallery() {
  const container = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(() => {
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
        const fanEl = cardsRef.current[Math.floor(centerIndex)]?.parentElement;
        const fanW = fanEl?.clientWidth ?? window.innerWidth;
        const cardW = cardsRef.current[Math.floor(centerIndex)]?.offsetWidth ?? 240;

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
    <section ref={container} className="py-8 sm:py-10 md:py-12 bg-black overflow-hidden relative z-20 h-screen flex flex-col items-center justify-center">

      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 relative z-10 px-6">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white leading-[0.9] sm:leading-[0.8]">
          What's Up <br/>
          <span className="text-transparent stroke-white font-serif italic" style={{ WebkitTextStroke: "1px #fff" }}>On Socials</span>
        </h2>
      </div>

      {/* The Fan Container */}
      <div
        className="relative w-full max-w-350 h-70 sm:h-88 md:h-105 flex justify-center items-center mt-4 sm:mt-6"
        style={{ perspective: 1200 }}
      >
        {images.map((src, i) => {
           // Calculate Z-Index: the center pair is highest, sides drop down
           const zIndex = 10 - Math.abs(i - centerIndex);

           return (
            <div
              key={i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="absolute w-36 h-56 sm:w-46 sm:h-72 lg:w-54 lg:h-84 bg-neutral-950 rounded-[36px] border border-white/10 overflow-hidden shadow-2xl origin-bottom cursor-pointer group will-change-transform"
              style={{ zIndex, transformStyle: "preserve-3d" }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={src}
                  alt="Social post"
                  fill
                  sizes="(min-width: 1024px) 216px, (min-width: 640px) 184px, 144px"
                  className="object-cover"
                  priority={Math.abs(i - centerIndex) < 1}
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
              </div>
            </div>
           );
        })}
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-4 sm:mt-6 relative z-10">
         <p className="text-gray-500 font-serif italic text-lg sm:text-xl mb-3 sm:mb-4">Follow me on social media</p>
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
