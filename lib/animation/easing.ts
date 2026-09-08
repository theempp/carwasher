export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** slower hold at the open, faster through the middle, settle at the end */
export function smootherstep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/**
 * Drive the playhead. Mostly smootherstep, with a little linear mixed in so
 * the first scroll actually moves the clip instead of sitting on arrival.
 */
export function cineEase(t: number): number {
  const x = clamp(t, 0, 1);
  return x * 0.22 + smootherstep(x) * 0.78;
}
