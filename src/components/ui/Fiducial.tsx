import styles from "./Fiducial.module.css";

type Corner = "tl" | "tr" | "bl" | "br";

export default function Fiducial({ corner, size = 18 }: { corner: Corner; size?: number }) {
  return (
    <svg
      className={`${styles.fiducial} ${styles[corner]}`}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10" cy="10" r="5.2" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <line x1="10" y1="0" x2="10" y2="7" stroke="currentColor" strokeWidth="0.8" />
      <line x1="10" y1="13" x2="10" y2="20" stroke="currentColor" strokeWidth="0.8" />
      <line x1="0" y1="10" x2="7" y2="10" stroke="currentColor" strokeWidth="0.8" />
      <line x1="13" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}
