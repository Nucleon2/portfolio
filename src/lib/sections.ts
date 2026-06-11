/**
 * Single source of truth mapping each section of the journey to its
 * range of global scroll progress. Drives the camera spline sampling,
 * per-section scene state (fog, particle density, clearing tints) and
 * nav active states. Tune ranges here, everything follows.
 */
export type SectionDef = {
  id: string;
  label: string;
  /** [start, end] of global scroll progress, 0..1 */
  range: [number, number];
};

export const sections: SectionDef[] = [
  { id: "hero", label: "Intro", range: [0.0, 0.1] },
  { id: "about", label: "About", range: [0.1, 0.2] },
  { id: "experience", label: "Experience", range: [0.2, 0.32] },
  { id: "projects", label: "Projects", range: [0.32, 0.78] },
  { id: "skills", label: "Skills", range: [0.78, 0.9] },
  { id: "contact", label: "Contact", range: [0.9, 1.0] },
];

/** Per-project sub-ranges inside the projects band (5 equal beats). */
export const projectRange = (i: number, count = 5): [number, number] => {
  const [start, end] = sections.find((s) => s.id === "projects")!.range;
  const span = (end - start) / count;
  return [start + i * span, start + (i + 1) * span];
};

/** Map global progress to section index. */
export const sectionIndexAt = (progress: number): number => {
  for (let i = sections.length - 1; i >= 0; i--) {
    if (progress >= sections[i].range[0]) return i;
  }
  return 0;
};

/** 0..1 progress within a [start,end] range, clamped. */
export const rangeProgress = (progress: number, [start, end]: [number, number]) =>
  Math.min(1, Math.max(0, (progress - start) / (end - start)));

/**
 * Scroll→progress segments: one per camera beat, with project panels split
 * out individually. DOM heights never match planned fractions exactly, so
 * scroll position is piecewise-remapped from measured DOM boundaries onto
 * these planned ranges — keeping every panel locked to its 3D beat.
 */
export type Segment = { domId: string; range: [number, number] };

export const segments: Segment[] = [
  { domId: "hero", range: [0.0, 0.1] },
  { domId: "about", range: [0.1, 0.2] },
  { domId: "experience", range: [0.2, 0.32] },
  { domId: "project-rentra", range: projectRange(0) },
  { domId: "project-ethosai", range: projectRange(1) },
  { domId: "project-solace", range: projectRange(2) },
  { domId: "project-ecosim", range: projectRange(3) },
  { domId: "project-wallet-risk", range: projectRange(4) },
  { domId: "skills", range: [0.78, 0.9] },
  { domId: "contact", range: [0.9, 1.0] },
];

export type MeasuredSegment = { start: number; end: number; range: [number, number] };

/** Measure segment scroll boundaries. A segment becomes active when its top
 * reaches mid-viewport, so the camera settles while the panel is centered. */
export function measureSegments(): MeasuredSegment[] {
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  const tops = segments.map((seg, i) => {
    if (i === 0) return 0;
    const el = document.getElementById(seg.domId);
    if (!el) return 0;
    // Document-absolute top (offsetTop would be relative to the nearest
    // positioned ancestor, which breaks for project panels).
    const top = el.getBoundingClientRect().top + window.scrollY;
    return Math.max(0, top - vh * 0.5);
  });
  return segments.map((seg, i) => ({
    start: tops[i],
    end: i < segments.length - 1 ? tops[i + 1] : max,
    range: seg.range,
  }));
}

/** Piecewise-linear map of scrollY onto planned global progress. */
export function mapScrollToProgress(scrollY: number, measured: MeasuredSegment[]): number {
  if (measured.length === 0) return 0;
  for (const seg of measured) {
    if (scrollY <= seg.end || seg === measured[measured.length - 1]) {
      const span = Math.max(1, seg.end - seg.start);
      const k = Math.min(1, Math.max(0, (scrollY - seg.start) / span));
      return seg.range[0] + (seg.range[1] - seg.range[0]) * k;
    }
  }
  return 1;
}
