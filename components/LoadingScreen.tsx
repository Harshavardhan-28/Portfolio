"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";

// Tracks the same THREE.DefaultLoadingManager the 3D scene's assets (e.g. the
// Environment HDR) load through, so the screen holds until they're actually
// ready — but never gets stuck if one of them stalls or fails to fetch.
const MIN_DISPLAY_MS = 700;
const MAX_WAIT_MS = 5000;
const FADE_MS = 500;
const SETTLE_GRACE_MS = 400;

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const [mounted, setMounted] = useState(true);
  const [exiting, setExiting] = useState(false);

  const latest = useRef({ progress: 0, active: false, hasBeenActive: false });

  useEffect(() => {
    latest.current.progress = progress;
    latest.current.active = active;
    if (active) latest.current.hasBeenActive = true;
  }, [progress, active]);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const { progress: p, active: a, hasBeenActive } = latest.current;
      // If nothing ever registered as loading (e.g. everything was cached),
      // fall back to a short settle window instead of waiting on `active`.
      const finished = hasBeenActive ? !a && p >= 100 : elapsed > SETTLE_GRACE_MS;

      if ((finished && elapsed >= MIN_DISPLAY_MS) || elapsed >= MAX_WAIT_MS) {
        setExiting(true);
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(() => setMounted(false), FADE_MS);
    return () => clearTimeout(t);
  }, [exiting]);

  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  const pct = Math.min(100, Math.round(progress));

  return (
    <div
      aria-hidden={exiting}
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center gap-8 bg-[#050505] transition-opacity ease-out ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      {/* HUD corner brackets */}
      <div className="pointer-events-none absolute inset-6 md:inset-10">
        <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00ff41]/40" />
        <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00ff41]/40" />
        <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00ff41]/40" />
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00ff41]/40" />
      </div>

      <div className="loading-mark-pulse border-2 border-[#00ff41] px-4 py-2">
        <span className="font-black text-4xl md:text-5xl italic tracking-tighter transform -skew-x-12 inline-block text-[#00ff41]">
          HK
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 w-56 md:w-72">
        <div className="relative w-full h-0.75 bg-white/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-[#00ff41] shadow-[0_0_12px_rgba(0,255,65,0.8)] transition-[width] duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">
          <span className="text-[#00ff41]">Loading</span>
          <span className="text-neutral-500"> · {pct}%</span>
        </span>
      </div>
    </div>
  );
}
