import { Fragment } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import styles from "./Skills.module.css";

interface Group {
  label: string;
  items: string[];
}

const SW_GROUPS: Group[] = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "C (ANSI C90)"] },
  { label: "Frontend", items: ["React", "Responsive UI", "Chart.js", "Plotly"] },
  { label: "Backend", items: ["FastAPI", "REST APIs", "Firebase"] },
  { label: "Tools", items: ["Git", "GitHub", "Claude Code"] },
];

const HW_GROUPS: Group[] = [
  {
    label: "RF systems",
    items: [
      "Antenna integration",
      "Radiation pattern analysis",
      "FEM integration",
      "Signal analysis + debug",
    ],
  },
  {
    label: "Instruments",
    items: ["Spectrum analyzer", "Power sensor", "USB instrumentation"],
  },
  {
    label: "Protocols",
    items: ["Bluetooth", "LoRa", "LTE", "NB-IoT", "CAT-M"],
  },
  {
    label: "Workflow",
    items: ["Hardware–software bring-up", "System validation", "Python automation"],
  },
];

const MARQUEE = [
  "TypeScript",
  "React",
  "Python",
  "C / ANSI C90",
  "FastAPI",
  "RF Integration",
  "Spectrum Analysis",
  "Signal Debug",
  "FEM",
  "LoRa",
  "NB-IoT",
  "Bluetooth",
  "Python Automation",
  ".NET Interop",
  "Firebase",
];

const ROWS = SW_GROUPS.map((sw, i) => ({ sw, hw: HW_GROUPS[i] }));

export default function Skills() {
  let swIdx = 0;
  let hwIdx = 0;

  const swChip = (it: string) => {
    swIdx += 1;
    return <Chip key={`sw-${it}`} label={it} index={swIdx.toString().padStart(2, "0")} />;
  };
  const hwChip = (it: string) => {
    hwIdx += 1;
    return <Chip key={`hw-${it}`} label={it} index={hwIdx.toString().padStart(2, "0")} />;
  };

  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-label">
      <div className="container">
        <div id="skills-label">
          <SectionLabel index="03">Skills</SectionLabel>
        </div>

        <div className={styles.marquee} data-reveal data-reveal-delay="1" aria-hidden="true">
          <div className={styles.marqueeTrack}>
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={`${m}-${i}`} className={styles.marqueeItem}>
                {m}
                <span className={styles.marqueeDot}>·</span>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.table} data-reveal data-reveal-delay="2">
          <header className={styles.cellHead}>
            <h3 className={styles.colTitle}>Software</h3>
          </header>
          <header className={`${styles.cellHead} ${styles.cellHeadR}`}>
            <h3 className={styles.colTitle}>Hardware / Embedded</h3>
          </header>

          {ROWS.map((row, i) => (
            <Fragment key={i}>
              <div className={styles.cell}>
                <span className={styles.cellLabel}>{row.sw.label}</span>
                <div className={styles.cellChips}>{row.sw.items.map(swChip)}</div>
              </div>
              <div className={`${styles.cell} ${styles.cellR}`}>
                <span className={styles.cellLabel}>{row.hw.label}</span>
                <div className={styles.cellChips}>{row.hw.items.map(hwChip)}</div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function Chip({ label, index }: { label: string; index: string }) {
  return (
    <span className={styles.chip} tabIndex={0}>
      <span className={styles.chipText}>{label}</span>
      <span className={styles.chipIndex} aria-hidden="true">
        {index}
      </span>
    </span>
  );
}
