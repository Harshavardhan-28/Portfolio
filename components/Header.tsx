"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const menuLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "#projects" },
  { label: "Hackathons", href: "#hackathons" },
  { label: "Achievements", href: "#achievements" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const previewRef = useRef(null);

  // Toggle Menu Animation
  useGSAP(() => {
    if (isMenuOpen) {
      // OPEN: Slide down and fade in content
      gsap.to(menuRef.current, {
        y: "0%",
        duration: 0.8,
        ease: "power4.inOut",
      });

      gsap.fromTo(linksRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, delay: 0.4, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(previewRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, delay: 0.6, duration: 0.8 }
      );

    } else {
      // CLOSE: Slide up
      gsap.to(menuRef.current, {
        y: "-100%",
        duration: 0.8,
        ease: "power4.inOut",
      });
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* --- THE NAVBAR (Always Visible) --- */}
      <header className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center text-white">

        {/* Left: Brand */}
        <Link href="/" className="flex flex-col uppercase leading-[0.8] tracking-tight group cursor-pointer" onClick={() => setIsMenuOpen(false)}>
          <span className="text-sm md:text-md font-medium text-neutral-300 group-hover:text-[#00ff41] transition-colors">
            Harsh
          </span>
          <span className="text-xl md:text-2xl font-black text-white group-hover:text-[#00ff41] transition-colors">
            Khamkar
          </span>
        </Link>

        {/* Center: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none md:pointer-events-auto">
           <span className="font-black text-3xl italic tracking-tighter transform -skew-x-12 inline-block border-2 border-white px-2 py-0.5">
             HK
           </span>
        </div>

        {/* Right: Toggle Button */}
        <button onClick={toggleMenu} className="group pointer-events-auto relative z-50">
          <div className={`w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 hover:scale-90 ${isMenuOpen ? 'bg-[#00ff41]' : 'hover:bg-[#00ff41]'}`}>
            {/* Animate lines to X when open */}
            <span className={`block w-5 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? 'translate-y-2 rotate-45' : 'group-hover:translate-y-1'}`}></span>
            <span className={`block w-5 h-0.5 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? '-translate-y-2 -rotate-45' : 'group-hover:-translate-y-1'}`}></span>
          </div>
        </button>
      </header>

      {/* --- THE FULLSCREEN MENU OVERLAY --- */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 w-full h-screen bg-[#0a0a0a] z-40 transform -translate-y-full text-white flex flex-col md:flex-row overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        {/* LEFT COL: Image Gallery (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 h-full items-center justify-center relative p-20">
           <div ref={previewRef} className="relative w-full h-[600px] grid grid-cols-2 gap-4">
              {/* Big Image Left */}
              <div className="row-span-2 relative rounded-2xl overflow-hidden border border-white/10 group">
                  <div className="absolute inset-0 bg-[#00ff41]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  {/* Replace with your image */}
                  <div className="w-full h-full bg-neutral-800 bg-gradient-to-br from-neutral-700 to-neutral-900 grayscale group-hover:grayscale-0 transition-all duration-500 flex items-center justify-center">
                    <span className="text-6xl font-black opacity-20">1</span>
                  </div>
              </div>
              {/* Top Right */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                   <div className="absolute inset-0 bg-[#00ff41]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                   <div className="w-full h-full bg-neutral-800 bg-gradient-to-br from-neutral-700 to-neutral-900 grayscale group-hover:grayscale-0 transition-all duration-500 flex items-center justify-center">
                     <span className="text-4xl font-black opacity-20">2</span>
                   </div>
              </div>
              {/* Bottom Right */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                   <div className="absolute inset-0 bg-[#00ff41]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                   <div className="w-full h-full bg-neutral-800 bg-gradient-to-br from-neutral-700 to-neutral-900 grayscale group-hover:grayscale-0 transition-all duration-500 flex items-center justify-center">
                     <span className="text-4xl font-black opacity-20">3</span>
                   </div>
              </div>
           </div>
        </div>

        {/* RIGHT COL: Navigation */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-10 md:px-20 relative z-10">
           {/* Decorative Background Text */}
           <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[40vh] font-black text-white/5 pointer-events-none overflow-hidden select-none">
              MENU
           </div>

           <nav className="flex flex-col space-y-2">
             {menuLinks.map((link, i) => (
               <div key={link.label} className="overflow-hidden">
                 <Link
                   href={link.href}
                   onClick={() => setIsMenuOpen(false)}
                   ref={el => {
                     linksRef.current[i] = el;
                   }}
                   className="block text-6xl md:text-8xl font-black uppercase text-transparent stroke-white hover:text-[#00ff41] transition-all duration-300 transform hover:translate-x-4"
                   style={{ WebkitTextStroke: "1px white" }}
                 >
                   {link.label}
                 </Link>
               </div>
             ))}
           </nav>

           <div className="mt-20 flex flex-col md:flex-row justify-between items-start md:items-end border-t border-white/20 pt-8 gap-6">
              <div className="flex flex-col space-y-2">
                 <p className="text-sm text-gray-500 uppercase tracking-widest">Follow Me</p>
                 <div className="flex gap-6 text-lg font-bold">
                    <a href="https://www.linkedin.com/in/harshavardhan-khamkar/" className="hover:text-[#00ff41] transition-colors">Linkedin</a>
                    <a href="#" className="hover:text-[#00ff41] transition-colors">Instagram</a>
                    <a href="#" className="hover:text-[#00ff41] transition-colors">YouTube</a>
                 </div>
              </div>

              <a href="mailto:harshavardhan.khamkar@gmail.com" className="bg-[#00ff41] text-black font-bold uppercase px-8 py-4 rounded-full hover:scale-105 transition-transform">
                 Business Enquiries
              </a>
           </div>
        </div>

      </div>
    </>
  );
}
