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
  "/images/socials/ethmumbai-portrait.jpg",
  "/images/socials/river-portrait.jpg",
  "/images/socials/sunrise-trek.jpg",
  "/images/socials/social-card.JPG",
  "/images/socials/beach-portrait.jpg",
  "/images/socials/trek.jpg",
];
// A fractional midpoint (2.5 for 6 cards) keeps the spread symmetric with no
// single "center" card — the two middle cards sit at ±0.5 instead of one
// card at 0, giving the raised center *pair* rather than a lone peak.
const centerIndex = (images.length - 1) / 2;

const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function SocialGallery() {
  const container = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  // Hover restores a card to its resting fan position on mouseleave. That
  // resting position must come from this same formula, not from reading the
  // card's live GSAP value at mouseenter — the entrance tween below is
  // staggered over ~1.2s per card, so a hover that starts mid-entrance would
  // otherwise capture a mid-flight snapshot as "home" and get stuck there
  // permanently once overwrite:"auto" hands y/scale/rotateY off to the hover
  // tween. Populated per-breakpoint by the matchMedia callback below.
  const fanParamsRef = useRef({ liftY: 18, scaleStep: 0.06, rotY: 14 });

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

        fanParamsRef.current = { liftY, scaleStep, rotY };

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

  // Hover lift for the fanned cards. The fan-out tween above already owns
  // each card's base x/y/rotate/scale (different value per index). The base
  // here is *computed* from the same formula the entrance tween uses, not
  // read off the card's live GSAP value — reading live state broke if a
  // hover started while that staggered entrance was still mid-flight (e.g.
  // the cursor already resting over the fan as it scrolls into view): the
  // captured "base" would be a mid-flight snapshot, and mouseleave would
  // restore the card to that wrong snapshot forever.
  const restingState = (i: number) => {
    const { liftY, scaleStep, rotY } = fanParamsRef.current;
    return {
      y: Math.abs(i - centerIndex) * liftY,
      scale: 1 - Math.abs(i - centerIndex) * scaleStep,
      rotateY: (i - centerIndex) * -rotY,
    };
  };

  const handleCardEnter = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    if (!canHover()) return;
    const card = e.currentTarget;
    const media = card.querySelector<HTMLElement>(".card-media");
    const overlay = card.querySelector<HTMLElement>(".card-overlay");
    const reduce = prefersReducedMotion();
    const { y: baseY, scale: baseScale, rotateY: baseRotateY } = restingState(i);

    card.style.zIndex = "50";
    gsap.to(card, {
      y: reduce ? baseY : baseY - 14,
      scale: reduce ? baseScale : baseScale * 1.06,
      rotateY: reduce ? baseRotateY : baseRotateY * 0.4,
      duration: 0.2,
      ease: "power2.out",
      overwrite: "auto",
    });
    if (!reduce && media) {
      gsap.to(media, { scale: 1.1, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    }
    if (overlay) {
      gsap.to(overlay, { opacity: 0.4, duration: 0.2, ease: "power2.out", overwrite: "auto" });
    }
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>, i: number, baseZIndex: number) => {
    if (!canHover()) return;
    const card = e.currentTarget;
    const media = card.querySelector<HTMLElement>(".card-media");
    const overlay = card.querySelector<HTMLElement>(".card-overlay");
    const { y: baseY, scale: baseScale, rotateY: baseRotateY } = restingState(i);

    gsap.to(card, {
      y: baseY,
      scale: baseScale,
      rotateY: baseRotateY,
      duration: 0.2,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => { card.style.zIndex = String(baseZIndex); },
    });
    if (media) {
      gsap.to(media, { scale: 1, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    }
    if (overlay) {
      gsap.to(overlay, { opacity: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" });
    }
  };

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
              onMouseEnter={(e) => handleCardEnter(e, i)}
              onMouseLeave={(e) => handleCardLeave(e, i, zIndex)}
              className="absolute w-36 h-56 sm:w-46 sm:h-72 lg:w-54 lg:h-84 bg-neutral-950 rounded-[36px] border border-white/10 overflow-hidden shadow-2xl origin-bottom cursor-pointer group will-change-transform"
              style={{ zIndex, transformStyle: "preserve-3d" }}
            >
              <div className="card-media relative w-full h-full will-change-transform">
                <Image
                  src={src}
                  alt="Social post"
                  fill
                  sizes="(min-width: 1024px) 216px, (min-width: 640px) 184px, 144px"
                  className="object-cover"
                  priority={Math.abs(i - centerIndex) < 1}
                />
                <div className="card-overlay pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
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
