import Link from "next/link";
import type { Project } from "@/types/project";
import TagPill from "./TagPill";
import InkReveal from "@/components/fx/InkReveal";
import { withBasePath } from "@/lib/env";
import styles from "./ProjectCard.module.css";

const TAG_LABEL: Record<Project["tags"][number], string> = {
  software: "SW",
  hardware: "HW",
  embedded: "EMB",
};

export default function ProjectCard({ project }: { project: Project }) {
  const img = project.images[0];
  return (
    <article className={styles.card}>
      <Link
        href={`/projects/${project.slug}/`}
        className={styles.link}
        aria-label={`Open case study: ${project.title}`}
      >
        <div className={styles.imageWrap}>
          <InkReveal
            src={withBasePath(img.src)}
            alt={img.alt}
            width={img.width}
            height={img.height}
          />
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.tags}>
            {project.tags.map((t) => (
              <TagPill key={t}>{TAG_LABEL[t]}</TagPill>
            ))}
          </span>
        </div>

        <h3 className={styles.title}>
          <Link href={`/projects/${project.slug}/`} className={styles.titleLink}>
            {project.title}
          </Link>
        </h3>
        <p className={styles.summary}>{project.summary}</p>
        <p className={styles.stack}>{project.stack.join(" · ")}</p>
      </div>
    </article>
  );
}
