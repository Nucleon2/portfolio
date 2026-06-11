import { skillGroups } from "@/data/skills";

export function Skills() {
  return (
    <section
      id="skills"
      className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-32"
    >
      <h2 className="font-display mb-14 text-xs font-400 uppercase tracking-[0.5em] text-bio">
        Skills
      </h2>
      <div className="space-y-12">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <h3 className="mb-5 text-sm uppercase tracking-[0.3em] text-mist">{group.label}</h3>
            <ul className="flex flex-wrap gap-3">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  data-skill-chip
                  className="glow-chip rounded-full border border-moss px-5 py-2.5 text-sm text-spore"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
