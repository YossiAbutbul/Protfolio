"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, useIsTouch } from "@/hooks/useReducedMotion";
import styles from "./FollowerDot.module.css";

const TRAIL_COUNT = 5;

export default function FollowerDot() {
  const mainRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touch = useIsTouch();

  useEffect(() => {
    if (touch) return;
    if (prefersReducedMotion()) return;
    const main = mainRef.current;
    if (!main) return;

    const dots = [
      { el: main, x: -50, y: -50, ease: 0.22 },
      ...trailRefs.current
        .filter((el): el is HTMLDivElement => !!el)
        .map((el, i) => ({
          el,
          x: -50,
          y: -50,
          ease: 0.22 - (i + 1) * 0.032,
        })),
    ];

    const target = { x: -50, y: -50, visible: false };
    let raf = 0;

    function tick() {
      raf = 0;
      let prevX = target.x;
      let prevY = target.y;
      let moving = false;
      for (const d of dots) {
        d.x += (prevX - d.x) * d.ease;
        d.y += (prevY - d.y) * d.ease;
        d.el.style.transform = `translate3d(${d.x.toFixed(2)}px, ${d.y.toFixed(2)}px, 0) translate(-50%, -50%)`;
        if (Math.abs(prevX - d.x) > 0.1 || Math.abs(prevY - d.y) > 0.1) moving = true;
        prevX = d.x;
        prevY = d.y;
      }
      if (target.visible && moving) raf = requestAnimationFrame(tick);
    }

    function schedule() {
      if (raf === 0) raf = requestAnimationFrame(tick);
    }

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!target.visible) {
        target.visible = true;
        for (const d of dots) {
          d.x = e.clientX;
          d.y = e.clientY;
          d.el.classList.add(styles.visible);
        }
      }
      schedule();
    }

    function onLeave() {
      target.visible = false;
      for (const d of dots) d.el.classList.remove(styles.visible);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [touch]);

  if (touch) return null;
  return (
    <>
      <div ref={mainRef} className={`${styles.dot} ${styles.main}`} aria-hidden="true" />
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className={`${styles.dot} ${styles.trail}`}
          style={
            {
              "--trail-step": i + 1,
              "--trail-count": TRAIL_COUNT,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      ))}
    </>
  );
}
