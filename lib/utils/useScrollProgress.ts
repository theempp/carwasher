"use client";

import { useState, type RefObject } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/animation/gsap";
import { ensureSmoothScroll } from "@/lib/animation/lenis";
import { cineEase } from "@/lib/animation/easing";
import { DAMPING, PIN_RUNWAY_VH } from "@/lib/scene/sceneTimeline";

type UseScrollProgressOptions = {
  videoRef?: RefObject<HTMLVideoElement | null>;
};

function seekVideo(video: HTMLVideoElement | null, progress: number) {
  if (!video || !Number.isFinite(video.duration) || video.duration === 0) {
    return;
  }

  const t = progress * Math.max(0, video.duration - 0.04);
  if (Math.abs(t - video.currentTime) > 0.003) {
    video.currentTime = t;
  }
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
        seekVideo(videoRef?.current ?? null, paced);

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
      };
    },
    { scope: triggerRef },
  );

  return progress;
}
