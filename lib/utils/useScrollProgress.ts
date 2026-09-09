"use client";

import { useState, type RefObject } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/animation/gsap";
import {
  ensureSmoothScroll,
  releaseSmoothScroll,
} from "@/lib/animation/lenis";
import { cineEase } from "@/lib/animation/easing";
import { DAMPING, PIN_RUNWAY_VH } from "@/lib/scene/sceneTimeline";

type UseScrollProgressOptions = {
  videoRef?: RefObject<HTMLVideoElement | null>;
};

/**
 * Seconds. One frame of the 24fps film is 41.7ms, so this is ~7% of a frame —
 * far finer than anything that can change which frame is on screen. Raising it
 * to half a frame would cut the seek count sharply but quantizes the playhead,
 * which is a change in scroll feel. Left fine on purpose.
 */
const SEEK_EPSILON = 0.003;

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

  const issue = (video: HTMLVideoElement, t: number) => {
    lastRequested = t;
    inFlight = true;
    clearWatchdog();
    watchdog = window.setTimeout(() => {
      // `seeked` never arrived. Release the gate so the next frame can retry.
      watchdog = 0;
      inFlight = false;
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
    inFlight = false;
    clearWatchdog();
    if (DEV) stats.inFlight = 0;

    const next = pending;
    pending = null;
    if (bound && next !== null && Math.abs(next - lastRequested) > SEEK_EPSILON) {
      issue(bound, next);
    }
  };

  const reset = () => {
    inFlight = false;
    lastRequested = -1;
    pending = null;
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
    request(video: HTMLVideoElement | null, progress: number) {
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

      const t = progress * Math.max(0, video.duration - 0.04);

      if (inFlight || video.seeking) {
        pending = t;
        return;
      }
      if (Math.abs(t - lastRequested) <= SEEK_EPSILON) return;

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

      ScrollTrigger.create({
        trigger,
        start: "top top",
        end: () => `+=${window.innerHeight * PIN_RUNWAY_VH}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          target.value = self.progress;
        },
      });

      const apply = (snap: boolean) => {
        const k = reducedMotion || snap ? 1 : DAMPING;
        current.value += (target.value - current.value) * k;
        if (Math.abs(target.value - current.value) < 0.00005) {
          current.value = target.value;
        }

        const paced = cineEase(current.value);
        seeks.request(videoRef?.current ?? null, paced);

        if (snap || Math.abs(paced - lastPublished) > 0.0008) {
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
