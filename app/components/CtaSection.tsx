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
        <h2 className="font-display mx-auto max-w-[11ch] text-[clamp(2.4rem,6.2vw,5.25rem)] leading-[0.9] font-extrabold tracking-[-0.04em] text-bone">
          {sky.label}
        </h2>
        <a
          href={BOOKING_HREF}
          className="mt-8 inline-block font-mono text-[10px] tracking-[0.36em] text-amber uppercase underline decoration-amber decoration-1 underline-offset-[10px] transition-colors duration-300 hover:text-bone hover:decoration-bone"
        >
          Reserve a time
        </a>
      </div>
    </section>
  );
}
