import { create } from "zustand";

export type QualityTier = "high" | "medium" | "low";

type AppState = {
  /** Global scroll progress 0..1 across the whole page journey */
  progress: number;
  /** Index of the section currently in view (for nav state) */
  sectionIndex: number;
  /** Render quality tier, stepped down by PerformanceMonitor */
  quality: QualityTier;
  /** True once the WebGL scene has compiled and first-rendered */
  sceneReady: boolean;
  /** True once the preloader wipe starts — gates the hero intro timeline */
  introReady: boolean;
  /** Normalized scroll velocity (~0..1), read by the scene for motion feedback */
  scrollVelocity: number;
  /** Monotonic counter; bumped to trigger a one-shot forest bloom pulse */
  ctaPulse: number;
  setProgress: (p: number) => void;
  setSectionIndex: (i: number) => void;
  setQuality: (q: QualityTier) => void;
  setSceneReady: (r: boolean) => void;
  setIntroReady: (r: boolean) => void;
  setScrollVelocity: (v: number) => void;
  pulseCta: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  progress: 0,
  sectionIndex: 0,
  quality: "high",
  sceneReady: false,
  introReady: false,
  scrollVelocity: 0,
  ctaPulse: 0,
  setProgress: (progress) => set({ progress }),
  setSectionIndex: (sectionIndex) => set({ sectionIndex }),
  setQuality: (quality) => set({ quality }),
  setSceneReady: (sceneReady) => set({ sceneReady }),
  setIntroReady: (introReady) => set({ introReady }),
  setScrollVelocity: (scrollVelocity) => set({ scrollVelocity }),
  pulseCta: () => set((s) => ({ ctaPulse: s.ctaPulse + 1 })),
}));
