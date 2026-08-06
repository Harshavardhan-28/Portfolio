"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: 1, title: "Raseed", category: "Fintech", color: "#00ff41" },
  { id: 2, title: "Monte Carlo", category: "DeFi", color: "#ff0055" },
  { id: 3, title: "Nayak", category: "Agentic AI", color: "#00ccff" },
];

export default function ProjectCarousel() {
  const container = useRef(null);
  const slider = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!slider.current) return;

    const totalScroll = slider.current.scrollWidth - window.innerWidth;

    gsap.to(slider.current, {
      x: -totalScroll,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "+=2200", // Adjusted for 3 projects
        pin: true,     // Locks the screen in place
        scrub: 1,      // Links animation to scrollbar
      },
    });
  }, { scope: container });

  return (
    <section ref={container} className="h-screen overflow-hidden bg-transparent relative z-20">
      {/* Title */}
      <div className="absolute top-24 left-10 md:left-20 z-30 pointer-events-none mix-blend-difference">
        <h2 className="text-4xl md:text-6xl font-black uppercase text-white">
          Selected <br /> <span className="text-transparent stroke-white" style={{ WebkitTextStroke: "1px white" }}>Works</span>
        </h2>
      </div>

      {/* The Sliding Container */}
      <div ref={slider} className="flex h-full w-max items-center pl-[20vw]">
        {projects.map((project) => (
          <div key={project.id} className="relative w-[85vw] md:w-[70vw] h-[60vh] md:h-[70vh] mr-20 flex-shrink-0 group cursor-pointer">

            {/* Project Card */}
            <div className="w-full h-full bg-[#111] border border-white/10 relative overflow-hidden transition-all duration-500 group-hover:border-[#00ff41]">

              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-9xl opacity-10 font-black">{project.id}</span>
              </div>

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
                <span className="text-[#00ff41] text-sm font-bold uppercase tracking-widest mb-2 block">{project.category}</span>
                <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {project.title}
                </h3>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
