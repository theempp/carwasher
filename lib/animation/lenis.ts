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

export function ensureSmoothScroll(): Lenis | null {
  if (typeof window === "undefined") return null;

  owners += 1;
  if (lenis) return lenis;

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
    ScrollTrigger.update();
  };
  lenis.on("scroll", onScroll);

  ticker = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function releaseSmoothScroll() {
  if (owners > 0) owners -= 1;
  if (owners > 0 || !lenis) return;

  if (ticker) gsap.ticker.remove(ticker);
  gsap.ticker.lagSmoothing(500);
  if (onScroll) lenis.off("scroll", onScroll);
  lenis.destroy();
  lenis = null;
  ticker = null;
  onScroll = null;
}
