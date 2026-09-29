"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sections, socials } from "@/lib/site";
import { toggleTheme, useIsDark } from "@/lib/hooks";

const EASE = "cubic-bezier(0.32,0.72,0,1)";

/** Which home-page section is under the reader, updated on scroll. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const top = window.scrollY;
      const vh = window.innerHeight;
      let idx = 0;
      sections.forEach((s, i) => {
        const el = document.querySelector<HTMLElement>(`[data-sec="${s.id}"]`);
        if (el && el.offsetTop - vh * 0.45 <= top) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);
  return active;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const dark = useIsDark();
  // The menu is open for one pathname only, so navigating closes it without an effect.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menu = menuPath === pathname;
  const setMenu = (open: boolean | ((o: boolean) => boolean)) =>
    setMenuPath((cur) => ((typeof open === "function" ? open(cur === pathname) : open) ? pathname : null));
  const [scrolled, setScrolled] = useState(false);
  const homeActive = useActiveSection(isHome);

  // Section the menu highlights: scroll position on home, route elsewhere.
  const current = isHome
    ? homeActive
    : pathname.startsWith("/projects")
      ? 3
      : pathname.startsWith("/achievements")
        ? 4
        : -1;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tell the rest of the page (the bird canvas) the menu is active; clear it once the
  // close animation has finished.
  useEffect(() => {
    const html = document.documentElement;
    if (menu) {
      html.dataset.menu = "open";
      return;
    }
    const t = setTimeout(() => delete html.dataset.menu, 1000);
    return () => clearTimeout(t);
  }, [menu]);

  // Lock page scroll while the menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuPath(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [menu]);

  const goSection = (i: number) => {
    const s = sections[i];
    setMenu(false);
    // On the home page every entry scrolls to its section; elsewhere the Link navigates.
    if (isHome) {
      const el = document.querySelector<HTMLElement>(`[data-sec="${s.id}"]`);
      if (el) window.scrollTo({ top: s.id === "home" ? 0 : el.offsetTop - 56, behavior: "smooth" });
    }
  };

  const line = (top: number, rot: number, delay = true) => ({
    position: "absolute" as const,
    left: 13,
    width: 18,
    height: 2,
    borderRadius: 2,
    background: menu ? "#000" : "var(--bg)",
    top,
    transform: `rotate(${rot}deg)`,
    transition: `top 600ms ${EASE}, transform 600ms ${EASE}${delay ? " 100ms" : ""}, background-color 600ms`,
  });

  return (
    <>
      <div
        aria-hidden={!menu}
        className="fixed inset-0 z-[58] box-border flex flex-col justify-between overflow-y-auto px-6 pb-10 pt-24"
        style={{
          // Opaque enough to need no backdrop blur; a full-screen blur over the animating
          // canvas, under a clip-path animation, flashed on close.
          background: "var(--menuSolid)",
          clipPath: menu
            ? "circle(150% at calc(100% - 38px) 34px)"
            : "circle(0px at calc(100% - 38px) 34px)",
          pointerEvents: menu ? "auto" : "none",
          visibility: menu ? "visible" : "hidden",
          transition: `clip-path 900ms ${EASE}, visibility 0s linear ${menu ? 0 : 900}ms`,
        }}
      >
        <nav aria-label="Menu" className="mx-auto flex w-full max-w-[1200px] flex-col gap-1">
          {sections.map((s, i) => (
            <div key={s.id} className="overflow-hidden">
              <Link
                href={s.href}
                onClick={(e) => {
                  // Projects and Hackathons always open their dedicated pages;
                  // the home-only entries scroll when already on the home page.
                  const onPage = s.href === "/" || s.href.startsWith("/#");
                  if (isHome && onPage) {
                    e.preventDefault();
                    goSection(i);
                  } else setMenu(false);
                }}
                tabIndex={menu ? 0 : -1}
                className="flex w-full items-baseline gap-4 py-1 hover:pl-2"
                style={{
                  opacity: menu ? 1 : 0,
                  transform: `translateY(${menu ? 0 : 56}px)`,
                  transition: `opacity 800ms ${EASE} ${menu ? 150 + i * 50 : 0}ms, transform 800ms ${EASE} ${menu ? 150 + i * 50 : 0}ms, padding 500ms ${EASE}`,
                }}
              >
                <span className="mono w-6 text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-5xl font-semibold leading-none"
                  style={{
                    letterSpacing: "-0.04em",
                    color: current === i ? "var(--accentText)" : "var(--fg)",
                  }}
                >
                  {s.label}
                </span>
              </Link>
            </div>
          ))}
        </nav>
        <div
          className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 pt-8"
          style={{
            opacity: menu ? 1 : 0,
            transform: `translateY(${menu ? 0 : 24}px)`,
            transition: `opacity 800ms ${EASE} 450ms, transform 800ms ${EASE} 450ms`,
          }}
        >
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={menu ? 0 : -1}
                className="flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium"
                style={{ borderColor: "var(--line)", color: "var(--fg)" }}
              >
                <i className={s.icon} style={{ fontSize: 18 }} />
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <header
        className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between py-3 pl-6 pr-4"
        style={{
          background: scrolled ? "var(--glass)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
          transition: `background-color 600ms ${EASE}`,
        }}
      >
        <Link
          href="/"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex flex-col items-start uppercase"
        >
          <span className="text-xs font-medium" style={{ letterSpacing: ".06em", color: "var(--muted)" }}>
            Harsh
          </span>
          <span className="text-lg font-bold leading-5" style={{ letterSpacing: "-0.01em", color: "var(--fg)" }}>
            Khamkar
          </span>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border active:scale-[0.94]"
            style={{
              borderColor: "var(--line)",
              background: "var(--glass)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              color: "var(--fg)",
            }}
          >
            <i
              className={dark ? "ph ph-sun" : "ph ph-moon"}
              style={{
                fontSize: 20,
                display: "block",
                transition: `transform 700ms ${EASE}`,
                transform: `rotate(${dark ? 0 : 360}deg)`,
              }}
            />
          </button>
          <button
            onClick={() => setMenu((m) => !m)}
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            className="relative size-11 cursor-pointer rounded-full border-0 active:scale-[0.92]"
            style={{
              background: menu ? "var(--accent)" : "var(--fg)",
              transition: `background-color 600ms ${EASE}, transform 600ms ${EASE}`,
            }}
          >
            <span style={line(menu ? 21 : 17, menu ? 45 : 0)} />
            <span style={line(menu ? 21 : 25, menu ? -45 : 0)} />
          </button>
        </div>
      </header>

      {/* Phones on the home page: floating bar that tracks the current section. */}
      {isHome && (
        <nav
          aria-label="Sections"
          className="sectionbar fixed bottom-4 left-1/2 z-30 flex gap-1 rounded-full border p-1"
          style={{
            transform: `translateX(-50%) translateY(${menu ? 120 : 0}px)`,
            transition: `transform 700ms ${EASE}`,
            background: "var(--glass)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderColor: "var(--line)",
            boxShadow: "0 12px 32px var(--shadow)",
          }}
        >
          <span
            className="absolute left-1 top-1 size-11 rounded-full"
            style={{
              background: "var(--accent)",
              transform: `translateX(${homeActive * 48}px)`,
              transition: `transform 700ms ${EASE}`,
            }}
          />
          {sections.map((s, i) => {
            const on = homeActive === i;
            return (
              <button
                key={s.id}
                onClick={() => goSection(i)}
                aria-label={s.label}
                aria-current={on}
                className="relative flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent"
                style={{ color: on ? "#000" : "var(--fg)", transition: `color 500ms ${EASE}` }}
              >
                <i className={`${on ? "ph-fill" : "ph"} ph-${s.icon}`} style={{ fontSize: 20 }} />
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
}
