"use client";

import { profile } from "@/data/profile";
import { useAppStore } from "@/lib/store";

export function Contact() {
  const pulseCta = useAppStore((s) => s.pulseCta);

  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-32 text-center"
    >
      <h2
        data-contact-title
        className="font-display text-[11vw] font-800 uppercase leading-[0.95] tracking-tight text-spore sm:text-[7vw]"
      >
        Let&apos;s build
        <span className="glow-text block text-bio">something.</span>
      </h2>
      <p className="text-haloed mt-8 max-w-md text-sm text-spore/85 sm:text-base">
        Open to internships, collaborations and interesting problems.
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <a
          href={`mailto:${profile.email}`}
          data-magnetic
          onClick={() => pulseCta()}
          className="rounded-full bg-bio px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-abyss transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(63,220,119,0.5)]"
        >
          Say hello
        </a>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic
          className="rounded-full border border-ember/50 px-8 py-4 text-sm uppercase tracking-[0.2em] text-ember transition-colors duration-300 hover:bg-ember hover:text-abyss"
        >
          Resume ↓
        </a>
      </div>

      <ul className="mt-12 flex items-center gap-8 text-sm text-mist">
        <li>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-bio-bright"
          >
            GitHub — {profile.githubHandle}
          </a>
        </li>
        <li>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-bio-bright"
          >
            LinkedIn — {profile.linkedinHandle}
          </a>
        </li>
      </ul>

      <footer className="absolute bottom-8 text-xs text-mist/60">
        Designed & built by {profile.name} · 2026
      </footer>
    </section>
  );
}
