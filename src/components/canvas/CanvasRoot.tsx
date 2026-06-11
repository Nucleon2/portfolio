"use client";

import dynamic from "next/dynamic";

// ssr:false must live inside a client component in Next 16 — this file is
// the sole client boundary for the WebGL tree.
const Experience = dynamic(() => import("./Experience"), { ssr: false });

export function CanvasRoot() {
  return <Experience />;
}
