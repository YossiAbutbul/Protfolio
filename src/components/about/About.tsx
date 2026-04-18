import SectionLabel from "@/components/ui/SectionLabel";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-label">
      <div className="container">
        <div id="about-label">
          <SectionLabel index="01">About</SectionLabel>
        </div>
        <div className={styles.grid}>
          <div className={styles.prose}>
            <p className={styles.lead} data-reveal data-reveal-delay="1">
              BSc Computer Science student at The Open University building software for
              RF and embedded systems.
            </p>
            <p data-reveal data-reveal-delay="2">
              I design test-automation platforms, antenna-pattern tooling, and workflow
              software that cuts engineering time by 50%+ — pairing system-level thinking
              with low-level hands-on.
            </p>
            <p data-reveal data-reveal-delay="3">
              I like the moments where firmware, hardware, and UI meet.
            </p>
          </div>

          <aside className={styles.rail} aria-label="Quick facts" data-reveal data-reveal-delay="2">
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt>Studying</dt>
                <dd>BSc Computer Science · The Open University</dd>
              </div>
              <div className={styles.fact}>
                <dt>Working at</dt>
                <dd>Arad Technologies · since 2020</dd>
              </div>
              <div className={styles.fact}>
                <dt>Comfortable with</dt>
                <dd>
                  TS / React · Python / FastAPI · C
                  <br />
                  RF instruments
                </dd>
              </div>
              <div className={styles.fact}>
                <dt>Curious about</dt>
                <dd>
                  Signal processing · compilers
                  <br />
                  Hardware bring-up
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
