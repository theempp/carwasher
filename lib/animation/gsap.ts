"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The stage is h-dvh and the pin runway is a function of window.innerHeight.
 * On iOS Safari and Chrome Android the URL bar showing/hiding changes both
 * mid-gesture, and with invalidateOnRefresh the pin then recalculates under the
 * user's thumb — the classic pin jump. This suppresses only those small
 * height-delta resizes; a real orientation change still refreshes.
 *
 * Note it does not re-pick the video variant on rotate, by design: the served
 * file is chosen once at mount (VideoScrubber), because changing src resets
 * currentTime and drops the playhead.
 */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };
