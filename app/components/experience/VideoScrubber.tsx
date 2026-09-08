"use client";

import { useEffect, type RefObject } from "react";
import { FILM } from "@/lib/scene/sceneTimeline";

type VideoScrubberProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  onReady?: () => void;
  onFail?: () => void;
};

/** Brief play/pause primes seeking without leaving the clip running. */
function primeSeeking(video: HTMLVideoElement) {
  const settle = () => video.pause();
  void video.play().then(settle).catch(settle);
}

export function VideoScrubber({
  videoRef,
  onReady,
  onFail,
}: VideoScrubberProps) {
  // A missing file errors long before hydration, so the JSX handlers below
  // never see it. Re-read the element's own state once on mount.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.error || video.networkState === video.NETWORK_NO_SOURCE) {
      onFail?.();
      return;
    }
    if (video.readyState >= 2) {
      onReady?.();
      primeSeeking(video);
    }
  }, [videoRef, onReady, onFail]);

  return (
    <video
      ref={videoRef}
      className="film-scrub film-fit absolute inset-0 h-full w-full"
      src={FILM.scrub}
      poster={FILM.first}
      muted
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      onLoadedData={(event) => {
        onReady?.();
        primeSeeking(event.currentTarget);
      }}
      onError={() => onFail?.()}
      aria-hidden
    />
  );
}
