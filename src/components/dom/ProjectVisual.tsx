"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { Project } from "@/data/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Host shown in the faux browser bar — prefers the live URL, falls back to repo. */
function hostLabel(project: Project): string {
  const url = project.liveUrl ?? project.github;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "localhost";
  }
}

/**
 * A glowing-edged "screen" floating in the forest — a clean device frame that
 * holds a project's hero shot. Until a real screenshot is dropped into
 * /public/projects, it renders a designed placeholder mockup tinted with the
 * project's accent, so the panel always shows *something* rather than reading
 * as a tech demo. Tilts and glows toward the cursor; static under reduced motion.
 */
export function ProjectVisual({ project }: { project: Project }) {
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!wrap || !card || !glare) return;

    const rotX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
    const rotY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });
    const glareX = gsap.quickTo(glare, "xPercent", { duration: 0.5, ease: "power3" });
    const glareY = gsap.quickTo(glare, "yPercent", { duration: 0.5, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const ny = (e.clientY - r.top) / r.height - 0.5;
      rotY(nx * 12);
      rotX(-ny * 12);
      glareX(nx * 60);
      glareY(ny * 60);
      gsap.to(glare, { opacity: 1, duration: 0.3 });
    };
    const onLeave = () => {
      rotX(0);
      rotY(0);
      gsap.to(glare, { opacity: 0, duration: 0.4 });
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion]);

  const tint = project.tint;

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none"
      style={{ perspective: "1200px" }}
      aria-hidden="true"
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-xl border bg-abyss/90 shadow-2xl will-change-transform"
        style={{
          borderColor: `${tint}55`,
          boxShadow: `0 0 0 1px ${tint}22, 0 18px 60px -12px ${tint}40, 0 0 90px -30px ${tint}66`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Faux browser chrome */}
        <div className="flex items-center gap-2 border-b border-moss/50 bg-abyss/80 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: `${tint}99` }} />
            <span className="h-2.5 w-2.5 rounded-full bg-moss" />
            <span className="h-2.5 w-2.5 rounded-full bg-moss" />
          </span>
          <span className="ml-2 flex-1 truncate rounded-md bg-moss/40 px-3 py-1 text-center text-[10px] tracking-wide text-mist">
            {hostLabel(project)}
          </span>
        </div>

        {/* Screen */}
        <div className="relative aspect-[16/10] w-full">
          {project.media ? (
            project.media.type === "video" ? (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={project.media.src}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                className="object-cover"
                src={project.media.src}
                alt={`${project.name} preview`}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            )
          ) : (
            <Placeholder project={project} />
          )}

          {/* Cursor-following glare */}
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 opacity-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${tint}33, transparent 55%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** Stylized abstract UI mockup — suggests an interface without faking a screenshot. */
function Placeholder({ project }: { project: Project }) {
  const tint = project.tint;
  return (
    <div
      className="absolute inset-0 flex flex-col gap-3 p-5"
      style={{
        background: `linear-gradient(135deg, ${tint}1f, transparent 55%), radial-gradient(ellipse at 80% 0%, ${tint}1a, transparent 60%)`,
      }}
    >
      <span
        className="font-display absolute bottom-4 right-5 text-5xl font-800 leading-none opacity-10 sm:text-6xl"
        style={{ color: tint }}
      >
        {project.index}
      </span>

      {/* faux top stat row */}
      <div className="flex gap-2.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-12 flex-1 rounded-md border border-moss/50 bg-abyss/50"
            style={{ borderColor: `${tint}33` }}
          />
        ))}
      </div>

      {/* faux body: sidebar + content lines */}
      <div className="flex flex-1 gap-3">
        <div className="hidden w-1/4 rounded-md border border-moss/40 bg-abyss/40 sm:block" />
        <div className="flex flex-1 flex-col justify-center gap-2.5">
          {[100, 82, 64, 90, 48].map((w, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full bg-moss/50"
              style={{
                width: `${w}%`,
                background: i === 0 ? `${tint}66` : undefined,
              }}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] uppercase tracking-[0.35em] text-mist/70">
        Preview
      </p>
    </div>
  );
}
