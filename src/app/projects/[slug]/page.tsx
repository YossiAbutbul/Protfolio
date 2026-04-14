import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PROJECTS, getAllSlugs, getProjectBySlug } from "@content/projects";
import InkReveal from "@/components/fx/InkReveal";
import TagPill from "@/components/projects/TagPill";
import Fiducial from "@/components/ui/Fiducial";
import ReadingProgress from "@/components/ui/ReadingProgress";
import Toc from "@/components/ui/Toc";
import { withBasePath } from "@/lib/env";

import ReportGeneratorBody from "@content/projects/report-generator.mdx";
import PipelineCpuBody from "@content/projects/pipeline-cpu.mdx";
import AssemblerBody from "@content/projects/two-pass-assembler.mdx";
import OPlannerBody from "@content/projects/oplanner.mdx";
import MiniCircuitsBody from "@content/projects/mini-circuits-power-sensor.mdx";
import GraphViewerBody from "@content/projects/graphviewer.mdx";

import styles from "./detail.module.css";

type MDXComponent = (props: object) => React.ReactElement;

const MDX_BY_SLUG: Record<string, MDXComponent> = {
  "report-generator": ReportGeneratorBody as unknown as MDXComponent,
  "pipeline-cpu": PipelineCpuBody as unknown as MDXComponent,
  "two-pass-assembler": AssemblerBody as unknown as MDXComponent,
  oplanner: OPlannerBody as unknown as MDXComponent,
  "mini-circuits-power-sensor": MiniCircuitsBody as unknown as MDXComponent,
  graphviewer: GraphViewerBody as unknown as MDXComponent,
};

const TAG_LABEL = { software: "SW", hardware: "HW", embedded: "EMB" } as const;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) return { title: "Not found" };
  return {
    title: `${p.title} · Yossi Abutbul`,
    description: p.summary,
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const Body = MDX_BY_SLUG[slug];
  const img = project.images[0];

  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];

  return (
    <article className={styles.page}>
      <ReadingProgress />
      <Fiducial corner="tl" />
      <Fiducial corner="tr" />
      <header className={styles.header}>
        <div className="container">
          <p className={styles.back}>
            <Link href="/#work" className="link-inline">
              ← back to work
            </Link>
          </p>

          <p className={styles.eyebrow}>
            <span>{project.role}</span>
          </p>

          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.summary}>{project.summary}</p>

          <div className={styles.metaBand}>
            <div className={styles.metaCell}>
              <span className={styles.metaLabel}>Year</span>
              <span className={styles.metaValue}>{project.year}</span>
            </div>
            <div className={styles.metaCell}>
              <span className={styles.metaLabel}>Discipline</span>
              <span className={styles.metaValue}>
                {project.tags.map((t) => TAG_LABEL[t]).join(" · ")}
              </span>
            </div>
            <div className={styles.metaCell}>
              <span className={styles.metaLabel}>Stack</span>
              <span className={styles.metaValue}>{project.stack.join(" · ")}</span>
            </div>
          </div>

          <div className={styles.metaRow}>
            <ul className={styles.tags} aria-label="Disciplines">
              {project.tags.map((t) => (
                <li key={t}>
                  <TagPill>{TAG_LABEL[t]}</TagPill>
                </li>
              ))}
            </ul>
            <ul className={styles.links} aria-label="External links">
              {project.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="link-inline"
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <figure className={styles.hero}>
        <div className="container">
          <div className={styles.heroFrame}>
            <InkReveal
              src={withBasePath(img.src)}
              alt={img.alt}
              width={img.width}
              height={img.height}
            />
          </div>
          <figcaption className={styles.cap}>{img.alt}</figcaption>
        </div>
      </figure>

      <section className={styles.body}>
        <div className="container">
          <div className={styles.layout}>
            <aside className={styles.sidebar}>
              <Toc scopeSelector=".content" />
            </aside>
            <div className={`content ${styles.prose}`}>
              {Body && <Body />}
            </div>
          </div>
        </div>
      </section>

      <nav className={styles.foot} aria-label="Project navigation">
        <div className="container">
          <div className={styles.footGrid}>
            <PrevNextCard direction="prev" project={prev} />
            <PrevNextCard direction="next" project={next} />
          </div>
        </div>
      </nav>
    </article>
  );
}

function PrevNextCard({
  direction,
  project,
}: {
  direction: "prev" | "next";
  project: (typeof PROJECTS)[number];
}) {
  const img = project.images[0];
  const label = direction === "prev" ? "← Previous" : "Next →";
  return (
    <Link
      href={`/projects/${project.slug}/`}
      className={`${styles.footLink} ${direction === "next" ? styles.footRight : ""}`}
    >
      <span className={styles.footDir}>{label}</span>
      <div className={styles.footThumb}>
        <InkReveal
          src={withBasePath(img.src)}
          alt={img.alt}
          width={img.width}
          height={img.height}
        />
      </div>
      <span className={styles.footTitle}>{project.title}</span>
    </Link>
  );
}
