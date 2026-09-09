"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * One place to honor prefers-reduced-motion for every Motion section.
 * `reducedMotion="user"` neutralizes transform and layout animation when the OS
 * asks for it, leaving opacity — so the sections still resolve to their final
 * state rather than never appearing.
 *
 * This covers Motion-driven animation only. The scroll hook handles its own
 * damping (k = 1, snap), and any raw CSS transition still needs its own media
 * query.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
