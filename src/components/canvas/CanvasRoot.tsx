"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

// ssr:false must live inside a client component in Next 16 — this file is
// the sole client boundary for the WebGL tree.
const Experience = dynamic(() => import("./Experience"), { ssr: false });

export function CanvasRoot() {
  // The automation check must run *after* hydration: deciding on the first
  // client render would diverge from the server's output and throw a hydration
  // mismatch. So we render Experience exactly like the server until mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Automated browsers (Playwright/WebDriver) skip the WebGL forest: the scene
  // is purely visual, and several parallel GL contexts crash headless renderer
  // processes. The CSS fallback atmosphere stays visible, and we flag the scene
  // ready so the preloader wipes on schedule. Real users are never affected —
  // `navigator.webdriver` is only true under automation.
  const automated =
    mounted && typeof navigator !== "undefined" && navigator.webdriver === true;

  useEffect(() => {
    if (automated) useAppStore.getState().setSceneReady(true);
  }, [automated]);

  if (automated) return null;
  return <Experience />;
}
