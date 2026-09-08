export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function mapRange(
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  value: number,
): number {
  const t = (value - inMin) / (inMax - inMin || 1);
  return outMin + clamp(t, 0, 1) * (outMax - outMin);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Fade in / hold / fade out for a timeline beat. First and last beats hold at the edges. */
export function beatOpacity(
  progress: number,
  start: number,
  end: number,
): number {
  const span = end - start;
  if (span <= 0) return 0;

  const fade = Math.min(0.035, span * 0.22);
  const holdStart = start === 0;
  const holdEnd = end === 1;

  if (progress < start - fade || progress > end + fade) return 0;

  if (holdStart && progress <= start + fade) return 1;
  if (holdEnd && progress >= end - fade) return 1;

  if (progress < start + fade) {
    return smoothstep(start - fade * 0.35, start + fade, progress);
  }
  if (progress > end - fade) {
    return 1 - smoothstep(end - fade, end + fade * 0.35, progress);
  }
  return 1;
}
