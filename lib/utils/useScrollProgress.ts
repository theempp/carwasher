"use client";

import { useState, type RefObject } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/animation/gsap";
import {
  ensureSmoothScroll,
  releaseSmoothScroll,
} from "@/lib/animation/lenis";
import { cineEase } from "@/lib/animation/easing";
import { DAMPING, SEEK_EPSILON } from "@/lib/scene/sceneTimeline";

type UseScrollProgressOptions = {
  videoRef?: RefObject<HTMLVideoElement | null>;
};

/** Cap when the last seek blew the frame budget (busy 4K interior). */
const SEEK_EPSILON_MAX = SEEK_EPSILON * 3;
/** Wall-clock floor. The film is 24fps — more seeks than this is waste. */
const SEEK_GAP_MS = 1000 / 20;

/**
 * ms. iOS can drop `seeked` entirely when the decoder is under pressure or the
 * tab is backgrounded. Without this, one lost event wedges the playhead for the
 * rest of the session.
 */
const SEEK_TIMEOUT = 500;

type ScrubStats = {
  requests: number;
  seeks: number;
  inFlight: number;
  maxInFlight: number;
  timeouts: number;
};

declare global {
  interface Window {
    __scrubStats?: ScrubStats;
    __cineRuntime?: {
      lenisOwners: number;
      lenisAlive: boolean;
      ticker: boolean;
      stUpdateCount: number;
      stUpdateMeanMs: number;
    };
  }
}

const DEV = process.env.NODE_ENV !== "production";

/**
 * Keeps at most one seek in flight.
 *
 * `video.currentTime` keeps returning the pre-seek position until a seek
 * completes, so a guard that reads the element cannot tell that a seek to
 * nearly this same target is already pending, and re-issues it. The delta is
 * therefore measured against what was last *requested*, never against the
 * element. Intermediate targets are dropped rather than queued — damping
 * already makes the underlying path continuous, so coalescing only lowers the
 * sample rate of an already-smooth curve.
 */
function createSeekController() {
  let bound: HTMLVideoElement | null = null;
  let inFlight = false;
  let lastRequested = -1;
  let pending: number | null = null;
  let watchdog = 0;
  let issuedAt = 0;
  let lastIssueWall = 0;
  let lastSeekMs = 16;
  let gate = SEEK_EPSILON;

  const stats: ScrubStats = {
    requests: 0,
    seeks: 0,
    inFlight: 0,
    maxInFlight: 0,
    timeouts: 0,
  };
  if (DEV && typeof window !== "undefined") window.__scrubStats = stats;

  const clearWatchdog = () => {
    if (watchdog) {
      window.clearTimeout(watchdog);
      watchdog = 0;
    }
  };

  const refreshGate = (filmDeltaSec: number) => {
    const busy = lastSeekMs > 16 ? (lastSeekMs - 16) / 1000 : 0;
    gate = Math.min(
      SEEK_EPSILON_MAX,
      SEEK_EPSILON + busy + Math.max(0, filmDeltaSec) * 0.45,
    );
  };

  const issue = (video: HTMLVideoElement, t: number) => {
    lastRequested = t;
    inFlight = true;
    issuedAt = performance.now();
    lastIssueWall = issuedAt;
    clearWatchdog();
    watchdog = window.setTimeout(() => {
      // `seeked` never arrived. Release the gate so the next frame can retry.
      watchdog = 0;
      inFlight = false;
      lastSeekMs = SEEK_TIMEOUT;
      if (DEV) {
        stats.timeouts += 1;
        stats.inFlight = 0;
      }
    }, SEEK_TIMEOUT);

    if (DEV) {
      stats.seeks += 1;
      stats.inFlight += 1;
      stats.maxInFlight = Math.max(stats.maxInFlight, stats.inFlight);
    }
    video.currentTime = t;
  };

  const settle = () => {
    if (issuedAt) {
      lastSeekMs = performance.now() - issuedAt;
      issuedAt = 0;
    }
    inFlight = false;
    clearWatchdog();
    if (DEV) stats.inFlight = 0;

    const next = pending;
    pending = null;
    if (bound && next !== null && Math.abs(next - lastRequested) > gate) {
      issue(bound, next);
    }
  };

  const reset = () => {
    inFlight = false;
    lastRequested = -1;
    pending = null;
    issuedAt = 0;
    lastIssueWall = 0;
    lastSeekMs = 16;
    gate = SEEK_EPSILON;
    clearWatchdog();
    if (DEV) stats.inFlight = 0;
  };

  const detach = () => {
    if (!bound) return;
    bound.removeEventListener("seeked", settle);
    bound.removeEventListener("error", reset);
    bound.removeEventListener("emptied", reset);
  };

  return {
    request(
      video: HTMLVideoElement | null,
      progress: number,
      filmDeltaSec = 0,
    ) {
      // The scrubber is dynamic(ssr:false), so the element arrives after this
      // hook's effect has already run. Rebind whenever it changes.
      if (video !== bound) {
        detach();
        reset();
        bound = video;
        if (bound) {
          bound.addEventListener("seeked", settle);
          bound.addEventListener("error", reset);
          bound.addEventListener("emptied", reset);
        }
      }

      if (!video || !Number.isFinite(video.duration) || video.duration === 0) {
        return;
      }

      if (DEV) stats.requests += 1;

      refreshGate(filmDeltaSec);
      const t = progress * Math.max(0, video.duration - 0.04);

      if (inFlight || video.seeking) {
        pending = t;
        return;
      }
      if (Math.abs(t - lastRequested) <= gate) return;
      if (performance.now() - lastIssueWall < SEEK_GAP_MS) return;

      issue(video, t);
    },

    dispose() {
      detach();
      bound = null;
      reset();
    },
  };
}

