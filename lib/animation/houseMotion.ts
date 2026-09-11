/**
 * Below-pin HOUSE motion only.
 * Do not import this from the film path. Do not use cineEase here.
 * Tune these strings in this file only.
 */
export const HOUSE_CLIP = {
  from: "inset(0% 0% 100% 0%)",
  to: "inset(0% 0% 0% 0%)",
} as const;

export const HOUSE_HANDOFF = {
  start: "top bottom",
  end: "top 38%",
} as const;

export const HOUSE_STATION = {
  start: "top 62%",
  end: "bottom 38%",
} as const;
