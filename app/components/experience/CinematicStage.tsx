"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { FrameScrubber } from "@/app/components/experience/FrameScrubber";
import { LoadingScreen } from "@/app/components/experience/LoadingScreen";
import { SceneOverlay } from "@/app/components/experience/SceneOverlay";
import { FILM, PIN_RUNWAY_VH } from "@/lib/scene/sceneTimeline";
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
  const runwayRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progress = useScrollProgress(runwayRef, { videoRef });
  const [mode, setMode] = useState<MediaMode>("video");
  const [firstFrame, setFirstFrame] = useState(false);
  const [settled, setSettled] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [loadProgress, setLoadProgress] = useState<number | null>(null);

  const handleFirstFrame = useCallback(() => setFirstFrame(true), []);
  const handleSettled = useCallback(() => setSettled(true), []);
  const handleWaiting = useCallback((next: boolean) => setWaiting(next), []);
  const handleBufferProgress = useCallback((next: number | null) => {
    setLoadProgress(next);
  }, []);
  const handleVideoFail = useCallback(() => {
    setMode("stills");
    setFirstFrame(false);
    setSettled(false);
    setWaiting(false);
    setLoadProgress(null);
  }, []);
  const handleStillsReady = useCallback(() => {
    setFirstFrame(true);
    setSettled(true);
    setWaiting(false);
  }, []);
  const handleStillsFail = useCallback(() => {
    setMode("placeholder");
    setFirstFrame(true);
    setSettled(true);
    setWaiting(false);
  }, []);

  const showLoading =
    mode !== "placeholder" && (!firstFrame || waiting || !settled);

  return (
    <>
      {/*
        Film is its own fixed layer — not a GSAP pin target. Pinning writes a
        transform onto the ancestor, and iOS Safari then composites <video> as
        black. Touches pass through so the document still scrolls.
      */}
      <div className="film-stage pointer-events-none fixed inset-0 z-0 h-dvh w-full bg-ink">
        {mode === "video" ? (
          <VideoScrubber
            videoRef={videoRef}
            onFirstFrame={handleFirstFrame}
            onBufferProgress={handleBufferProgress}
            onSettled={handleSettled}
            onWaiting={handleWaiting}
            onFail={handleVideoFail}
          />
        ) : null}

        {mode === "stills" ? (
          <FrameScrubber
            progress={progress}
            onReady={handleStillsReady}
            onFail={handleStillsFail}
          />
        ) : null}

        {mode === "placeholder" ? <FilmPlaceholder /> : null}

        {mode === "placeholder" ? null : (
          <>
            <div className="film-grain pointer-events-none absolute inset-0 z-[5]" />
            <div className="film-scrim pointer-events-none absolute inset-0 z-10" />
            <SceneOverlay progress={progress} />
          </>
        )}
        <LoadingScreen
          visible={showLoading}
          progress={waiting && loadProgress == null ? null : loadProgress}
        />
      </div>
      <section
        ref={runwayRef}
        data-tone="dark"
        aria-hidden
        className="w-full"
        style={{ height: `calc(${PIN_RUNWAY_VH + 1} * 100dvh)` }}
      />
    </>
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
