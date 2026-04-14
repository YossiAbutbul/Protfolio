import MorphingTitle from "./MorphingTitle";
import styles from "./Hero.module.css";
import Fiducial from "@/components/ui/Fiducial";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-name">
      <Fiducial corner="tl" />
      <Fiducial corner="tr" />
      <Fiducial corner="bl" />
      <Fiducial corner="br" />
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
          CS student at The Open Univerisy <span aria-hidden="true">·</span> RF integrator
        </p>
        <p className={styles.scrollCue} aria-hidden="true">
          scroll ↓
        </p>
      </div>
    </section>
  );
}
