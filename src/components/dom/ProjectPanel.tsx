import type { Project } from "@/data/projects";

export function ProjectPanel({ project }: { project: Project }) {
  return (
    <article
      id={`project-${project.id}`}
      data-project={project.id}
      className="relative flex min-h-screen items-center px-6 py-24 sm:px-12"
    >
      <span
        aria-hidden="true"
        data-project-numeral
        className="font-display pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none text-[38vw] font-800 leading-none text-moss/25 sm:text-[26vw]"
      >
        {project.index}
      </span>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {project.badge && (
          <span
            data-project-meta
            className="mb-5 inline-block rounded-full border border-bio/40 px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-bio"
          >
            {project.badge}
          </span>
        )}
        <h3
          data-project-title
          className="font-display text-5xl font-600 uppercase leading-none tracking-tight text-spore sm:text-7xl lg:text-8xl"
        >
          {project.name}
        </h3>
        <p data-project-meta className="mt-5 max-w-xl text-lg text-bio-bright sm:text-xl">
          {project.pitch}
        </p>
        <p data-project-meta className="mt-4 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
          {project.description}
        </p>

        <ul className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
          {project.highlights.map((highlight) => (
            <li
              key={highlight.slice(0, 24)}
              data-project-meta
              className="rounded-md border border-moss/60 bg-abyss/50 px-4 py-3 text-xs leading-relaxed text-spore/85 backdrop-blur-sm sm:text-sm"
            >
              {highlight}
            </li>
          ))}
        </ul>

        <div data-project-meta className="mt-8 flex flex-wrap items-center gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="glow-chip rounded-full border border-moss px-3 py-1 text-xs text-mist"
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic
          className="group mt-10 inline-flex items-center gap-3 rounded-full border border-bio/50 px-7 py-3 text-sm uppercase tracking-[0.2em] text-bio transition-colors duration-300 hover:bg-bio hover:text-abyss"
        >
          View source
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </article>
  );
}
