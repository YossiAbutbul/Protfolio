import styles from "./TagPill.module.css";

export default function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className={styles.pill}>
      <span className={styles.tick} aria-hidden="true" />
      <span className={styles.text}>{children}</span>
      <span className={styles.tick} aria-hidden="true" />
    </span>
  );
}
