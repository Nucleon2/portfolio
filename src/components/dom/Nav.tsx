"use client";

import { useAppStore } from "@/lib/store";
import { sections } from "@/lib/sections";

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

      <nav aria-label="Sections" className="pointer-events-auto">
        <ul className="flex items-center gap-4 sm:gap-5">
          {sections.map((section, i) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={i === sectionIndex ? "true" : undefined}
                className="group flex items-center gap-2 py-2"
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
    </header>
  );
}
