"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";

let lenis: Lenis | null = null;
let ticker: ((time: number) => void) | null = null;
let onScroll: (() => void) | null = null;

export function ensureSmoothScroll(): Lenis | null {
  if (typeof window === "undefined") return null;

  if (lenis) return lenis;

  lenis = new Lenis({
    autoRaf: false,
    orientation: "vertical",
    gestureOrientation: "vertical",
    anchors: true,
  });

  const scroller = document.documentElement;

  ScrollTrigger.scrollerProxy(scroller, {
    scrollTop(value) {
      if (typeof value === "number") {
        lenis?.scrollTo(value, { immediate: true });
      }
      return lenis?.scroll ?? 0;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

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
  if (!lenis) return;

  if (ticker) gsap.ticker.remove(ticker);
  gsap.ticker.lagSmoothing(500);
  if (onScroll) lenis.off("scroll", onScroll);
  lenis.destroy();
  lenis = null;
  ticker = null;
  onScroll = null;
}
