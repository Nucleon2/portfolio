"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/lib/store";
import {
  sectionIndexAt,
  measureSegments,
  mapScrollToProgress,
  type MeasuredSegment,
} from "@/lib/sections";
import { useReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The scroll spine: Lenis smooth scrolling driven by GSAP's ticker, plus a
 * piecewise scroll→progress mapping (measured from real DOM boundaries) that
 * keeps every section locked to its camera beat. Progress is written to the
 * zustand store and read by the 3D layer in useFrame without re-renders.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let measured: MeasuredSegment[] = [];
    const remeasure = () => {
      measured = measureSegments();
    };

    const publish = (scrollY: number) => {
      const progress = mapScrollToProgress(scrollY, measured);
      const { setProgress, setSectionIndex, sectionIndex } = useAppStore.getState();
      setProgress(progress);
      const next = sectionIndexAt(progress);
      if (next !== sectionIndex) setSectionIndex(next);
    };

    if (!reducedMotion) {
      const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
      lenis.on("scroll", (e: { velocity: number }) => {
        ScrollTrigger.update();
        // Normalized scroll speed feeds particle streak + chromatic shift.
        useAppStore.getState().setScrollVelocity(Math.min(1, Math.abs(e.velocity) / 35));
      });
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // Anchor clicks glide through Lenis instead of jumping.
      const onClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!anchor) return;
        const target = document.querySelector(anchor.hash);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: 0 });
      };
      document.addEventListener("click", onClick);

      remeasure();
      const master = ScrollTrigger.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        onRefresh: () => {
          remeasure();
          publish(window.scrollY);
        },
        onUpdate: (self) => publish(self.scroll()),
      });
      publish(window.scrollY);

      return () => {
        master.kill();
        document.removeEventListener("click", onClick);
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    }

    // Reduced motion: native scroll, same mapping.
    remeasure();
    const onScroll = () => publish(window.scrollY);
    const onResize = () => {
      remeasure();
      publish(window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
