import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import Skills from "@/components/skills/Skills";
import Experience from "@/components/experience/Experience";
import Contact from "@/components/contact/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ProjectsGrid />
      <Experience />
      <Skills />
      <Contact />
    </>
  );
}
