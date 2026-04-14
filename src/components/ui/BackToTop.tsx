"use client";

import { useEffect, useState } from "react";
import styles from "./BackToTop.module.css";

export default function BackToTop() {
  const [state, setState] = useState<"hidden" | "visible" | "dimmed">("hidden");

  useEffect(() => {
    function update() {
      const y = window.scrollY;
      const vh = window.innerHeight || 800;
      const doc = document.documentElement.scrollHeight;
      const nearBottom = y + vh > doc - vh * 0.4;
      if (y < vh * 0.8) setState("hidden");
      else if (nearBottom) setState("dimmed");
      else setState("visible");
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function jump() {
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <button
      type="button"
      aria-label="Back to top"
      className={`${styles.btn} ${styles[state]}`}
      onClick={jump}
    >
      <svg
        className={styles.mark}
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
      >
        <path d="M3 3 L7 3 M3 3 L3 7" stroke="currentColor" strokeWidth="1" />
        <path d="M19 3 L15 3 M19 3 L19 7" stroke="currentColor" strokeWidth="1" />
        <path d="M3 19 L7 19 M3 19 L3 15" stroke="currentColor" strokeWidth="1" />
        <path d="M19 19 L15 19 M19 19 L19 15" stroke="currentColor" strokeWidth="1" />
        <path d="M11 6 L11 16 M7 10 L11 6 L15 10" stroke="var(--accent)" strokeWidth="1" />
      </svg>
      <span className={styles.caption}>Top</span>
    </button>
  );
}
