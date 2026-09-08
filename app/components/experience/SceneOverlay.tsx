"use client";

import { beatOpacity } from "@/lib/animation/easing";
import { sceneTimeline } from "@/lib/scene/sceneTimeline";

type SceneOverlayProps = {
  progress: number;
};

function SceneTitle({ label }: { label: string }) {
  const match = label.match(/^(THE) (.+)$/);
  if (!match) return label;
  return (
    <>
      {match[1]}
      <br />
      {match[2]}
    </>
  );
}

export function SceneOverlay({ progress }: SceneOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {sceneTimeline.map((beat, index) => {
        if (beat.scene === "sky-transition") return null;

        const opacity = beatOpacity(progress, beat.start, beat.end);
        const y = (1 - opacity) * 10;
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
            <div className="absolute top-[58%] left-5 w-[min(18ch,36vw)] -translate-y-1/2 md:left-8 md:w-[16ch] lg:left-12">
              <p className="mb-3 font-mono text-[9px] tracking-[0.32em] text-steel uppercase whitespace-nowrap md:text-[10px] md:tracking-[0.36em]">
                {number}  /  {beat.label}
              </p>
              <h2 className="font-display text-[clamp(1.65rem,3.6vw,3.15rem)] leading-[0.9] font-extrabold tracking-[-0.045em] text-bone">
                <SceneTitle label={beat.label} />
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
}
