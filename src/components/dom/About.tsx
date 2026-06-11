import { profile } from "@/data/profile";

export function About() {
  return (
    <section
      id="about"
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
      <p className="text-haloed mt-12 text-sm text-mist">
        {profile.education.school} · {profile.education.detail} · Class of{" "}
        {profile.education.graduation.split(" ")[1]}
      </p>
    </section>
  );
}
