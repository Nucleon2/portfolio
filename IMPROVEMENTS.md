# Portfolio Review & Improvement Plan

**Reviewed:** 2026-06-11 · Live walkthrough via Playwright (desktop 1440×900 + mobile 390×844), full code read.

---

## TL;DR — Where this site stands

You've built something genuinely impressive. The bones are *Awwwards-tier already*: a custom WebGL bioluminescent forest (R3F + custom shaders), Lenis smooth scroll, GSAP SplitText choreography, a firefly cursor, magnetic buttons, per-project camera/tint hooks, reduced-motion fallbacks, JSON-LD, OG tags. Most portfolios never get within a mile of this.

So the goal of this document is **not** "fix a broken site." It's: *what separates a beautiful, well-engineered portfolio from one that wins a Site of the Day and makes an employer screenshot it and send it to a colleague.*

The honest answer: the craft is in the engine, but **the experience is fighting itself in three specific ways** — readability, monochromatic restraint, and "proof." Fix those three and you go from "wow, nice effects" to "wow, I want to hire this person."

The single highest-leverage insight from the walkthrough:

> **Every word of body copy is currently floating, unprotected, over a bright, busy, animated scene.** On the Rentra panel and the About section, the description text sits directly on top of glowing mushrooms and fireflies. It reads as "pretty but hard to actually read" — and judges/employers *read*.

---

## P0 — The three things that matter most

### 1. Protect your text. (Biggest single win.)
**Observed:** Project descriptions, About paragraphs, and highlight cards have `background-color: rgba(0,0,0,0)` — fully transparent — sitting over the brightest part of the WebGL scene. I confirmed this in the DOM. On the Rentra panel the sentence "A self-hostable, privacy-first platform…" lands right on a bloom highlight and partially disappears.

**Why it matters:** Awwwards judges score on *Design* and *Usability*. Gorgeous type you can't read tanks both. This is the #1 thing holding the site back from feeling premium rather than experimental.

