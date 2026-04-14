import type { Project } from "@/types/project";

export const PROJECTS: Project[] = [
  {
    slug: "report-generator",
    title: "RF Report Generator",
    summary:
      "Full-stack RF test-automation platform. Controls Power and Spectrum Analyzers over Bluetooth, captures real-time measurements, and generates structured reports with 3D analysis. Cut lab reporting time by 50%+.",
    tags: ["software", "hardware", "embedded"],
    year: 2024,
    role: "Solo — architecture, frontend, API, device integration",
    stack: ["React", "TypeScript", "Python", "FastAPI", "Plotly"],
    links: [
      { label: "GitHub", href: "https://github.com/YossiAbutbul/ReportGenrator" },
    ],
    images: [
      {
        src: "/projects/report-generator/hero.svg",
        alt: "RF Report Generator dashboard",
        width: 1600,
        height: 1000,
      },
    ],
    featured: true,
  },
  {
    slug: "pipeline-cpu",
    title: "Pipeline CPU Simulator",
    summary:
      "Educational CPU pipeline visualizer. Step through instructions, watch hazards, forward, and stall. Built to make classic computer-architecture lectures concrete.",
    tags: ["software"],
    year: 2024,
    role: "Solo",
    stack: ["React", "TypeScript", "Vite"],
    links: [{ label: "GitHub", href: "https://github.com/YossiAbutbul/Pipeline_CPU" }],
    images: [
      {
        src: "/projects/pipeline-cpu/hero.svg",
        alt: "Pipeline CPU simulator UI",
        width: 1600,
        height: 1000,
      },
    ],
    featured: true,
  },
  {
    slug: "two-pass-assembler",
    title: "Two-Pass Assembler",
    summary:
      "ANSI C90 compiler-like assembler. Two-stage: symbol-table build, then instruction parsing and base-4 machine-code emission. Built for the Systems Programming Laboratory course.",
    tags: ["software", "embedded"],
    year: 2023,
    role: "Solo — coursework",
    stack: ["C (ANSI C90)", "Make", "GDB"],
    links: [{ label: "GitHub", href: "https://github.com/YossiAbutbul/Assembler" }],
    images: [
      {
        src: "/projects/two-pass-assembler/hero.svg",
        alt: "Assembler output and source files",
        width: 1600,
        height: 1000,
      },
    ],
    featured: true,
  },
  {
    slug: "oplanner",
    title: "OPlanner",
    summary:
      "Full-stack semester + task planner built around student workflows. Reusable React components, Firebase-backed state, responsive progress-visualization dashboards.",
    tags: ["software"],
    year: 2023,
    role: "Solo",
    stack: ["React", "TypeScript", "Firebase"],
    links: [{ label: "Private repo — case study", href: "#contact" }],
    images: [
      {
        src: "/projects/oplanner/hero.svg",
        alt: "OPlanner dashboard",
        width: 1600,
        height: 1000,
      },
    ],
    featured: true,
  },
  {
    slug: "mini-circuits-power-sensor",
    title: "Mini-Circuits Power Sensor Wrapper",
    summary:
      "Python wrapper around a USB power sensor, bridging vendor .NET DLLs into a clean Pythonic API for lab automation scripts.",
    tags: ["hardware", "software"],
    year: 2024,
    role: "Solo",
    stack: ["Python", ".NET DLL interop", "USB"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/YossiAbutbul/Mini-Circuits-Power-Sensor",
      },
    ],
    images: [
      {
        src: "/projects/mini-circuits/hero.svg",
        alt: "USB power sensor plot",
        width: 1600,
        height: 1000,
      },
    ],
    featured: true,
  },
  {
    slug: "graphviewer",
    title: "GraphViewer 2.0",
    summary:
      "Lightweight antenna-radiation-pattern viewer. Parses .txt lab exports, renders interactive Chart.js visualizations. Built to make RF measurement data shareable.",
    tags: ["hardware", "software"],
    year: 2023,
    role: "Solo",
    stack: ["HTML", "CSS", "JavaScript", "Chart.js"],
    links: [{ label: "GitHub", href: "https://github.com/YossiAbutbul/GraphViewer2.0" }],
    images: [
      {
        src: "/projects/graphviewer/hero.svg",
        alt: "Antenna radiation pattern polar plot",
        width: 1600,
        height: 1000,
      },
    ],
    featured: false,
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return PROJECTS.map((p) => p.slug);
}
