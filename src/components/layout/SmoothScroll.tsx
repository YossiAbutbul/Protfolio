"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Reset scroll on every route change. Lenis lives in layout so it persists
  // across nav; without this, the new page renders at the previous page's
  // scroll offset.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    // Force scroll to top on hard reload — browsers restore the previous
    // scroll position by default which fights the hero entrance.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    window.__lenis = lenis;
    lenis.scrollTo(0, { immediate: true });

    // Intercept in-page hash links so they animate via Lenis instead of jumping.
    function handleAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      if (href === "#") return;
      const dest = document.querySelector(href);
      if (!dest) return;
      e.preventDefault();
      lenis.scrollTo(dest as HTMLElement, { offset: -16, duration: 1.4 });
      // Update URL hash without browser jump
      history.replaceState(null, "", href);
    }
    document.addEventListener("click", handleAnchorClick);

    // Drive Lenis via GSAP ticker; sync ScrollTrigger to Lenis scroll.
    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", () => ScrollTrigger.update());

    ScrollTrigger.refresh();

    // Scroll-reveal via scroll-driven viewport test. Auto-unregisters once
    // every [data-reveal] element has been shown.
    const REVEAL_OFFSET = 0.88;
    let tickerAttached = false;
    function revealVisible() {
      const vh = window.innerHeight || 800;
      const threshold = vh * REVEAL_OFFSET;
      const pending = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
      if (pending.length === 0) {
        if (tickerAttached) {
          gsap.ticker.remove(tickReveal);
          tickerAttached = false;
        }
        return;
      }
      pending.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < threshold && rect.bottom > 0) el.classList.add("is-in");
      });
    }
    revealVisible();
    lenis.on("scroll", revealVisible);
    window.addEventListener("scroll", revealVisible, { passive: true });
    window.addEventListener("resize", revealVisible);

    let tick = 0;
    const tickReveal = () => {
      if (++tick % 6 !== 0) return;
      revealVisible();
    };
    gsap.ticker.add(tickReveal);
    tickerAttached = true;

    return () => {
      gsap.ticker.remove(raf);
      if (tickerAttached) gsap.ticker.remove(tickReveal);
      lenis.destroy();
      delete window.__lenis;
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("scroll", revealVisible);
      window.removeEventListener("resize", revealVisible);
    };
  }, []);

  return <>{children}</>;
}
