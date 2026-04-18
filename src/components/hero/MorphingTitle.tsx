import styles from "./MorphingTitle.module.css";

export default function MorphingTitle({ text }: { text: string }) {
  return <h1 className={styles.title}>{text}</h1>;
}
