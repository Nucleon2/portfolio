"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Firefly cursor — a bioluminescent core with a lagging glow-ring that
 * matches the forest. The ring eases behind the pointer; over interactive
 * elements it swells and brightens, like a firefly drawn to light.
 *
 * Only mounts on fine pointers (mouse/trackpad). Touch devices keep their
 * native behaviour and the native cursor stays hidden via `html.has-cursor`.
 */
export function Cursor() {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // Decide whether a custom cursor makes sense (fine pointer + hover support).
  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine) and (hover: hover)");
    const update = () => setEnabled(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const core = coreRef.current;
    const label = labelRef.current;
    if (!ring || !core || !label) return;

    document.documentElement.classList.add("has-cursor");

    // Center each element on the pointer via gsap's own transform (gsap's
    // x/y rewrite `transform`, so CSS translate can't be relied on here).
    gsap.set([ring, core], { xPercent: -50, yPercent: -50 });
    gsap.set(label, { xPercent: 12, yPercent: 12 });

    // Ring lags for a soft trailing feel; core tracks tightly. With reduced
    // motion both snap to the pointer (no lag, no drift).
    const ringDur = reducedMotion ? 0 : 0.5;
    const coreDur = reducedMotion ? 0 : 0.12;
    const ringX = gsap.quickTo(ring, "x", { duration: ringDur, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: ringDur, ease: "power3" });
    const coreX = gsap.quickTo(core, "x", { duration: coreDur, ease: "power3" });
    const coreY = gsap.quickTo(core, "y", { duration: coreDur, ease: "power3" });
    const labelX = gsap.quickTo(label, "x", { duration: reducedMotion ? 0 : 0.16, ease: "power3" });
    const labelY = gsap.quickTo(label, "y", { duration: reducedMotion ? 0 : 0.16, ease: "power3" });

    let shown = false;
    const interactive = 'a, button, input, textarea, select, label, [role="button"], [data-magnetic]';

    const onMove = (e: PointerEvent) => {
      ringX(e.clientX);
      ringY(e.clientY);
      coreX(e.clientX);
      coreY(e.clientY);
      labelX(e.clientX);
      labelY(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to([ring, core], { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
      }
    };

    // A context word the cursor "speaks" over an element — explicit
    // data-cursor-label wins, else an external link reads as ↗, else VIEW.
    const labelFor = (el: Element): string => {
      const labeled = el.closest<HTMLElement>("[data-cursor-label]");
      if (labeled?.dataset.cursorLabel) return labeled.dataset.cursorLabel;
      const anchor = el.closest<HTMLAnchorElement>("a");
      if (anchor?.target === "_blank") return "↗";
      return "VIEW";
    };

    const onOver = (e: PointerEvent) => {
      const hit = (e.target as Element)?.closest?.(interactive);
      if (hit) {
        gsap.to(ring, { scale: 1.9, borderColor: "rgba(125,255,176,0.9)", duration: 0.3, ease: "power3" });
        gsap.to(core, { scale: 0.5, duration: 0.3, ease: "power3" });
        label.textContent = labelFor(hit);
        gsap.to(label, { autoAlpha: 1, duration: 0.25, ease: "power2.out" });
      }
    };
    const onOut = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.(interactive)) {
        gsap.to(ring, { scale: 1, borderColor: "rgba(63,220,119,0.55)", duration: 0.3, ease: "power3" });
        gsap.to(core, { scale: 1, duration: 0.3, ease: "power3" });
        gsap.to(label, { autoAlpha: 0, duration: 0.2, ease: "power2.out" });
      }
    };

    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.18, ease: "power2.out" });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.25, ease: "power2.out" });

    const onLeaveWindow = () => gsap.to([ring, core, label], { autoAlpha: 0, duration: 0.25 });
    const onEnterWindow = () => {
      if (shown) gsap.to([ring, core], { autoAlpha: 1, duration: 0.25 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    // mouseleave/enter on <html> reliably fire when the pointer exits/enters
    // the viewport (pointerleave on document does not).
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    document.documentElement.addEventListener("mouseenter", onEnterWindow);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", onEnterWindow);
    };
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      {/* Lagging glow-ring */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border opacity-0 will-change-transform"
        style={{
          borderColor: "rgba(63,220,119,0.55)",
          boxShadow: "0 0 18px rgba(63,220,119,0.35), inset 0 0 10px rgba(63,220,119,0.15)",
        }}
      />
      {/* Bioluminescent core */}
      <div
        ref={coreRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full opacity-0 will-change-transform"
        style={{
          background: "var(--color-bio-bright)",
          boxShadow: "0 0 10px 2px rgba(125,255,176,0.9), 0 0 22px 6px rgba(63,220,119,0.5)",
        }}
      />
      {/* Context label the cursor "speaks" over interactive elements */}
      <div
        ref={labelRef}
        className="font-display absolute left-0 top-0 rounded-full bg-bio px-2.5 py-1 text-[9px] font-700 uppercase tracking-[0.2em] text-abyss opacity-0 will-change-transform"
      />
    </div>
  );
}
