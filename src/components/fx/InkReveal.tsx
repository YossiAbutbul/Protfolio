"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./InkReveal.module.css";

export interface InkRevealProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function InkReveal(props: InkRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].intersectionRatio > 0.15) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: [0, 0.15, 0.5, 1] },
    );
    io.observe(el);
    // Safety: reveal anything in viewport on first frame regardless of IO
    const t = window.setTimeout(() => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setRevealed(true);
    }, 250);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      style={{ aspectRatio: `${props.width} / ${props.height}` }}
    >
      <img
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        loading="lazy"
        className={`${styles.fallback} ${revealed ? styles.fallbackIn : ""}`}
      />
      <div
        className={`${styles.grain} ${revealed ? styles.grainIn : ""}`}
        aria-hidden="true"
      />
    </div>
  );
}
