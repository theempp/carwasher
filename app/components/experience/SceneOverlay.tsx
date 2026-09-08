"use client";

import { beatOpacity } from "@/lib/animation/easing";
import { sceneTimeline } from "@/lib/scene/sceneTimeline";

type SceneOverlayProps = {
  progress: number;
};

export function SceneOverlay({ progress }: SceneOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {sceneTimeline.map((beat, index) => {
        if (beat.scene === "sky-transition") return null;

        const opacity = beatOpacity(progress, beat.start, beat.end);
        const y = (1 - opacity) * 14;
        const number = String(index + 1).padStart(2, "0");

        return (
          <div
            key={beat.scene}
            className="absolute inset-0"
            style={{
              opacity,
              transform: `translate3d(0, ${y}px, 0)`,
              willChange: "transform, opacity",
            }}
            aria-hidden={opacity < 0.04}
          >
            <div className="absolute bottom-[16%] left-6 max-w-[16ch] md:left-12 lg:left-16">
              <p className="mb-4 font-mono text-[10px] tracking-[0.38em] text-mist uppercase whitespace-nowrap">
                {number}  /  {beat.scene}
              </p>
              <h2 className="font-display text-[clamp(3.2rem,8vw,8.5rem)] leading-[0.9] font-light tracking-[0.06em] text-foam">
                {beat.label}
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
}
