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
   * Seek holes re-open the readout via onWaiting.
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

function isAppleTouch() {
  return (
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    navigator.platform === "iPad" ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

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
 * Landscape desktop with a fine pointer → 1080.
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

function requestPaint(
  video: HTMLVideoElement,
  onPaint: () => void,
) {
  const rvfc = (
    video as HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
    }
  ).requestVideoFrameCallback;
  if (typeof rvfc === "function") {
    rvfc.call(video, () => onPaint());
  }
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
  const [frameUp, setFrameUp] = useState(false);
  const tried720 = useRef(false);
  const painted = useRef(false);
  const appleTouch = useRef(isAppleTouch());
  const onFirstFrameRef = useRef(onFirstFrame);
  const onFailRef = useRef(onFail);
  const active = override ?? pick;

  onFirstFrameRef.current = onFirstFrame;
  onFailRef.current = onFail;

  const markPainted = () => {
    if (painted.current) return;
    painted.current = true;
    setFrameUp(true);
  };

  const tryPaint = (video: HTMLVideoElement) => {
    onFirstFrameRef.current?.();
    requestPaint(video, markPainted);
    video.addEventListener("playing", markPainted, { once: true });
    void video
      .play()
      .then(() => video.pause())
      .catch(() => {
        // iOS often rejects play() until a gesture. The poster image stays up.
      });
  };

  const stepDown = () => {
    if (active.src !== FILM.scrub && !tried720.current) {
      tried720.current = true;
      painted.current = false;
      setFrameUp(false);
      setOverride({ src: FILM.scrub, poster: FILM.first });
      return;
    }
    onFailRef.current?.();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.muted = true;
    video.defaultMuted = true;

    if (video.error || video.networkState === video.NETWORK_NO_SOURCE) {
      stepDown();
      return;
    }
    if (video.readyState >= 2) {
      tryPaint(video);
    }
    // stepDown/tryPaint close over the current src; re-run when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- src is the only mount key we want
  }, [videoRef, active.src]);

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

  // iOS will not paint a frame (and may reject seeks) until play() runs
  // inside a user gesture. One pointerdown unlocks the rest of the session.
  useEffect(() => {
    if (!appleTouch.current) return;
    const video = videoRef.current;
    if (!video) return;

    const unlock = () => {
      requestPaint(video, markPainted);
      void video
        .play()
        .then(() => {
          video.pause();
          markPainted();
        })
        .catch(() => {});
    };
    window.addEventListener("pointerdown", unlock, { once: true, passive: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, [videoRef, active.src]);

  return (
    <>
      <video
        ref={videoRef}
        className="film-scrub film-fit absolute inset-0 z-0 h-full w-full"
        src={active.src}
        poster={active.poster}
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        onLoadedData={(event) => {
          tryPaint(event.currentTarget);
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
      {frameUp ? null : (
        // Native <video poster> often vanishes on iOS as soon as src is set,
        // and a black decoder surface would cover an image behind it. Keep a
        // real still on top until a decoded frame exists.
        <img
          src={active.poster}
          alt=""
          className="film-fit pointer-events-none absolute inset-0 z-[1] h-full w-full"
          draggable={false}
        />
      )}
    </>
  );
}
