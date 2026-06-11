"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useAppStore } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * All DOM motion lives here, driven by data-attributes on the (server-
 * rendered) sections. With reduced motion or no JS, content simply stays
 * visible — every animation is a `from` on top of the natural state.
 */
export function DomAnimations() {
  const reducedMotion = useReducedMotion();
  const introReady = useAppStore((s) => s.introReady);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => {
      if (alive) setFontsReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Scroll-driven section animations — set up once fonts are stable so
  // SplitText line breaks are measured correctly.
  useGSAP(
    () => {
      if (!fontsReady || reducedMotion) return;

      // ---- Hero drifts up and dissolves as you enter the forest
      gsap.to("[data-hero-title], [data-hero-kicker], [data-hero-sub]", {
        yPercent: -40,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "70% top", scrub: true },
      });

      // ---- Scroll cue: firefly dot slides down its line forever
      gsap.fromTo(
        ".scroll-cue-dot",
        { y: -4, autoAlpha: 0 },
        { y: 44, autoAlpha: 1, duration: 1.7, repeat: -1, ease: "power1.inOut" },
      );

      // ---- About: line-by-line luminance reveal, scrubbed
      document.querySelectorAll<HTMLElement>("[data-about-line]").forEach((el) => {
        const split = SplitText.create(el, { type: "lines" });
        gsap.from(split.lines, {
          autoAlpha: 0.12,
          y: 26,
          stagger: 0.18,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 40%", scrub: true },
        });
      });

      // ---- Experience: vein line grows, cards surface one by one
      gsap.from("[data-xp-line]", {
        scaleY: 0,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: { trigger: "#experience", start: "top 70%", end: "bottom 75%", scrub: true },
      });
      gsap.from("[data-xp-card]", {
        autoAlpha: 0,
        x: -44,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: "#experience", start: "top 55%" },
      });

      // ---- Projects: each panel gets an entrance timeline + numeral parallax
      document.querySelectorAll<HTMLElement>("[data-project]").forEach((panel) => {
        const title = panel.querySelector("[data-project-title]");
        if (title) {
          const split = SplitText.create(title, { type: "chars" });
          gsap.from(split.chars, {
            yPercent: 105,
            autoAlpha: 0,
            stagger: 0.025,
            duration: 0.8,
            ease: "power4.out",
            scrollTrigger: { trigger: panel, start: "top 65%" },
          });
        }
        gsap.from(panel.querySelectorAll("[data-project-meta]"), {
          autoAlpha: 0,
          y: 30,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, start: "top 55%" },
        });
        const numeral = panel.querySelector("[data-project-numeral]");
        if (numeral) {
          gsap.fromTo(
            numeral,
            { yPercent: 18 },
            {
              yPercent: -18,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });

      // ---- Skills: chips swarm in like spores
      gsap.from("[data-skill-chip]", {
        autoAlpha: 0,
        y: 26,
        scale: 0.85,
        stagger: { each: 0.035, from: "random" },
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: "#skills", start: "top 60%" },
      });

      // ---- Contact: headline rises above the treeline
      const contactTitle = document.querySelector("[data-contact-title]");
      if (contactTitle) {
        const split = SplitText.create(contactTitle, { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          autoAlpha: 0,
          stagger: 0.03,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: "#contact", start: "top 60%" },
        });
      }

      ScrollTrigger.refresh();
    },
    { dependencies: [fontsReady, reducedMotion] },
  );

  // Magnetic buttons — pointer-following pull on [data-magnetic]
  useGSAP(
    () => {
      if (reducedMotion) return;
      const cleanups: (() => void)[] = [];
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
      return () => cleanups.forEach((fn) => fn());
    },
    { dependencies: [reducedMotion] },
  );

  // Hero intro — fires as the preloader wipe begins
  useGSAP(
    () => {
      if (!introReady || !fontsReady || reducedMotion) return;
      const split = SplitText.create("[data-hero-title] span", { type: "chars" });
      gsap
        .timeline({ delay: 0.35 })
        .from(split.chars, {
          yPercent: 115,
          autoAlpha: 0,
          stagger: 0.04,
          duration: 1.1,
          ease: "power4.out",
        })
        .from(
          "[data-hero-kicker], [data-hero-sub], [data-scroll-cue]",
          { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.15, ease: "power2.out" },
          "-=0.6",
        );
    },
    { dependencies: [introReady, fontsReady, reducedMotion] },
  );

  return null;
}
