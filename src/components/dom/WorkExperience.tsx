import { experience } from "@/data/profile";

export function WorkExperience() {
  return (
    <section
      id="experience"
      className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-32"
    >
      <h2 className="font-display mb-14 text-xs font-400 uppercase tracking-[0.5em] text-bio">
        Experience
      </h2>
      {experience.map((job) => (
        <article key={job.company} className="relative border-l border-moss pl-8 sm:pl-12">
          <span
            data-xp-line
            className="absolute -left-px top-0 block w-px bg-bio shadow-[0_0_12px_rgba(63,220,119,0.6)]"
            style={{ height: "100%" }}
            aria-hidden="true"
          />
          <header className="text-haloed mb-8">
            <h3 className="font-display text-2xl font-600 text-spore sm:text-4xl">
              {job.company}
            </h3>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-bio">{job.role}</p>
            <p className="mt-1 text-sm text-mist">
              {job.period} · {job.location}
            </p>
          </header>
          <ul className="space-y-5">
            {job.bullets.map((bullet) => (
              <li
                key={bullet.slice(0, 24)}
                data-xp-card
                className="rounded-lg border border-moss/60 bg-abyss/80 p-5 text-sm leading-relaxed text-spore/90 sm:text-base"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
