"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { skills, skillGroups, categoryColor, type Skill } from "@/data/skills";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Edge = { x1: number; y1: number; x2: number; y2: number };

const PROXIMITY = 180; // px radius the cursor "pulls" stars into brightness
const MAX_EDGE = 250; // don't connect stars farther apart than this

/** "#rrggbb" → "r, g, b" for rgba() interpolation. */
function rgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/** Star size by proficiency. Brighter, larger = stronger fluency. */
function dotPx(level: Skill["level"]): number {
  return level === 3 ? 9 : level === 2 ? 6 : 4;
}

/**
 * Skills as a living constellation: each skill is a star placed on a hand-tuned
 * star-map (see skills.ts), sized and lit by proficiency and tinted by cluster.
 * Faint bioluminescent threads connect nearest neighbours and draw themselves in
 * when the section scrolls into view; the cursor then brightens nearby stars and
 * the threads between them. Degrades to a clean grouped list on touch / mobile.
 */
export function Skills() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLButtonElement[]>([]);
  const centersRef = useRef<{ x: number; y: number }[]>([]);
  const lineRefs = useRef<SVGLineElement[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [edgeIdx, setEdgeIdx] = useState<[number, number][]>([]);
  const [revealed, setRevealed] = useState(false);

  const colors = useMemo(() => skills.map((s) => rgb(categoryColor[s.category])), []);

  // Inline callback refs fire every commit; clear here so stale nodes drop out.
  starsRef.current = [];
  lineRefs.current = [];

  // Measure star centres (relative to the container) and build nearest-neighbour
  // edges. Runs after layout and on resize; scale transforms are identity at rest.
  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const base = container.getBoundingClientRect();
    const centers = starsRef.current.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
    });
    centersRef.current = centers;

    const seen = new Set<string>();
    const idx: [number, number][] = [];
    centers.forEach((c, i) => {
      const near = centers
        .map((o, j) => ({ j, d: Math.hypot(o.x - c.x, o.y - c.y) }))
        .filter((o) => o.j !== i && o.d <= MAX_EDGE)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
      near.forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        idx.push(i < j ? [i, j] : [j, i]);
      });
    });
    setEdges(idx.map(([a, b]) => ({ x1: centers[a].x, y1: centers[a].y, x2: centers[b].x, y2: centers[b].y })));
    setEdgeIdx(idx);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Draw the threads in once the constellation scrolls into view. Under reduced
  // motion the CSS already forces the threads fully drawn, so no reveal is needed.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(container);
    return () => io.disconnect();
  }, []);

  // Cursor proximity: brighten/scale nearby stars and the threads between them.
  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: PointerEvent) => {
      const base = container.getBoundingClientRect();
      const mx = e.clientX - base.left;
      const my = e.clientY - base.top;
      const centers = centersRef.current;

      starsRef.current.forEach((el, i) => {
        const c = centers[i];
        if (!c) return;
        const t = Math.max(0, 1 - Math.hypot(c.x - mx, c.y - my) / PROXIMITY);
        const col = colors[i];
        el.style.transform = `scale(${1 + t * 0.26})`;
        el.style.borderColor = `rgba(${col}, ${0.22 + t * 0.7})`;
        el.style.color = t > 0.04 ? `rgb(${col})` : "";
        el.style.boxShadow = t > 0.04 ? `0 0 ${10 + t * 26}px rgba(${col}, ${t * 0.5})` : "";
      });

      lineRefs.current.forEach((line, k) => {
        const [a, b] = edgeIdx[k] ?? [];
        const ca = centers[a];
        const cb = centers[b];
        if (!ca || !cb) return;
        const t = Math.max(0, 1 - Math.hypot((ca.x + cb.x) / 2 - mx, (ca.y + cb.y) / 2 - my) / PROXIMITY);
        line.style.opacity = String(0.16 + t * 0.6);
      });
    };
    const onLeave = () => {
      starsRef.current.forEach((el) => {
        el.style.transform = "";
        el.style.borderColor = "";
        el.style.color = "";
        el.style.boxShadow = "";
      });
      lineRefs.current.forEach((line) => (line.style.opacity = "0.16"));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    container.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion, edgeIdx, colors]);

  return (
    <section
      id="skills"
      data-testid="section-skills"
      className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-32"
    >
      <h2 className="font-display mb-3 text-xs font-400 uppercase tracking-[0.5em] text-bio">Skills</h2>
      <p className="text-haloed mb-3 max-w-md text-sm text-mist">
        The toolkit behind the work<span className="hidden md:inline"> — hover to light up the constellation</span>.
      </p>
      <p className="text-haloed mb-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-mist/70">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-spore shadow-[0_0_10px_2px_rgba(184,255,217,0.7)]" />
          Core fluency
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-mist" />
          Working knowledge
        </span>
      </p>

      {/* ── Desktop: the star-map ───────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative hidden aspect-[16/9] w-full md:block"
        data-revealed={revealed}
      >
        {/* Constellation threads — draw in on reveal, then react to the cursor. */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {edges.map((e, i) => (
            <line
              key={i}
              ref={(node) => {
                if (node) lineRefs.current[i] = node;
              }}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="var(--color-bio)"
              strokeWidth={1}
              pathLength={1}
              className="constellation-thread"
              style={{ opacity: 0.16, transitionDelay: `${(i % 12) * 60}ms` }}
            />
          ))}
        </svg>

        {skills.map((skill, i) => {
          const col = categoryColor[skill.category];
          const size = dotPx(skill.level);
          return (
            <div
              key={skill.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
            >
              <button
                type="button"
                tabIndex={-1}
                data-skill-star
                ref={(node) => {
                  if (node) starsRef.current[i] = node;
                }}
                className="glow-chip flex items-center gap-2.5 whitespace-nowrap rounded-full border bg-abyss/30 px-4 py-2 backdrop-blur-[2px] will-change-transform"
                style={{
                  borderColor: `rgba(${rgb(col)}, 0.22)`,
                  color: "#d7ece0",
                }}
              >
                <span
                  aria-hidden="true"
                  className="inline-block shrink-0 rounded-full"
                  style={{
                    width: size,
                    height: size,
                    background: col,
                    boxShadow: `0 0 ${size + 4}px ${Math.round(size / 3)}px rgba(${rgb(col)}, ${
                      skill.level === 3 ? 0.7 : 0.4
                    })`,
                  }}
                />
                <span className={skill.level === 3 ? "text-[15px] font-500" : "text-[13px]"}>{skill.name}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Mobile: a clean, proficiency-lit grouped list ──────────────────── */}
      <div className="space-y-9 md:hidden">
        {skillGroups.map((group) => {
          const col = categoryColor[group.label];
          return (
            <div key={group.label}>
              <h3 className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-mist">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: col, boxShadow: `0 0 8px 1px rgba(${rgb(col)}, 0.6)` }}
                />
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-2.5">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    data-skill-star
                    className="flex items-center gap-2 rounded-full border border-moss bg-abyss/30 px-4 py-2 text-sm text-spore"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block rounded-full"
                      style={{
                        width: dotPx(skill.level),
                        height: dotPx(skill.level),
                        background: col,
                        boxShadow:
                          skill.level === 3 ? `0 0 8px 1px rgba(${rgb(col)}, 0.6)` : undefined,
                      }}
                    />
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
