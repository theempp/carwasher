"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { FrameScrubber } from "@/app/components/experience/FrameScrubber";
import { LoadingScreen } from "@/app/components/experience/LoadingScreen";
import { SceneOverlay } from "@/app/components/experience/SceneOverlay";
import { FILM } from "@/lib/scene/sceneTimeline";
import { useScrollProgress } from "@/lib/utils/useScrollProgress";

const VideoScrubber = dynamic(
  () =>
    import("@/app/components/experience/VideoScrubber").then(
      (mod) => mod.VideoScrubber,
    ),
  { ssr: false },
);

type MediaMode = "video" | "stills" | "placeholder";

export function CinematicStage() {
  const stageRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progress = useScrollProgress(stageRef, { videoRef });
  const [mode, setMode] = useState<MediaMode>("video");
  const [ready, setReady] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);
  const handleVideoFail = useCallback(() => {
    setMode("stills");
    setReady(false);
  }, []);
  const handleStillsFail = useCallback(() => {
    setMode("placeholder");
    setReady(true);
  }, []);

  return (
    <section
      ref={stageRef}
      data-tone="dark"
      className="relative h-dvh w-full overflow-hidden bg-ink"
    >
      {mode === "video" ? (
        <VideoScrubber
          videoRef={videoRef}
          onReady={handleReady}
          onFail={handleVideoFail}
        />
      ) : null}

      {mode === "stills" ? (
        <FrameScrubber
          progress={progress}
          onReady={handleReady}
          onFail={handleStillsFail}
        />
      ) : null}

      {mode === "placeholder" ? <FilmPlaceholder /> : null}

      {/* Station copy is composed into the shot — with no shot, only the
          placeholder speaks. Grain sits above the film, under the scrim. */}
      {mode === "placeholder" ? null : (
        <>
          <div className="film-grain pointer-events-none absolute inset-0 z-[5]" />
          <div className="film-scrim pointer-events-none absolute inset-0 z-10" />
          <SceneOverlay progress={progress} />
        </>
      )}
      <LoadingScreen visible={!ready && mode !== "placeholder"} />
    </section>
  );
}

function FilmPlaceholder() {
  return (
    <div className="absolute inset-0 z-0 flex items-center bg-ink px-[6vw]">
      <div>
        <p className="type-label text-muted">Film unavailable</p>
        <p className="type-display mt-5 max-w-[16ch] text-[clamp(2rem,6vw,4.5rem)] text-panel-fg">
          Place the scrub clip to begin.
        </p>
        <p className="mt-6 max-w-[26rem] text-[0.8rem] leading-relaxed tracking-[0.04em] text-muted">
          Missing{" "}
          <span className="text-panel-fg">public{FILM.scrub}</span>
          {" / "}
          <span className="text-panel-fg">public{FILM.scrubDesktop}</span> and
          the arrival / last-frame stills. Nothing here is a stand-in for
          footage.
        </p>
      </div>
    </div>
  );
}
