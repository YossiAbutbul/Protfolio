import SectionLabel from "@/components/ui/SectionLabel";
import styles from "./Skills.module.css";

const SW_GROUPS = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "C (ANSI C90)"],
  },
  {
    label: "Frontend",
    items: ["React", "Responsive UI", "Chart.js", "Plotly"],
  },
  {
    label: "Backend",
    items: ["FastAPI", "REST APIs", "Firebase"],
  },
  {
    label: "Tools",
    items: ["Git", ".NET DLL interop"],
  },
];

const HW_GROUPS = [
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

export default function Skills() {
  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-label">
      <div className="container">
        <div id="skills-label">
          <SectionLabel index="03">Capabilities</SectionLabel>
        </div>

        <div className={styles.grid}>
          <div data-reveal data-reveal-delay="1">
            <Column title=".text" subtitle="Software" groups={SW_GROUPS} />
          </div>
          <div data-reveal data-reveal-delay="2">
            <Column title=".data" subtitle="Hardware / Embedded" groups={HW_GROUPS} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Column({
  title,
  subtitle,
  groups,
}: {
  title: string;
  subtitle: string;
  groups: { label: string; items: string[] }[];
}) {
  return (
    <div className={styles.col}>
      <header className={styles.colHead}>
        <span className={styles.section_marker}>{title}</span>
        <h3 className={styles.colTitle}>{subtitle}</h3>
      </header>
      <dl className={styles.list}>
        {groups.map((g) => (
          <div key={g.label} className={styles.group}>
            <dt>{g.label}</dt>
            <dd>
              {g.items.map((it, i) => (
                <span key={it}>
                  {it}
                  {i < g.items.length - 1 && <span aria-hidden="true"> · </span>}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
