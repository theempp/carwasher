"use client";

import { stationOpacity, stations } from "@/lib/scene/sceneTimeline";

type SceneOverlayProps = {
  progress: number;
};

export function SceneOverlay({ progress }: SceneOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {stations.map((station) => {
        const opacity = stationOpacity(progress, station);
        const visible = opacity > 0.02;
        const y = (1 - opacity) * 14;

        return (
          <div
            key={station.id}
            className="absolute top-[38%] left-0 w-full max-w-[min(42rem,92vw)] -translate-y-1/2 px-[6vw] md:top-[40%]"
            style={{
              opacity,
              transform: `translate3d(0, ${y}px, 0)`,
              clipPath: station.holdOpen
                ? undefined
                : `inset(0 ${((1 - opacity) * 18).toFixed(2)}% 0 0)`,
              willChange: "transform, opacity",
            }}
            aria-hidden={!visible}
          >
            <p className="type-label mb-4 text-muted">{station.eyebrow}</p>
            <h2 className="type-display max-w-[16ch] text-[clamp(2rem,5.6vw,4.35rem)] text-panel-fg">
              {station.headline[0]}
              <br />
              {station.headline[1]}
            </h2>
            <p className="mt-4 max-w-[26rem] text-[0.8rem] leading-relaxed tracking-[0.04em] text-muted">
              {station.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
