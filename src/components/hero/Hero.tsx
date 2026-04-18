import MorphingTitle from "./MorphingTitle";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-name">
      <div className={`container ${styles.inner}`}>
        <p className={`eyebrow ${styles.eyebrow}`}>
          <span className={styles.dot} aria-hidden="true" />
          Portfolio · 2026
        </p>
        <div id="hero-name" className={styles.h1Wrap}>
          <MorphingTitle text="Yossi Abutbul" />
        </div>
        <p className={styles.subtitle}>Building software where signals meet code.</p>
        <p className={styles.meta}>
          BSc Computer Science student at The Open University <span aria-hidden="true">·</span> Innovating with AI
        </p>
      </div>
    </section>
  );
}
