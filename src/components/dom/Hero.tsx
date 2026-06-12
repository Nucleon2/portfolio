import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section
      id="hero"
      data-testid="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p
        data-hero-kicker
        className="text-haloed mb-6 text-xs uppercase tracking-[0.5em] text-mist sm:text-sm"
      >
        {profile.tagline} — {profile.location}
      </p>
      <h1
        data-hero-title
        data-testid="hero-title"
        className="font-display text-[13vw] font-800 leading-[0.95] tracking-tight text-spore uppercase sm:text-[10vw]"
      >
        <span className="block">{profile.firstName}</span>
        <span className="glow-text block text-bio">{profile.lastName}</span>
      </h1>
      <p data-hero-sub className="text-haloed mt-8 max-w-md text-sm text-spore/80 sm:text-base">
        I build full-stack and AI products from the ground up — and ship them.
      </p>

      <div
        data-scroll-cue
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-mist">Enter the forest</span>
        <span className="relative block h-12 w-px bg-moss">
          <span className="scroll-cue-dot absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-bio shadow-[0_0_8px_rgba(63,220,119,0.8)]" />
        </span>
      </div>
    </section>
  );
}
