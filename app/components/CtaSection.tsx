"use client";

import { beatOpacity } from "@/lib/animation/easing";
import { sceneTimeline } from "@/lib/scene/sceneTimeline";

// ▼ PASTE YOUR BOOKING LINK HERE — phone / Instagram DM / Calendly / Square
const BOOKING_HREF = "#";

const sky = sceneTimeline[sceneTimeline.length - 1];

type CtaSectionProps = {
  progress: number;
};

export function CtaSection({ progress }: CtaSectionProps) {
  const opacity = beatOpacity(progress, sky.start, sky.end);
  const interactive = opacity > 0.35;

  return (
    <section
      className="absolute inset-0 z-20 flex items-center justify-center"
      style={{
        opacity,
        transform: `translate3d(0, ${(1 - opacity) * 12}px, 0)`,
        willChange: "transform, opacity",
        pointerEvents: interactive ? "auto" : "none",
      }}
      aria-hidden={!interactive}
    >
      <div className="px-6 text-center">
        <p className="mb-6 font-mono text-[10px] tracking-[0.4em] text-mist uppercase">
          08  /  sky
        </p>
        <h2 className="font-display text-[clamp(3.4rem,10vw,9rem)] leading-[0.88] font-light tracking-[0.08em] text-foam">
          {sky.label}
        </h2>
        <a
          href={BOOKING_HREF}
          className="mt-10 inline-block font-mono text-[11px] tracking-[0.36em] text-accent uppercase underline decoration-accent/40 underline-offset-8 transition-colors duration-300 hover:text-foam hover:decoration-foam"
        >
          Reserve a time
        </a>
      </div>
    </section>
  );
}
