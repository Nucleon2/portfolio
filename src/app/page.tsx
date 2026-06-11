import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CanvasRoot } from "@/components/canvas/CanvasRoot";
import { DomAnimations } from "@/components/dom/DomAnimations";
import { Preloader } from "@/components/dom/Preloader";
import { Nav } from "@/components/dom/Nav";
import { Hero } from "@/components/dom/Hero";
import { About } from "@/components/dom/About";
import { WorkExperience } from "@/components/dom/WorkExperience";
import { Projects } from "@/components/dom/Projects";
import { Skills } from "@/components/dom/Skills";
import { Contact } from "@/components/dom/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      {/* WebGL forest — fixed behind everything; CSS fallback shows through if it fails */}
      <div className="atmosphere-fallback fixed inset-0 z-0" aria-hidden="true">
        <CanvasRoot />
      </div>

      <Preloader />
      <DomAnimations />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <About />
        <WorkExperience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
