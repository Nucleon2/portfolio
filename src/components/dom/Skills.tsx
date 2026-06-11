"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { skillGroups } from "@/data/skills";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Edge = { x1: number; y1: number; x2: number; y2: number };

const PROXIMITY = 170; // px radius the cursor "pulls" chips into brightness
const MAX_EDGE = 230; // don't connect chips farther apart than this

/**
 * Skills as a living constellation: chips are stars, connected by faint
 * bioluminescent lines. The cursor brightens nearby stars and the threads
 * between them — the section reacts instead of sitting as a dead list.
 */
export function Skills() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLLIElement[]>([]);
  const centersRef = useRef<{ x: number; y: number }[]>([]);
  const lineRefs = useRef<SVGLineElement[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [edgeIdx, setEdgeIdx] = useState<[number, number][]>([]);

  // Measure chip centers (relative to the container) and build nearest-neighbor
  // edges. Run after layout and on resize; transforms are identity at rest.
  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const base = container.getBoundingClientRect();
    const centers = chipsRef.current.map((el) => {
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
        .slice(0, 2);
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
    const id = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Cursor proximity: brighten/scale nearby chips and the threads between them.
  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: PointerEvent) => {
      const base = container.getBoundingClientRect();
      const mx = e.clientX - base.left;
      const my = e.clientY - base.top;
      const centers = centersRef.current;

      chipsRef.current.forEach((el, i) => {
        const c = centers[i];
        if (!c) return;
        const t = Math.max(0, 1 - Math.hypot(c.x - mx, c.y - my) / PROXIMITY);
        el.style.transform = `scale(${1 + t * 0.22})`;
        el.style.borderColor = t > 0.02 ? `rgba(125,255,176,${0.25 + t * 0.65})` : "";
        el.style.color = t > 0.02 ? `rgb(${184 + t * 71},255,${217 + t * 38})` : "";
        el.style.boxShadow = t > 0.05 ? `0 0 ${10 + t * 22}px rgba(63,220,119,${t * 0.4})` : "";
      });

      lineRefs.current.forEach((line, k) => {
        const [a, b] = edgeIdx[k] ?? [];
        const ca = centers[a];
        const cb = centers[b];
        if (!ca || !cb) return;
        const midx = (ca.x + cb.x) / 2;
        const midy = (ca.y + cb.y) / 2;
        const t = Math.max(0, 1 - Math.hypot(midx - mx, midy - my) / PROXIMITY);
        line.style.opacity = String(0.08 + t * 0.6);
      });
    };
    const onLeave = () => {
      chipsRef.current.forEach((el) => {
        el.style.transform = "";
        el.style.borderColor = "";
        el.style.color = "";
        el.style.boxShadow = "";
      });
      lineRefs.current.forEach((line) => (line.style.opacity = "0.08"));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    container.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion, edgeIdx]);

  let chipCursor = 0;

  return (
    <section
      id="skills"
      className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-32"
    >
      <h2 className="font-display mb-3 text-xs font-400 uppercase tracking-[0.5em] text-bio">
        Skills
      </h2>
      <p className="text-haloed mb-12 max-w-md text-sm text-mist">
        The toolkit behind the work — hover to light up the constellation.
      </p>

      <div ref={containerRef} className="relative">
        {/* Constellation threads */}
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
              style={{ opacity: 0.08 }}
            />
          ))}
        </svg>

        <div className="relative space-y-12">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <h3 className="mb-5 text-sm uppercase tracking-[0.3em] text-mist">{group.label}</h3>
              <ul className="flex flex-wrap gap-3">
                {group.skills.map((skill) => {
                  const i = chipCursor++;
                  return (
                    <li
                      key={skill}
                      ref={(node) => {
                        if (node) chipsRef.current[i] = node;
                      }}
                      data-skill-chip
                      className="glow-chip rounded-full border border-moss px-5 py-2.5 text-sm text-spore will-change-transform"
                    >
                      {skill}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
