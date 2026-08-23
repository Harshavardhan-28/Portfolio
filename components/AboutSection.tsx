"use client";

import { useRef } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current || !textRef.current || !imageWrapperRef.current) return;
    
    // Simple scroll animation (no pinning)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%", // Start when top of section hits 80% of viewport
        end: "center center", // End when center of section hits center of viewport
        scrub: 1,
      }
    });

    // Image fades in and slides up
    tl.fromTo(
      imageWrapperRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, ease: "power2.out" },
      0
    );

    // Text fades in from the left
    tl.fromTo(
      textRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, ease: "power2.out" },
      0.1 // start slightly after
    );

  }, { scope: container });

  return (
    <section ref={container} className="min-h-screen md:h-screen w-full flex items-center relative z-10 overflow-hidden pointer-events-none py-28 md:py-0">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12 w-full h-full relative z-20">

        {/* LEFT COLUMN: The Text */}
        <div ref={textRef} className="flex flex-col space-y-6 pointer-events-auto z-30">
          {/* Narrower cap than the full-width headings: from md up this sits
              in a half-width grid column. */}
          <h2 className="text-[clamp(2.25rem,7vw,6rem)] font-black uppercase leading-none">
            About <br /> <span className="text-[#00ff41]">Myself</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-md">
            I build immersive digital experiences that blend high-performance engineering with cinematic aesthetics.
          </p>
          <div className="pt-4">
            <a
              href="/Harshavardhan_Khamkar_Resume.pdf"
              download
              className="inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 border-2 border-[#00ff41] text-[#00ff41] font-bold tracking-widest uppercase hover:bg-[#00ff41] hover:text-black transition-all duration-300 rounded-full w-fit hover:shadow-[0_0_20px_rgba(0,255,65,0.5)]"
            >
              <span>Download Resume</span>
              <Download className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Animated Image */}
        <div className="hidden md:flex justify-center items-center pointer-events-auto z-10 w-full">
          <div 
            ref={imageWrapperRef}
            className="relative w-80 lg:w-96 h-[28rem] lg:h-[34rem] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,255,65,0.3)] border border-[#00ff41]/20 will-change-transform origin-center"
          >
            <Image 
              src="/images/Harsh_Passport_photo.jpeg"
              alt="Harsh Passport Photo"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
