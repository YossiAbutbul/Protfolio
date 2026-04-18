import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Signal lost — Yossi Abutbul",
  description: "The page you were looking for is off-frequency.",
};

export default function NotFound() {
  return (
    <section className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.codeWrap}>
          <h1 className={styles.code} aria-label="404">
            4
            <em aria-hidden="true">
              0
              <svg
                className={styles.scopeDisc}
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                <circle cx="50" cy="50" r="42" />
                <circle cx="50" cy="50" r="28" />
              </svg>
            </em>
            4
          </h1>
        </div>

        <div className={styles.copy}>
          <p className={styles.headline}>
            Carrier <em>lost</em>.
          </p>
          <p className={styles.helper}>
            Requested page is out of band — retune below.
          </p>
          <div className={styles.actions}>
            <Link
              href="/"
              className={`${styles.action} ${styles.actionPrimary}`}
            >
              <span className={styles.actionArrow} aria-hidden="true">
                ←
              </span>
              Home
            </Link>
            <Link href="/#work" className={styles.action}>
              Browse projects
              <span className={styles.actionArrow} aria-hidden="true">
                ↘
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.noiseFloor} aria-hidden="true">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path
            className={styles.noiseLine}
            d="M0 22 L6 25 L12 19 L18 24 L24 20 L30 27 L36 21 L42 18 L48 26 L54 22 L60 19 L66 25 L72 23 L78 17 L84 26 L90 21 L96 24 L102 19 L108 27 L114 22 L120 20 L126 25 L132 18 L138 23 L144 26 L150 21 L156 19 L162 27 L168 24 L174 20 L180 26 L186 22 L192 18 L198 25 L204 21 L210 23 L216 27 L222 19 L228 24 L234 20 L240 26 L246 22 L252 18 L258 25 L264 23 L270 19 L276 27 L282 21 L288 24 L294 20 L300 26 L306 22 L312 18 L318 25 L324 23 L330 19 L336 27 L342 21 L348 24 L354 20 L360 26 L366 22 L372 18 L378 25 L384 23 L390 19 L396 27 L402 21 L408 24 L414 20 L420 26 L426 22 L432 18 L438 25 L444 23 L450 19 L456 27 L462 21 L468 24 L474 20 L480 26 L486 22 L492 18 L498 25 L504 23 L510 19 L516 27 L522 21 L528 24 L534 20 L540 26 L546 22 L552 18 L558 25 L564 23 L570 19 L576 27 L582 21 L588 24 L594 20 L600 26 L606 22 L612 18 L618 25 L624 23 L630 19 L636 27 L642 21 L648 24 L654 20 L660 26 L666 22 L672 18 L678 25 L684 23 L690 19 L696 27 L702 21 L708 24 L714 20 L720 26 L726 22 L732 18 L738 25 L744 23 L750 19 L756 27 L762 21 L768 24 L774 20 L780 26 L786 22 L792 18 L798 25 L804 23 L810 19 L816 27 L822 21 L828 24 L834 20 L840 26 L846 22 L852 18 L858 25 L864 23 L870 19 L876 27 L882 21 L888 24 L894 20 L900 26 L906 22 L912 18 L918 25 L924 23 L930 19 L936 27 L942 21 L948 24 L954 20 L960 26 L966 22 L972 18 L978 25 L984 23 L990 19 L996 27 L1002 21 L1008 24 L1014 20 L1020 26 L1026 22 L1032 18 L1038 25 L1044 23 L1050 19 L1056 27 L1062 21 L1068 24 L1074 20 L1080 26 L1086 22 L1092 18 L1098 25 L1104 23 L1110 19 L1116 27 L1122 21 L1128 24 L1134 20 L1140 26 L1146 22 L1152 18 L1158 25 L1164 23 L1170 19 L1176 27 L1182 21 L1188 24 L1194 20 L1200 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeLinejoin="round"
            pathLength="1"
          />
          <line
            className="spike"
            x1="340"
            y1="22"
            x2="340"
            y2="6"
            stroke="var(--accent)"
            strokeWidth="1"
          />
          <line
            className="spike"
            x1="780"
            y1="22"
            x2="780"
            y2="10"
            stroke="currentColor"
            strokeWidth="1"
            style={{ animationDelay: "1.8s" }}
          />
        </svg>
      </div>
    </section>
  );
}
