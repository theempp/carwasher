"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";

let lenis: Lenis | null = null;
let ticker: ((time: number) => void) | null = null;
let onScroll: (() => void) | null = null;

/**
 * Refcount, not a bare singleton. `SmoothScroll` (layout) and
 * `useScrollProgress` (stage) both depend on lenis, and React runs child
 * effects before parent effects — so the hook's ensure lands first and
 * SmoothScroll's StrictMode cleanup would otherwise destroy lenis, remove the
 * ticker and reset lagSmoothing while the hook's rAF loop is still live.
 * Teardown happens only when the last owner leaves, whatever the effect order.
 */
let owners = 0;
let stUpdateMs = 0;
let stUpdateN = 0;

const DEV = process.env.NODE_ENV !== "production";

function publishRuntime() {
  if (!DEV || typeof window === "undefined") return;
  window.__cineRuntime = {
    lenisOwners: owners,
    lenisAlive: Boolean(lenis),
    ticker: Boolean(ticker),
    stUpdateCount: stUpdateN,
    stUpdateMeanMs: stUpdateN ? stUpdateMs / stUpdateN : 0,
  };
}

function preferNativeScroll() {
  const touchOnly =
    window.matchMedia("(pointer: coarse)").matches &&
    window.matchMedia("(hover: none)").matches;
  const appleTouch =
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const smallTouch =
    Math.min(window.innerWidth, window.innerHeight) < 500 &&
    navigator.maxTouchPoints > 0;
  return touchOnly || appleTouch || smallTouch;
}

export function ensureSmoothScroll(): Lenis | null {
  if (typeof window === "undefined") return null;

  owners += 1;

  // Phones and tablets keep native touch scroll. Lenis on iOS fights the
  // scrub loop (delayed rAF + a second ScrollTrigger.update) and is what
  // made the film feel like it was not playing under a thumb.
  if (preferNativeScroll()) {
    publishRuntime();
    return null;
  }

  if (lenis) {
    publishRuntime();
    return lenis;
  }

  lenis = new Lenis({
    autoRaf: false,
    orientation: "vertical",
    gestureOrientation: "vertical",
    anchors: true,
  });

  /*
   * No scrollerProxy here. One was registered on document.documentElement and
   * was never consulted: the only ScrollTrigger.create in the app sets no
   * `scroller`, so it uses the default viewport. Worse than dead — its
   * scrollTop setter called lenis.scrollTo(..., { immediate: true }), a hard
   * jump, which a refresh-time scroll restore would have fired. Removed.
   *
   * Lenis writes the real document scroll position from inside the GSAP
   * ticker, so this listener lets ScrollTrigger read it in the same frame
   * rather than one frame late via the native scroll event. That native
   * listener still runs too, giving up to two update passes per frame — with a
   * single trigger that is close to free, and removing this call would trade it
   * for a one-frame read lag, which is a change in scroll feel. Measure before
   * touching it.
   */
  onScroll = () => {
    if (DEV) {
      const t0 = performance.now();
      ScrollTrigger.update();
      stUpdateMs += performance.now() - t0;
      stUpdateN += 1;
      const runtime = window.__cineRuntime;
      if (runtime) {
        runtime.stUpdateCount = stUpdateN;
        runtime.stUpdateMeanMs = stUpdateMs / stUpdateN;
      }
    } else {
      ScrollTrigger.update();
    }
  };
  lenis.on("scroll", onScroll);

  ticker = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  publishRuntime();
  return lenis;
}

export function releaseSmoothScroll() {
  if (owners > 0) owners -= 1;
  if (owners > 0 || !lenis) {
    publishRuntime();
    return;
  }

  if (ticker) gsap.ticker.remove(ticker);
  gsap.ticker.lagSmoothing(500);
  if (onScroll) lenis.off("scroll", onScroll);
  lenis.destroy();
  lenis = null;
  ticker = null;
  onScroll = null;
  publishRuntime();
}
