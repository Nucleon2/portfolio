"use client";

import { useAppStore } from "@/lib/store";
import { sections } from "@/lib/sections";
import { profile } from "@/data/profile";

export function Nav() {
  const sectionIndex = useAppStore((s) => s.sectionIndex);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
      <a
        href="#hero"
        className="font-display pointer-events-auto text-lg font-800 tracking-tight text-spore transition-colors hover:text-bio"
        aria-label="Back to top"
      >
        AK<span className="text-bio">.</span>
      </a>

      <div className="flex items-center gap-4 sm:gap-7">
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-label="↗"
          className="pointer-events-auto flex min-h-[40px] items-center rounded-full border border-ember/40 px-3.5 text-[10px] uppercase tracking-[0.2em] text-ember transition-colors duration-300 hover:bg-ember hover:text-abyss sm:text-[11px]"
        >
          Résumé
        </a>

        {/* Mobile: name the current section so dots aren't a mystery row. */}
        <span
          aria-hidden="true"
          className="text-[10px] uppercase tracking-[0.25em] text-bio lg:hidden"
        >
          {sections[sectionIndex]?.label}
        </span>

        <nav aria-label="Sections" className="pointer-events-auto">
          <ul className="flex items-center gap-1 sm:gap-2">
            {sections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-label={section.label}
                  aria-current={i === sectionIndex ? "true" : undefined}
                  className="group flex min-h-[44px] items-center gap-2 px-1.5"
                >
                  <span
                    className={`block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      i === sectionIndex
                        ? "bg-bio shadow-[0_0_8px_rgba(63,220,119,0.9)] scale-125"
                        : "bg-moss group-hover:bg-fern"
                    }`}
                  />
                  <span
                    className={`hidden text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 lg:block ${
                      i === sectionIndex ? "text-bio" : "text-mist/60 group-hover:text-mist"
                    }`}
                  >
                    {section.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
