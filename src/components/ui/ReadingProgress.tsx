"use client";

import { useEffect, useRef } from "react";
import styles from "./ReadingProgress.module.css";

export default function ReadingProgress({ target }: { target?: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;
    function update() {
      raf = 0;
      const root = target ? document.querySelector<HTMLElement>(target) : document.body;
      if (!root || !bar) return;
      const rect = root.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        bar.style.transform = "scaleX(1)";
        return;
      }
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    }
    function schedule() {
      if (raf === 0) raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [target]);

  return (
    <div className={styles.track} aria-hidden="true">
      <div ref={barRef} className={styles.bar} />
    </div>
  );
}
