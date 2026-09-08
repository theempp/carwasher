"use client";

import { useGSAP } from "@/lib/animation/gsap";
import {
  ensureSmoothScroll,
  releaseSmoothScroll,
} from "@/lib/animation/lenis";

export function SmoothScroll() {
  useGSAP(() => {
    ensureSmoothScroll();
    return () => {
      releaseSmoothScroll();
    };
  });

  return null;
}
