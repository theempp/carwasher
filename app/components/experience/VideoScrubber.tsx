"use client";

import type { RefObject } from "react";
import { FILM } from "@/lib/scene/sceneTimeline";

type VideoScrubberProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  onReady?: () => void;
  onFail?: () => void;
};

export function VideoScrubber({
  videoRef,
  onReady,
  onFail,
}: VideoScrubberProps) {
  return (
    <video
      ref={videoRef}
      className="film-scrub absolute inset-0 h-full w-full object-cover"
      src={FILM.scrub}
      poster={FILM.first}
      muted
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      onLoadedData={(event) => {
        const video = event.currentTarget;
        onReady?.();

        // Brief play/pause primes seeking without leaving the clip running.
        const settle = () => {
          video.pause();
        };
        void video.play().then(settle).catch(settle);
      }}
      onError={() => onFail?.()}
      aria-hidden
    />
  );
}
