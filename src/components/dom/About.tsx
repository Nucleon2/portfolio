import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export function About() {
  return (
    <section
      id="about"
      data-testid="section-about"
      className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-32"
    >
      <h2 className="font-display mb-10 text-xs font-400 uppercase tracking-[0.5em] text-bio">
        About
      </h2>
      <div className="text-scrim space-y-8">
        {profile.about.map((paragraph) => (
          <p
            key={paragraph.slice(0, 24)}
            data-about-line
            className="text-haloed text-xl leading-relaxed text-spore sm:text-2xl"
          >
            {paragraph}
          </p>
        ))}
      </div>
      <dl className="text-scrim mt-12 flex flex-wrap gap-x-10 gap-y-4">
        {[
          { n: `${projects.length}`, label: "products built" },
          { n: "2", label: "hackathon builds" },
          { n: "Open", label: "source & self-hostable" },
        ].map((stat) => (
          <div key={stat.label}>
            <dt className="font-display text-2xl font-800 leading-none text-ember sm:text-3xl">
              {stat.n}
            </dt>
            <dd className="text-haloed mt-1 text-xs uppercase tracking-[0.2em] text-mist">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-haloed mt-10 text-sm text-mist">
        {profile.education.school} · {profile.education.detail} · Class of{" "}
        {profile.education.graduation.split(" ")[1]}
      </p>
    </section>
  );
}
