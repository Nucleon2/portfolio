import { projects } from "@/data/projects";
import { ProjectPanel } from "./ProjectPanel";

export function Projects() {
  return (
    <section id="projects" className="relative">
      <h2 className="font-display px-6 pt-24 text-xs font-400 uppercase tracking-[0.5em] text-bio sm:px-12">
        Selected work
      </h2>
      {projects.map((project) => (
        <ProjectPanel key={project.id} project={project} />
      ))}
    </section>
  );
}
