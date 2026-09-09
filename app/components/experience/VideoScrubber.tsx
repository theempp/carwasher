"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { FILM } from "@/lib/scene/sceneTimeline";

type VideoScrubberProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  onReady?: () => void;
  onFail?: () => void;
};

type FilmPick = {
  src: string;
  poster: string;
};

/** Cached so a remount (StrictMode) cannot swap src mid-session. */
let cachedPick: FilmPick | null = null;

/**
 * Choose the served file once, on the client, at mount.
 * Portrait / phone / small / low-DPR → 720p. Landscape desktop → 1080p.
 * This module is loaded with ssr:false so window is safe to read here.
 */
function pickFilmVariant(): FilmPick {
  if (cachedPick) return cachedPick;

  const shortSide = Math.min(window.innerWidth, window.innerHeight);
  const portrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
  const dpr = window.devicePixelRatio || 1;
  const desktop =
    shortSide >= 500 &&
    !portrait &&
    window.innerWidth >= 900 &&
    (dpr >= 1.25 || window.innerHeight > 800);

  cachedPick = desktop
    ? { src: FILM.scrubDesktop, poster: FILM.firstDesktop }
    : { src: FILM.scrub, poster: FILM.first };
  return cachedPick;
}

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
  const pick = pickFilmVariant();
  const [override, setOverride] = useState<FilmPick | null>(null);
  const triedDesktopFallback = useRef(false);
  const active = override ?? pick;

  // A missing file errors long before hydration, so the JSX handlers below
  // never see it. Re-read the element's own state once on mount.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.error || video.networkState === video.NETWORK_NO_SOURCE) {
      if (active.src === FILM.scrubDesktop && !triedDesktopFallback.current) {
        triedDesktopFallback.current = true;
        setOverride({ src: FILM.scrub, poster: FILM.first });
        return;
      }
      onFail?.();
      return;
    }
    if (video.readyState >= 2) {
      onReady?.();
      primeSeeking(video);
    }
  }, [videoRef, onReady, onFail, active]);

  return (
    <video
      ref={videoRef}
      className="film-scrub film-fit absolute inset-0 h-full w-full"
      src={active.src}
      poster={active.poster}
      muted
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      onLoadedData={(event) => {
        onReady?.();
        primeSeeking(event.currentTarget);
      }}
      onError={() => {
        if (active.src === FILM.scrubDesktop && !triedDesktopFallback.current) {
          triedDesktopFallback.current = true;
          setOverride({ src: FILM.scrub, poster: FILM.first });
          return;
        }
        onFail?.();
      }}
      aria-hidden
    />
  );
}