**How to fix (pick one or layer them):**
- Add a **localized radial scrim** behind text blocks — not a flat box (that would kill the immersion), but a soft `radial-gradient(ellipse, rgba(4,16,10,0.75), transparent 70%)` pseudo-element behind each text column, blended with `mix-blend-mode` so it darkens the forest *only* where words are.
- OR introduce a subtle **vignette/darkening zone** in the 3D scene itself on the side where content sits (you already have a `CameraRig` and per-project `tint` — dim the scene's exposure when a panel is active).
- OR give text a faint `text-shadow: 0 1px 12px var(--color-abyss)` so each glyph carries its own contrast halo. Cheapest fix, surprisingly effective.
- Target **WCAG AA (4.5:1)** for body copy. Right now `--color-mist (#9db8a8)` over a variable bright-green background almost certainly fails in places.

### 2. Show the work. Projects have no visuals.
**Observed:** All five projects (Rentra, EthosAI, Solace, EcoSim, Wallet Risk Scorer) are **100% text** — title, pitch, bullets, tech pills, a "View source" button. No screenshot, no UI shot, no demo loop, no diagram.

**Why it matters:** This is the biggest gap for *employers* specifically. A hiring manager skims. "On-chain behavioral analysis + Discord voice coach" is intriguing but abstract — a 4-second muted loop of it working is worth more than the paragraph. Visual proof is also what makes a project section *Awwwards*-worthy; text-on-3D reads as a tech demo, not a showcase.

**How to fix:**
- Add **one hero visual per project**: a clean product screenshot, a short muted autoplay `<video>`/WebM loop, or even a stylized mockup in a device/browser frame.
- Frame it so it sits *within* the forest aesthetic — a glowing-edged "screen" floating in the scene, a slight tilt, a `fresnelGlow`-style rim (you already have that shader). Make the screenshot feel like it belongs in the world.
- If you have zero screenshots: even an **animated architecture diagram** or a terminal-output capture beats nothing.
- Add a **live demo link** alongside "View source" wherever one exists. Employers click "Live" far more than "Source."

### 3. Break the monochrome. One green is one note.
**Observed:** The entire site is a single hue. `--color-bio #3fdc77` and its tints carry hero, nav, cursor, every chip, every highlight, every glow, both CTAs, the contact headline. It's cohesive — but it's *one note held for 9,200px*. The "SOMETHING." headline and glow-text are also very heavy on bloom, so the brightest moments don't land as moments — everything is already maxed out.

**Why it matters:** Award-winning sites use restraint to create *peaks*. When everything glows, nothing glows. Tonal variation is also how you give each project its own identity and keep a long scroll from feeling samey.

**How to fix:**
- You already store a per-project **`tint`** in `projects.ts` (you noted it's used for "3D clearing"). **Lean into it hard.** Let each project shift the scene's accent: EthosAI could pull toward cyan/teal (blockchain), Solace toward Solana purple, EcoSim toward warm amber/sunrise (climate). The forest stays, the *light* changes. This single change makes the project journey feel cinematic and gives five distinct "rooms."
- **Dial back ambient glow, amplify intentional glow.** Reduce the default bloom/`glow-text` strength so most text is crisp, then let *one* element per section truly bloom (the project numeral, the contact headline). Contrast = drama.
- Introduce a **warm secondary accent** (a spore-gold, a sunrise) used sparingly — for the active nav state, a hover, the resume CTA. Two colors feel designed; one feels like a filter.

---

## P1 — Art direction & visual polish

- **The Skills section is the weakest screen.** On both desktop and mobile it's mostly empty space with small, faded chips floating in three thin rows. It reads as an afterthought next to the lavish project panels. Make it a *signature interactive moment*: chips that physically react to the cursor (repel/attract via the magnetic system you already have), or a constellation where related skills connect with bioluminescent lines, or skills that brighten as they "grow" on scroll. Right now it's a list; it should be an experience.
- **Experience reads like a pasted résumé.** Five near-identical bullet cards ("Gained hands-on exposure to…", "Developed understanding of…") under one role. It's the least confident copy on the site. Tighten to 2–3 punchy, outcome-led lines, and since there's only one entry, consider merging Experience into a richer "About / Journey" narrative rather than a lonely timeline of one.
- **Typographic hierarchy is top-heavy.** Display type (Unbounded) is stunning at hero scale, but body copy is uniform — one size, one weight, one color. Add editorial contrast: pull-quotes, a larger lead sentence per section, varied measure. Awwwards sites *art-direct* their paragraphs.
- **Section transitions are uniform.** Every section is `min-h-screen`, centered, same rhythm. Vary the choreography — one section that scrubs horizontally, one where content enters from the side, one full-bleed moment — so the scroll has a *plot*, not a metronome.
- **The hero `[13vw]` name** is great, but consider one signature flourish on load beyond the rise (e.g., the fireflies briefly swarm to trace the letters, then disperse). First 2 seconds decide the judge's mood.

---

## P1 — The 3D scene (your biggest differentiator — push it further)

You have a `CameraRig`, `LightShafts`, `Fireflies`, `Spores`, `Mushrooms`, `Grass`, `HorizonGlow`, and per-section progress mapping. This is a *world*, but right now it largely sits behind the content as a beautiful backdrop. To win, the world should **narrate the scroll**:

- **Make the camera travel.** Move *through* the forest as the user scrolls — descend from canopy at the hero, push down a path past each project, arrive at a clearing for contact. A journey beats a backdrop. (Your CameraRig is the hook for this.)
- **Tie scene state to content.** When a project is active, "clear" a space and bring its `tint`; have the fireflies gather around the active panel; brighten the mushrooms near the focused text (which *also* solves the contrast problem — light pools where you want attention, darkens elsewhere).
- **Interactive payoff.** Let the cursor disturb the scene — part the grass, scatter fireflies, ripple the spores. Tiny, but it's the kind of "I can touch the world" detail judges reward.
- **A reactive moment on the contact CTA** — clicking "Say hello" triggers a bloom/bioluminescent pulse through the whole forest. Memorable closer.

---

## P1 — Content, narrative & positioning (for employers)

- **Sharpen the tagline.** "Software developer & AI tinkerer" undersells. "Tinkerer" is charmingly humble but you've shipped RAG pipelines, an ML scam-detection model, and five real products. Lead with momentum: e.g. *"I build full-stack & AI products — and ship them."*
- **Add proof / signal.** Employers scan for evidence. Surface: GitHub stars/activity, "X hackathons," "open-source, self-hostable," a one-line metric per project ("ML model: 0.9X AUC", "handles N concurrent leases"). You have the substance — quantify it.
- **Make the résumé prominent and obvious.** It's currently one bordered button at the very bottom. A recruiter who lands and bounces never sees it. Consider a persistent (subtle) résumé affordance in the nav.
- **First-screen clarity.** The hero is atmospheric but an employer should know *who/what/where* in 3 seconds. "Building full-stack and AI-powered products from the ground up" is good — make sure it survives the readability fix above (it's faint over the scene).
- **Lean into the student-with-traction story.** "AP CS, class of 2026, already shipping production AI" is a *compelling* narrative — frame it as ascent, not as inexperience.

---

## P2 — Interaction & motion details

- **Custom cursor → add context labels.** The firefly cursor is lovely. Make it *say things*: "VIEW" over a project, "DRAG" if anything is draggable, "↗" over external links. Cursor labels are a hallmark of award sites and cost little given your cursor already tracks state.
- **Project panels need hover life.** They're static until you reach the CTA. Add a subtle parallax/tilt on the (forthcoming) project visual, a glow that follows the cursor across the panel, link underline draws.
- **Scroll-velocity feedback.** Pipe Lenis velocity into the scene — fireflies streak, spores blur, slight chromatic shift on fast scroll. Makes the whole page feel *alive* and physical.
- **Preloader** is clean but generic (dots + "Entering the forest"). A branded counter (0→100) or a single firefly igniting into the full scene would make the *first* impression match the rest.

---

## P2 — Performance (verify before you ship)

- **`THREE.Clock` deprecation warning** in console — minor, but migrate to `THREE.Timer` to keep it clean (judges/devs do open the console).
- **Measure FPS on a mid-range laptop and a real phone.** A full-screen R3F forest with bloom + many instanced fireflies/spores is heavy. Your last commit ("Fix pointer/scroll jank… cheap quality scaling") shows you're already on this — good. Confirm: 60fps desktop, ≥30fps mobile, no thermal throttle after 30s.
- **Respect data/battery.** Consider pausing the render loop when the tab is hidden and dropping particle counts / disabling bloom on low-power devices (you have quality scaling — make sure mobile actually steps down).
- **Lighthouse pass** — target green on Performance and 100 on Accessibility/Best-Practices/SEO. The contrast fixes above will move A11y; LCP may need attention given the WebGL boot + preloader.

---

## P2 — Accessibility

- **Contrast** (see P0 #1) — the biggest A11y issue. Mist text over a bright animated background fails AA in places. The scrim fix solves both aesthetics and compliance.
- **Mobile nav is unlabeled.** On 390px the top-right is just a row of tiny dots with no text (labels are `lg`-only). A first-time mobile visitor can't tell what they are. Add a minimal labeled menu or a hamburger → section list for small screens.
- **`cursor: none` everywhere** (via `html.has-cursor *`) — make sure focus-visible states are unmistakable for keyboard users since they get no pointer. Your `:focus-visible` outline exists; verify it's never clipped by `overflow` and is visible over the bright scene.
- **Reduced motion** is handled (nice) — double-check the WebGL scene also calms down (not just DOM animations) when `prefers-reduced-motion` is set; a churning forest can be nauseating.
- **Tap targets** — the nav dots and social links should be ≥44px touch targets on mobile.

---

## P2 — Sharing & SEO

- Solid foundation already: JSON-LD Person, OG + Twitter cards, keywords, `metadataBase`. 
- **Verify `og.png` is actually a designed, on-brand image** (it exists in `/public`) — this is the thumbnail an employer sees when your link is pasted into Slack/LinkedIn/iMessage. It should look like the hero. A great OG image is free marketing.
- **Confirm the live domain matches `https://ahmadkhamis.dev`** (metadataBase) — broken canonical/OG URLs are a common silent bug.
- Add `sitemap.ts` + `robots.ts` (trivial in Next 16 App Router) for clean indexing.

---

## Quick wins (do these this week)

1. **Text scrim / text-shadow** behind all body copy — instant readability + perceived quality jump. *(P0 #1)*
2. **Add one visual per project** — even static screenshots in glowing frames. *(P0 #2)*
3. **Tighten Experience copy** to 2–3 outcome lines; sharpen the hero tagline. *(P1)*
4. **Make Skills interactive** (cursor-reactive chips) so it stops being the dead screen. *(P1)*
5. **Add live-demo links + one metric per project.** *(P1 content)*
6. **Mobile nav labels** + verify 44px tap targets. *(A11y)*
7. **Fix `THREE.Clock` warning**, run Lighthouse + a real-phone FPS check. *(Perf)*
8. **Eyeball the `og.png`** and confirm the deployed domain. *(SEO)*

## The "Awwwards path" (the ambitious arc)

9. **Per-project tint takes over the scene** — five colored "rooms," cinematic. *(P0 #3 + 3D)*
10. **Camera travels through the forest** on scroll; light pools on active content (solves contrast *and* wows). *(3D)*
11. **Cursor labels + scroll-velocity reactivity + a clickable closing bloom.** *(Interaction)*

---

## What NOT to change

- The core forest concept, palette identity, and font pairing — keep them. They're distinctive and cohesive.
- The smooth-scroll + SplitText choreography — it's genuinely good; you're *adding* contrast and narrative, not replacing the engine.
- The custom cursor and magnetic buttons — extend them, don't remove them.

**Bottom line:** You're maybe 2–3 focused weekends from a Site-of-the-Day-caliber portfolio. The engine is already there. Spend that time making the words readable, the work visible, and the journey colorful — and this stops being "a cool effects demo" and becomes "the portfolio that got me the interview."
