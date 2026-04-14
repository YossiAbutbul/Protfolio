"use client";

import { useEffect, useRef, type RefObject } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

export interface MagneticOptions {
  strength?: number;
  radius?: number;
  ease?: number;
}

export function useMagnetic<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { strength = 0.35, radius = 120, ease = 0.15 }: MagneticOptions = {},
) {
  const state = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0, inside: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const s = state.current;

    function tick() {
      s.x += (s.tx - s.x) * ease;
      s.y += (s.ty - s.y) * ease;
      if (!el) return;
      el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
      if (s.inside || Math.abs(s.tx - s.x) > 0.1 || Math.abs(s.ty - s.y) > 0.1) {
        s.raf = requestAnimationFrame(tick);
      } else {
        s.raf = 0;
      }
    }

    function ensure() {
      if (s.raf === 0) s.raf = requestAnimationFrame(tick);
    }

    function onMove(e: PointerEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        s.inside = false;
        s.tx = 0;
        s.ty = 0;
      } else {
        s.inside = true;
        s.tx = dx * strength;
        s.ty = dy * strength;
      }
      ensure();
    }

    function onLeave() {
      s.inside = false;
      s.tx = 0;
      s.ty = 0;
      ensure();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      if (s.raf) cancelAnimationFrame(s.raf);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, [ref, strength, radius, ease]);
}
