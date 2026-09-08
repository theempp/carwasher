"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SCROLL_DISTANCE = "+=700%";

export function useScrollProgress(
  triggerRef: RefObject<HTMLElement | null>,
): number {
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger,
        start: "top top",
        end: SCROLL_DISTANCE,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
    }, trigger);

    return () => ctx.revert();
  }, [triggerRef]);

  return progress;
}