export function useScrollProgress(
  triggerRef: RefObject<HTMLElement | null>,
  options: UseScrollProgressOptions = {},
): number {
  const { videoRef } = options;
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      ensureSmoothScroll();

      const seeks = createSeekController();
      const target = { value: 0 };
      const current = { value: 0 };
      let raf = 0;
      let lastPublished = -1;
      let reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const onMotionChange = () => {
        reducedMotion = mediaQuery.matches;
      };
      mediaQuery.addEventListener("change", onMotionChange);

      // Do not pin the film. GSAP pin writes `transform: matrix(1,0,0,1,0,0)`
      // onto the trigger, and iOS Safari paints a black <video> inside any
      // transformed ancestor — even an identity matrix. The stage is a fixed
      // layer plus an empty runway; this trigger is the runway only.
      ScrollTrigger.create({
        trigger,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          target.value = self.progress;
        },
      });

      const stage = document.querySelector<HTMLElement>(".film-stage");
      let after = document.querySelector<HTMLElement>(".after-pin");
      let lastPaced = 0;

      const apply = (snap: boolean) => {
        const k = reducedMotion || snap ? 1 : DAMPING;
        current.value += (target.value - current.value) * k;
        if (Math.abs(target.value - current.value) < 0.00005) {
          current.value = target.value;
        }

        if (!after || !after.isConnected) {
          after = document.querySelector<HTMLElement>(".after-pin");
        }
        const covered = Boolean(
          after && after.getBoundingClientRect().top <= 2,
        );
        if (stage && stage.classList.contains("is-covered") !== covered) {
          stage.classList.toggle("is-covered", covered);
        }

        const paced = cineEase(current.value);
        const video = videoRef?.current ?? null;
        const filmDelta = Math.abs(paced - lastPaced) * (video?.duration || 0);
        lastPaced = paced;
        if (!covered) {
          seeks.request(video, paced, filmDelta);
        }

        if (snap || Math.abs(paced - lastPublished) > 0.004) {
          lastPublished = paced;
          setProgress(paced);
        }
      };

      const frame = () => {
        apply(false);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);

      const onVisibility = () => {
        if (document.visibilityState !== "visible") return;
        const st = ScrollTrigger.getAll().find(
          (instance) => instance.trigger === trigger,
        );
        if (st) target.value = st.progress;
        current.value = target.value;
        apply(true);
      };
      document.addEventListener("visibilitychange", onVisibility);

      void document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("visibilitychange", onVisibility);
        mediaQuery.removeEventListener("change", onMotionChange);
        seeks.dispose();
        releaseSmoothScroll();
      };
    },
    { scope: triggerRef },
  );

  return progress;
}
