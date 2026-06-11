# Ahmad Khamis — Portfolio

A scroll-driven journey through a bioluminescent forest. Built with Next.js 16, TypeScript, React Three Fiber and GSAP, running on Bun.

**Live experience**: one continuous camera flight — hero → about → experience → five project clearings → skills → above the treeline.

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**, package manager **Bun**
- **React Three Fiber + three.js** — fully procedural scene (no 3D model assets): instanced trees/grass/mushrooms, shader-based fireflies & spores, fake god rays, mycelium-vein ground shader, FogExp2 art direction, Bloom/Vignette/Noise post
- **GSAP + ScrollTrigger + SplitText** for DOM animation, **Lenis** smooth scroll
- **Tailwind v4** CSS-first theme, **zustand** scroll→3D bridge

## Develop

```bash
bun install
bun dev        # http://localhost:3000
bun run build  # production build
```

## Architecture notes

- One persistent fixed `<Canvas>` behind the DOM; the camera glides along a Catmull-Rom spline (plus a parallel lookAt curve) driven by scroll progress.
- `src/lib/sections.ts` is the single source of truth mapping DOM sections to progress ranges; real DOM boundaries are measured at runtime and piecewise-remapped so every panel stays locked to its 3D beat.
- All copy lives in `src/data/` and renders as semantic server-side HTML — the WebGL layer is purely decorative to crawlers.
- Honors `prefers-reduced-motion`, steps render quality down via PerformanceMonitor, and falls back to a CSS atmosphere if WebGL is unavailable.
