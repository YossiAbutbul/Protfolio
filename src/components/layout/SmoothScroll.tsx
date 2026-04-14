"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    // Respect reduced-motion: no Lenis, native scroll behavior.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
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

    // Global scroll-reveal. Uses a scroll-driven viewport test instead of
    // IntersectionObserver so it's resilient in environments where IO callbacks
    // are throttled (preview renderers, background tabs). Element gets `.is-in`
    // once its top crosses ~85% of the viewport; one-shot per element.
    const REVEAL_OFFSET = 0.88; // reveal when top passes 88% of viewport height
    function revealVisible() {
      const vh = window.innerHeight || 800;
      const threshold = vh * REVEAL_OFFSET;
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.top < threshold && rect.bottom > 0) {
          el.classList.add("is-in");
        }
      });
    }
    revealVisible();
    lenis.on("scroll", revealVisible);
    window.addEventListener("scroll", revealVisible, { passive: true });
    window.addEventListener("resize", revealVisible);

    // Ticker-driven reveal: hook into the same GSAP ticker that drives Lenis
    // so reveal runs on every frame regardless of scroll-event wiring.
    let tick = 0;
    const tickReveal = () => {
      if (++tick % 6 !== 0) return;
      revealVisible();
    };
    gsap.ticker.add(tickReveal);

    // Belt-and-suspenders: poll for the first 4 seconds in case neither scroll
    // events nor the GSAP ticker end up driving reveals in a given environment
    // (throttled preview renderers, older Android web views).
    const poll = window.setInterval(revealVisible, 250);
    const pollStop = window.setTimeout(() => window.clearInterval(poll), 4000);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.remove(tickReveal);
      lenis.destroy();
      delete window.__lenis;
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("scroll", revealVisible);
      window.removeEventListener("resize", revealVisible);
      window.clearInterval(poll);
      window.clearTimeout(pollStop);
    };
  }, []);

  return <>{children}</>;
}
