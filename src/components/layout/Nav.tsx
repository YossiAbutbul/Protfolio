"use client";

import Link from "next/link";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.monogram} aria-label="Home — Yossi Abutbul">
          <span aria-hidden="true">Yossi Abutbul</span>
          <span className={styles.monogramDot} aria-hidden="true" />
        </Link>
        <nav aria-label="Primary">
          <ul className={styles.links}>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={styles.link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
