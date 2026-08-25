"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxImage = { src: string; alt: string };

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_IN_SCALE = 2.5;

function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

/** Full-screen zoomable/pannable image viewer. `index === null` renders nothing.
 * Click/tap the image to toggle zoom, drag to pan once zoomed, scroll or pinch
 * to zoom continuously. Controlled from the parent so a gallery grid can drive
 * which image is open. */
export default function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const isOpen = index !== null;
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ moved: false, pinched: false });
  const dragOrigin = useRef({ x: 0, y: 0, translateX: 0, translateY: 0 });
  const pinchOrigin = useRef({ dist: 0, scale: 1 });

  // Reset the zoom/pan whenever a different image comes into view. Done
  // during render (React's sanctioned "adjust state on prop change" pattern)
  // rather than in an effect, so switching images doesn't cost an extra
  // render pass or briefly show the previous image's zoom level.
  const [resetForIndex, setResetForIndex] = useState(index);
  if (index !== resetForIndex) {
    setResetForIndex(index);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setIsInteracting(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && images.length > 1) onIndexChange((index + 1) % images.length);
      if (e.key === "ArrowLeft" && images.length > 1) onIndexChange((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, index, images.length, onClose, onIndexChange]);

  if (!isOpen || index === null) return null;
  const current = images[index];

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => {
      const next = clampScale(s - e.deltaY * 0.0025);
      if (next <= MIN_SCALE) setTranslate({ x: 0, y: 0 });
      return next;
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const wasEmpty = pointers.current.size === 0;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (wasEmpty) {
      gesture.current = { moved: false, pinched: false };
      setIsInteracting(true);
    }

    if (pointers.current.size === 1) {
      dragOrigin.current = { x: e.clientX, y: e.clientY, translateX: translate.x, translateY: translate.y };
    } else if (pointers.current.size === 2) {
      gesture.current.pinched = true;
      const pts = Array.from(pointers.current.values());
      pinchOrigin.current = { dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), scale };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      setScale(clampScale(pinchOrigin.current.scale * (dist / pinchOrigin.current.dist)));
      return;
    }

    if (pointers.current.size === 1 && scale > MIN_SCALE) {
      const dx = e.clientX - dragOrigin.current.x;
      const dy = e.clientY - dragOrigin.current.y;
      if (Math.hypot(dx, dy) > 4) gesture.current.moved = true;
      setTranslate({ x: dragOrigin.current.translateX + dx, y: dragOrigin.current.translateY + dy });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size > 0) return;
    setIsInteracting(false);

    const { moved, pinched } = gesture.current;
    if (!moved && !pinched) {
      setScale((s) => (s > MIN_SCALE ? MIN_SCALE : ZOOM_IN_SCALE));
      setTranslate({ x: 0, y: 0 });
    } else if (scale <= MIN_SCALE) {
      setTranslate({ x: 0, y: 0 });
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-6 backdrop-blur-sm sm:p-12"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onWheel={handleWheel}
    >
      <button
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:right-6 sm:top-6"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % images.length);
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Plain <img>, not next/image: the lightbox wants the real source pixels
          under a free-form CSS transform for zoom/pan, not Next's automatic
          sizing. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.src}
        alt={current.alt}
        draggable={false}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="max-h-full max-w-full touch-none select-none rounded-lg object-contain shadow-2xl"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transition: isInteracting ? "none" : "transform 0.2s ease-out",
          cursor: scale > MIN_SCALE ? "grab" : "zoom-in",
        }}
      />

      {current.alt && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 max-w-[90vw] -translate-x-1/2 text-center text-xs text-white/50 sm:bottom-6">
          {current.alt}
        </div>
      )}
    </div>
  );
}
