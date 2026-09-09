"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { FILM } from "@/lib/scene/sceneTimeline";

type VideoScrubberProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  /** First decoded frame. Does not mean the file is safe to scrub. */
  onFirstFrame?: () => void;
  /** Monotonic 0–1 from the buffered range that contains 0. Null if unknown. */
  onBufferProgress?: (progress: number | null) => void;
  /**
   * Initial buffer window has stopped growing (or covers the duration).
   * Not a promise that every timestamp is in RAM — Chrome will not fully
   * buffer a paused 143 MB all-intra. Seek holes re-open the readout via
   * onWaiting.
   */
  onSettled?: () => void;
  onWaiting?: (waiting: boolean) => void;
  onFail?: () => void;
};

type FilmPick = {
  src: string;
  poster: string;
};

/** Cached so a remount (StrictMode) cannot swap src mid-session. */
let cachedPick: FilmPick | null = null;

const SAMPLE_MS = 250;
const SETTLE_SAMPLES = 2;

function isTabletClass(): boolean {
  // iPad + trackpad reports pointer:fine, so coarse alone is not enough.
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const iPadOS =
    navigator.platform === "iPad" ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return coarse || iPadOS;
}

/**
 * Choose the served file once, on the client, at mount.
 * Portrait / phone / small / tablet / low-DPR → 720p.
 * Landscape desktop with a fine pointer → 4K.
 * This module is loaded with ssr:false so window is safe to read here.
 */
function pickFilmVariant(): FilmPick {
  if (cachedPick) return cachedPick;

  const shortSide = Math.min(window.innerWidth, window.innerHeight);
  const portrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
  const dpr = window.devicePixelRatio || 1;
  const desktopScreen =
    shortSide >= 500 &&
    !portrait &&
    window.innerWidth >= 900 &&
    (dpr >= 1.25 || window.innerHeight > 800);

  cachedPick =
    desktopScreen && !isTabletClass()
      ? { src: FILM.scrubDesktop, poster: FILM.firstDesktop }
      : { src: FILM.scrub, poster: FILM.first };
  return cachedPick;
}

/** Coverage of the range that contains t=0. Null if that range is missing. */
function bufferedFromStart(video: HTMLVideoElement): number | null {
  const duration = video.duration;
  if (!Number.isFinite(duration) || duration <= 0) return null;
  try {
    const { buffered } = video;
    if (buffered.length === 0) return 0;
    let end = 0;
    let hasStart = false;
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(i) <= 0.04) {
        hasStart = true;
        end = Math.max(end, buffered.end(i));
      }
    }
    if (!hasStart) return null;
    return Math.min(1, end / duration);
  } catch {
    return null;
  }
}

/** Brief play/pause primes seeking without leaving the clip running. */
function primeSeeking(video: HTMLVideoElement) {
  const settle = () => video.pause();
  void video.play().then(settle).catch(settle);
}

export function VideoScrubber({
  videoRef,
  onFirstFrame,
  onBufferProgress,
  onSettled,
  onWaiting,
  onFail,
}: VideoScrubberProps) {
  const pick = pickFilmVariant();
  const [override, setOverride] = useState<FilmPick | null>(null);
  const tried1080 = useRef(false);
  const tried720 = useRef(false);
  const active = override ?? pick;

  const stepDown = () => {
    if (active.src === FILM.scrubDesktop && !tried1080.current) {
      tried1080.current = true;
      setOverride({ src: FILM.scrub1080, poster: FILM.first1080 });
      return;
    }
    if (
      (active.src === FILM.scrubDesktop || active.src === FILM.scrub1080) &&
      !tried720.current
    ) {
      tried720.current = true;
      setOverride({ src: FILM.scrub, poster: FILM.first });
      return;
    }
    onFail?.();
  };

  // A missing file errors long before hydration, so the JSX handlers below
  // never see it. Re-read the element's own state once on mount.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.error || video.networkState === video.NETWORK_NO_SOURCE) {
      stepDown();
      return;
    }
    if (video.readyState >= 2) {
      onFirstFrame?.();
      primeSeeking(video);
    }
  }, [videoRef, onFirstFrame, onFail, active]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let last = -1;
    let still = 0;
    let settledSent = false;

    const markSettled = () => {
      if (settledSent) return;
      settledSent = true;
      onSettled?.();
    };

    const sample = () => {
      const raw = bufferedFromStart(video);
      if (raw == null) {
        onBufferProgress?.(null);
        return;
      }
      const next = last < 0 ? raw : Math.max(last, raw);
      if (last >= 0 && next - last < 0.002) still += 1;
      else still = 0;
      last = next;
      onBufferProgress?.(next);
      if (next >= 0.995) markSettled();
      else if (
        still >= SETTLE_SAMPLES &&
        video.readyState >= 2 &&
        !video.seeking
      ) {
        markSettled();
      }
    };

    const onWait = () => {
      if (video.readyState < 2) return;
      onWaiting?.(true);
    };
    const onGo = () => onWaiting?.(false);

    const id = window.setInterval(sample, SAMPLE_MS);
    sample();
    video.addEventListener("waiting", onWait);
    video.addEventListener("canplay", onGo);
    video.addEventListener("seeked", onGo);

    return () => {
      window.clearInterval(id);
      video.removeEventListener("waiting", onWait);
      video.removeEventListener("canplay", onGo);
      video.removeEventListener("seeked", onGo);
    };
  }, [videoRef, active.src, onBufferProgress, onSettled, onWaiting]);

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
        onFirstFrame?.();
        primeSeeking(event.currentTarget);
      }}
      onWaiting={(event) => {
        if (event.currentTarget.readyState < 2) return;
        onWaiting?.(true);
      }}
      onCanPlay={() => onWaiting?.(false)}
      onError={() => {
        stepDown();
      }}
      aria-hidden
    />
  );
}
