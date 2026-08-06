'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WorkGallery() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 1, title: 'Project One', category: 'Web Design' },
    { id: 2, title: 'Project Two', category: '3D Experience' },
    { id: 3, title: 'Project Three', category: 'Mobile App' },
    { id: 4, title: 'Project Four', category: 'Brand Identity' },
  ];

  useGSAP(() => {
    if (!galleryRef.current || !triggerRef.current) return;

    gsap.to(galleryRef.current, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: triggerRef.current, // Pin the containing section
        pin: true,
        scrub: 1,
        // The scroll length determines the speed. 
        // "end" means: scroll for 3000px to complete this animation
        end: '+=3000', 
      },
    });
  }, []);

  return (
    <section ref={triggerRef} className="relative h-screen overflow-hidden bg-[#050505]">
      <div 
        ref={galleryRef} 
        className="flex h-full w-[400vw] flex-row"
        style={{ width: `${sections.length * 100}vw` }}
      >
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="flex h-screen w-screen flex-col items-center justify-center border-r border-[#00ff41]/20 relative"
          >
             {/* Background Number */}
             <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-[#00ff41]/5 select-none z-0">
                {index + 1}
             </span>

             <div className="z-10 text-center space-y-4">
                <h3 className="text-[#00ff41] text-xl font-mono tracking-widest uppercase">
                    {section.category}
                </h3>
                <h2 className="text-white text-6xl md:text-8xl font-black uppercase tracking-tighter">
                    {section.title}
                </h2>
                <button className="mt-8 border border-[#00ff41] text-[#00ff41] px-8 py-3 uppercase tracking-widest hover:bg-[#00ff41] hover:text-[#050505] transition-colors duration-300">
                    View Case Study
                </button>
             </div>
          </div>
        ))}
      </div>
    </section>
  );
}
