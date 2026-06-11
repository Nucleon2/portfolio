import * as THREE from "three";
import { projects } from "@/data/projects";

/** Deterministic RNG so instanced scatter is identical every run (no hydration drift). */
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The journey runs from z=+10 (hero, edge of the forest) to z=-80
 * (contact, above the treeline). The camera weaves left/right through
 * five project clearings.
 */
export const CAMERA_POINTS: THREE.Vector3[] = [
  new THREE.Vector3(0, 1.4, 10), // hero — low in the grass
  new THREE.Vector3(0, 1.7, 4), // hero exit
  new THREE.Vector3(1.4, 2.0, -8), // about — between tree rows
  new THREE.Vector3(-2.0, 1.8, -20), // experience — along the vein
  new THREE.Vector3(2.4, 1.8, -30), // clearing 1
  new THREE.Vector3(-2.4, 1.8, -38), // clearing 2
  new THREE.Vector3(2.4, 1.8, -46), // clearing 3
  new THREE.Vector3(-2.4, 1.8, -54), // clearing 4
  new THREE.Vector3(2.4, 2.0, -62), // clearing 5
  new THREE.Vector3(0, 6.0, -70), // skills — rising through canopy
  new THREE.Vector3(0, 10.5, -80), // contact — above the treeline
];

export const LOOKAT_POINTS: THREE.Vector3[] = [
  new THREE.Vector3(0, 1.7, 2),
  new THREE.Vector3(0.6, 1.9, -4),
  new THREE.Vector3(-0.8, 1.9, -16),
  new THREE.Vector3(1.2, 1.5, -27),
  new THREE.Vector3(-1.8, 1.2, -33), // look across at clearing 1
  new THREE.Vector3(1.8, 1.2, -41), // clearing 2
  new THREE.Vector3(-1.8, 1.2, -49), // clearing 3
  new THREE.Vector3(1.8, 1.2, -57), // clearing 4
  new THREE.Vector3(-1.8, 1.4, -65), // clearing 5
  new THREE.Vector3(0, 11, -78), // skills — tilt up
  new THREE.Vector3(0, 12, -105), // contact — horizon
];

/** One mushroom clearing per project, on the side the camera looks toward. */
export const CLEARINGS = projects.map((project, i) => ({
  id: project.id,
  tint: new THREE.Color(project.tint),
  position: new THREE.Vector3(i % 2 === 0 ? -1.9 : 1.9, 0, -31 - i * 8),
}));

/** Fog density keyframes over global progress — fog IS the art direction. */
export const FOG_KEYFRAMES: [number, number][] = [
  [0.0, 0.048],
  [0.15, 0.068], // entering the forest — thickest
  [0.27, 0.052],
  [0.5, 0.042],
  [0.78, 0.032],
  [0.92, 0.02],
  [1.0, 0.011], // above the treeline — clear
];

export function sampleKeyframes(frames: [number, number][], t: number): number {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 0; i < frames.length - 1; i++) {
    const [t0, v0] = frames[i];
    const [t1, v1] = frames[i + 1];
    if (t >= t0 && t <= t1) {
      const k = (t - t0) / (t1 - t0);
      return v0 + (v1 - v0) * k;
    }
  }
  return frames[frames.length - 1][1];
}

export const ABYSS = "#04100a";
export const BIO = "#3fdc77";
export const BIO_BRIGHT = "#7dffb0";
export const SPORE = "#b8ffd9";

export const ABYSS_COLOR = new THREE.Color(ABYSS);
const BIO_COLOR = new THREE.Color(BIO);

/**
 * Accent color over the journey — the forest stays green, but the *light*
 * shifts per project so the five clearings read as five distinct "rooms".
 * Outside the projects band the accent rests on the house green; inside it,
 * it peaks on each project's tint at the center of that beat and crossfades
 * between rooms. Stops are [globalProgress, color].
 */
// Mirror of the projects range in sections.ts (kept local to avoid a DOM import).
const PROJECTS_BAND: [number, number] = [0.32, 0.78];

type ColorStop = [number, THREE.Color];
const ACCENT_STOPS: ColorStop[] = (() => {
  const [start, end] = PROJECTS_BAND;
  const span = (end - start) / CLEARINGS.length;
  const stops: ColorStop[] = [
    [0, BIO_COLOR],
    [start, BIO_COLOR],
  ];
  CLEARINGS.forEach((clearing, i) => {
    stops.push([start + span * (i + 0.5), clearing.tint]);
  });
  stops.push([end, BIO_COLOR], [1, BIO_COLOR]);
  return stops;
})();

/** Shared, frame-mutated accent. Read by reference in useFrame loops — never
 *  reassigned, so no React re-renders and no per-frame allocation. */
export const SCENE_ACCENT = new THREE.Color(BIO);

/** Write the accent for a given global progress into `out`. */
export function sampleAccent(t: number, out: THREE.Color): THREE.Color {
  if (t <= ACCENT_STOPS[0][0]) return out.copy(ACCENT_STOPS[0][1]);
  for (let i = 0; i < ACCENT_STOPS.length - 1; i++) {
    const [t0, c0] = ACCENT_STOPS[i];
    const [t1, c1] = ACCENT_STOPS[i + 1];
    if (t >= t0 && t <= t1) {
      const k = THREE.MathUtils.smoothstep(t, t0, t1);
      return out.copy(c0).lerp(c1, k);
    }
  }
  return out.copy(ACCENT_STOPS[ACCENT_STOPS.length - 1][1]);
}
