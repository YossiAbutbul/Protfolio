"use client";

import { useEffect, useRef } from "react";

export interface FontAxes {
  wght: number; // 100..900
  opsz: number; // 9..144 (for Fraunces)
  SOFT: number; // 0..100
  WONK: number; // 0 or 1
}

export interface FontAxesInput {
  nx: number; // pointer X normalized 0..1
  ny: number; // pointer Y normalized 0..1
  vel: number; // smoothed pointer velocity 0..1
  click: boolean; // briefly true after a click
}

export type AxesMapper = (i: FontAxesInput) => FontAxes;

// Lock opsz at display range so wght changes don't jitter advance widths.
const DEFAULT: FontAxes = { wght: 420, opsz: 120, SOFT: 0, WONK: 0 };

function formatAxes(a: FontAxes): string {
  return `"wght" ${a.wght.toFixed(0)}, "opsz" ${a.opsz.toFixed(0)}, "SOFT" ${a.SOFT.toFixed(
    0,
  )}, "WONK" ${a.WONK.toFixed(0)}`;
}

/**
 * Continuously drives font-variation-settings on a target element based on
 * pointer position + velocity. No-ops under prefers-reduced-motion.
 */
export function useFontAxes(
  ref: React.RefObject<HTMLElement | null>,
  mapper: AxesMapper = defaultMapper,
) {
  const state = useRef({
    cur: { ...DEFAULT },
    tgt: { ...DEFAULT },
    vel: 0,
    lastMove: 0,
    prevX: 0,
    prevY: 0,
    click: false,
    clickAt: 0,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.fontVariationSettings = formatAxes(DEFAULT);
      return;
    }

    let raf = 0;
    const s = state.current;

    function onMove(e: PointerEvent) {
      const now = performance.now();
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;

      const dt = Math.max(1, now - s.lastMove);
      const dx = e.clientX - s.prevX;
      const dy = e.clientY - s.prevY;
      const speed = Math.min(1, Math.hypot(dx, dy) / dt / 2.5);
      s.vel = s.vel * 0.8 + speed * 0.2;
      s.lastMove = now;
      s.prevX = e.clientX;
      s.prevY = e.clientY;

      s.tgt = mapper({ nx, ny, vel: s.vel, click: s.click });
    }

    function onClick() {
      s.click = true;
      s.clickAt = performance.now();
    }

    function tick() {
      // Click fades after 400ms
      if (s.click && performance.now() - s.clickAt > 400) s.click = false;

      // Velocity decays when idle
      if (performance.now() - s.lastMove > 80) s.vel *= 0.92;

      // Lerp current toward target — slower than before so the morph reads
      // as a calm breath rather than a twitch.
      (Object.keys(s.cur) as (keyof FontAxes)[]).forEach((k) => {
        s.cur[k] += (s.tgt[k] - s.cur[k]) * 0.04;
      });

      el!.style.fontVariationSettings = formatAxes(s.cur);
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, [ref, mapper]);
}

function defaultMapper({ ny, vel }: FontAxesInput): FontAxes {
  // Width-stable: only wght and SOFT move. opsz pinned at 120 (display range)
  // so letter advances don't twitch when the cursor first enters the page.
  return {
    wght: 380 + (1 - ny) * 100, // 380..480
    opsz: 120, // locked
    SOFT: vel * 18,
    WONK: 0,
  };
}
