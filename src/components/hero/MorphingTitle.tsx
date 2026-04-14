"use client";

import { useRef } from "react";
import { useFontAxes } from "@/hooks/useFontAxes";
import styles from "./MorphingTitle.module.css";

export default function MorphingTitle({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useFontAxes(ref);

  return (
    <h1 ref={ref} className={styles.title}>
      {text}
    </h1>
  );
}
