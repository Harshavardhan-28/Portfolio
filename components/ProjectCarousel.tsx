"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

const HOME_PREVIEW_COUNT = 3;

export default function ProjectCarousel() {
  const container = useRef(null);
  const slider = useRef<HTMLDivElement>(null);
  const previewProjects = projects.slice(0, HOME_PREVIEW_COUNT);
  const hasMore = projects.length > HOME_PREVIEW_COUNT;

  useGSAP(() => {
    if (!slider.current) return;

    // Measured lazily via functions + invalidateOnRefresh so the travel
    // distance and the matching pin length are recomputed on every
    // ScrollTrigger.refresh() (rotation, breakpoint change, late-loading
    // content) instead of being frozen at whatever the first layout was.
    const totalScroll = () =>
      slider.current ? slider.current.scrollWidth - window.innerWidth : 0;

    gsap.to(slider.current, {
      x: () => -totalScroll(),
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: () => `+=${totalScroll()}`, // Scales with however many projects exist
        pin: true,     // Locks the screen in place
        scrub: 1,      // Links animation to scrollbar
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  }, { scope: container });

  return (
    <section id="projects" ref={container} className="h-screen overflow-hidden bg-transparent relative z-20">
      {/* Title */}
      <div className="absolute top-24 left-10 md:left-20 z-30 pointer-events-none mix-blend-difference">
        <h2 className="text-4xl md:text-6xl font-black uppercase text-white">
          Selected <br /> <span className="text-transparent stroke-white" style={{ WebkitTextStroke: "1px white" }}>Works</span>
        </h2>
      </div>

      {/* The Sliding Container */}
      <div ref={slider} className="flex h-full w-max items-center pl-[20vw]">
        {previewProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="relative w-[85vw] md:w-[70vw] h-[60vh] md:h-[70vh] mr-20 flex-shrink-0 group cursor-pointer block"
          >
            {/* Project Card */}
            <div className="w-full h-full bg-[#111] border border-white/10 relative overflow-hidden transition-all duration-500 group-hover:border-[#00ff41]">

              {/* Image / Placeholder */}
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 768px) 70vw, 85vw"
                  className="object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-9xl opacity-10 font-black text-[#00ff41]">{project.title.charAt(0)}</span>
                </div>
              )}

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
                <span className="text-[#00ff41] text-sm font-bold uppercase tracking-widest mb-2 block">{project.category}</span>
                <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {project.title}
                </h3>
              </div>

            </div>
          </Link>
        ))}

        {hasMore && (
          <Link
            href="/projects"
            className="relative w-[85vw] md:w-[70vw] h-[60vh] md:h-[70vh] mr-20 flex-shrink-0 group cursor-pointer block"
          >
            <div className="w-full h-full bg-[#111] border border-white/10 relative overflow-hidden transition-all duration-500 group-hover:border-[#00ff41] flex flex-col items-center justify-center gap-6">
              <span className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-[#00ff41] text-[#00ff41] transition-all duration-300 group-hover:bg-[#00ff41] group-hover:text-black group-hover:scale-110">
                <ArrowRight className="w-8 h-8 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic text-center">
                View All <br /> <span className="text-[#00ff41]">Projects</span>
              </h3>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
