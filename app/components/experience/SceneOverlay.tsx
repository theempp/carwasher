"use client";

import { stationOpacity, stations } from "@/lib/scene/sceneTimeline";

type SceneOverlayProps = {
  progress: number;
};

export function SceneOverlay({ progress }: SceneOverlayProps) {
  const typeScrim = stations.reduce(
    (peak, station) => Math.max(peak, stationOpacity(progress, station)),
    0,
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div
        className="film-scrim-type absolute inset-0"
        style={{ opacity: typeScrim }}
        aria-hidden
      />
      {stations.map((station) => {
        const opacity = stationOpacity(progress, station);
        const visible = opacity > 0.02;
        const y = (1 - opacity) * 14;

        return (
          <div
            key={station.id}
            className="absolute top-[38%] left-0 w-full max-w-[min(42rem,92vw)] -translate-y-1/2 px-[6vw] md:top-[40%] [@media(max-aspect-ratio:1/1)]:top-auto [@media(max-aspect-ratio:1/1)]:bottom-[17vh] [@media(max-aspect-ratio:1/1)]:translate-y-0"
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
            <p className="type-label mb-4 text-panel-fg/70">{station.eyebrow}</p>
            <h2 className="type-display max-w-[16ch] text-[clamp(2rem,5.6vw,4.35rem)] text-panel-fg">
              {station.headline[0]}
              <br />
              {station.headline[1]}
            </h2>
            <p className="mt-4 max-w-[26rem] text-[0.8rem] leading-relaxed tracking-[0.04em] text-panel-fg/80">
              {station.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
