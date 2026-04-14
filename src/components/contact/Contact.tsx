import SectionLabel from "@/components/ui/SectionLabel";
import Fiducial from "@/components/ui/Fiducial";
import { withBasePath } from "@/lib/env";
import styles from "./Contact.module.css";

const LINKS: { label: string; href: string; display: string; newTab?: boolean }[] = [
  { label: "Email", href: "mailto:abyossi22@gmail.com", display: "abyossi22@gmail.com" },
  { label: "Phone", href: "tel:+972525476603", display: "+972 52-547-6603" },
  { label: "GitHub", href: "https://github.com/YossiAbutbul", display: "@YossiAbutbul" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yossi-abutbul-550958199/",
    display: "yossi-abutbul",
  },
  { label: "CV", href: withBasePath("/cv.pdf"), display: "Open PDF ↗", newTab: true },
];

export default function Contact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-label">
      <Fiducial corner="tl" />
      <Fiducial corner="tr" />
      <Fiducial corner="bl" />
      <Fiducial corner="br" />
      <div className="container">
        <div id="contact-label">
          <SectionLabel index="05">Contact</SectionLabel>
        </div>

        <h2 className={styles.headline} data-reveal data-reveal-delay="1">
          Get in <em>touch</em>.
        </h2>
        <p className={styles.lede} data-reveal data-reveal-delay="2">
          Open to internships, freelance, collaborations, and RF / embedded engineering work.
        </p>

        <ul className={styles.list}>
          {LINKS.map((l, i) => (
            <li
              key={l.label}
              className={styles.row}
              data-reveal
              data-reveal-delay={(((i % 5) + 1)).toString()}
            >
              <span className={styles.rowLabel}>{l.label}</span>
              <a
                className={`link-inline ${styles.rowValue}`}
                href={l.href}
                {...(l.href.startsWith("http") || l.newTab
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
              >
                {l.display}
              </a>
            </li>
          ))}
        </ul>

        <footer className={styles.footer}>
          <p>
            <span className={styles.footMono}>© {new Date().getFullYear()} Yossi Abutbul</span>
            <span aria-hidden="true"> · </span>
            <span className={styles.footMono}>built with Next.js, three.js, and Lenis</span>
          </p>
        </footer>
      </div>
    </section>
  );
}
