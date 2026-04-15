"use client";

import { useEffect, useState } from "react";
import styles from "./Toc.module.css";

interface TocItem {
  id: string;
  text: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export default function Toc({ scopeSelector = ".content" }: { scopeSelector?: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const scope = document.querySelector(scopeSelector);
    if (!scope) return;
    const headings = Array.from(scope.querySelectorAll<HTMLHeadingElement>("h2"));
    const list: TocItem[] = headings.map((h) => {
      if (!h.id) h.id = slugify(h.textContent || "") || `h-${Math.random().toString(36).slice(2, 8)}`;
      return { id: h.id, text: h.textContent || "" };
    });
    setItems(list);
    if (list[0]) setActive(list[0].id);

    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.6] },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [scopeSelector]);

  if (items.length < 2) return null;

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <p className={styles.label}>Contents</p>
      <ol className={styles.list}>
        {items.map((it, i) => (
          <li key={it.id} className={active === it.id ? styles.active : ""}>
            <a href={`#${it.id}`}>
              <span className={styles.num}>{(i + 1).toString().padStart(2, "0")}</span>
              <span className={styles.text}>{it.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
