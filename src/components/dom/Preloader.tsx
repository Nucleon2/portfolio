"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAppStore } from "@/lib/store";
import { profile } from "@/data/profile";

const MIN_SHOW_MS = 1100;

/** Branded loader; wipes away once the WebGL scene has its first frame. */
export function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sceneReady = useAppStore((s) => s.sceneReady);
  const [gone, setGone] = useState(false);
  const [armed, setArmed] = useState(false);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = performance.now();
    // Safety: if WebGL never reports ready (blocked/unsupported), leave anyway —
    // the CSS fallback atmosphere keeps the site presentable.
    const failsafe = setTimeout(() => setArmed(true), 5000);
    return () => clearTimeout(failsafe);
  }, []);

  useEffect(() => {
    if (!sceneReady) return;
    const elapsed = performance.now() - mountedAt.current;
    const wait = Math.max(0, MIN_SHOW_MS - elapsed);
    const id = setTimeout(() => setArmed(true), wait);
    return () => clearTimeout(id);
  }, [sceneReady]);

  useGSAP(
    () => {
      if (!armed || gone) return;
      useAppStore.getState().setIntroReady(true);
      gsap
        .timeline({ onComplete: () => setGone(true) })
        .to("[data-preloader-inner]", { autoAlpha: 0, y: -24, duration: 0.45, ease: "power2.in" })
        .to(overlayRef.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.0,
          ease: "power4.inOut",
        });
    },
    { dependencies: [armed, gone] },
  );

  if (gone) return null;

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-label="Loading"
      className="bg-abyss fixed inset-0 z-50 flex items-center justify-center"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div data-preloader-inner className="flex flex-col items-center gap-6">
        <p className="font-display text-2xl font-800 uppercase tracking-tight text-spore sm:text-4xl">
          {profile.firstName}
          <span className="glow-text text-bio"> {profile.lastName}</span>
        </p>
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="preloader-dot h-1.5 w-1.5 rounded-full bg-bio" />
          <span className="preloader-dot h-1.5 w-1.5 rounded-full bg-bio [animation-delay:0.2s]" />
          <span className="preloader-dot h-1.5 w-1.5 rounded-full bg-bio [animation-delay:0.4s]" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.45em] text-mist">Entering the forest</p>
      </div>
    </div>
  );
}
