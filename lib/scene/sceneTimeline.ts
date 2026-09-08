export const DAMPING = 0.09;

/** Vertical pin runway in viewport-heights. 5.04s clip; tune here only. */
export const PIN_RUNWAY_VH = 5;

export const FILM = {
  /** All-intra encode — the only file the <video> may request. */
  scrub: "/video/lambo-wash-01-scrub.mp4",
  first: "/images/lambo-wash-01-first.jpg",
  last: "/images/lambo-wash-01-last.jpg",
} as const;

export type Station = {
  id: number;
  start: number;
  end: number;
  /** Station 0: already at full opacity on load. */
  holdOpen: boolean;
  /** Last pinned station: hold through release into the trust panel. */
  holdClose: boolean;
  eyebrow: string;
  headline: readonly [string, string];
  sub: string;
};

/**
 * Pinned-phase stations. Station 1's range extends through 1.0 so its label
 * holds into the trust panel (SCROLL_MECHANICS §3 trap 2 / §6 station 2).
 */
export const stations = [
  {
    id: 0,
    start: 0,
    end: 0.3,
    holdOpen: true,
    holdClose: false,
    eyebrow: "Arrival",
    headline: ["It shows up", "exactly as it is"],
    sub: "No staging. This is the car as it arrived.",
  },
  {
    id: 1,
    start: 0.3,
    end: 1,
    holdOpen: false,
    holdClose: true,
    eyebrow: "The wash",
    headline: ["Watch it", "disappear"],
    sub: "Foam builds, panel by panel.",
  },
] as const satisfies readonly Station[];

export type SceneStation = (typeof stations)[number];

const STATION_CROSSFADE = 0.2;

export function stationOpacity(progress: number, station: Station): number {
  const span = station.end - station.start;
  if (span <= 0) return 0;

  const local = (progress - station.start) / span;
  const inFade = station.holdOpen ? 1 : clamp01(local / STATION_CROSSFADE);
  const outFade = station.holdClose
    ? 1
    : clamp01((1 - local) / STATION_CROSSFADE);

  return Math.min(inFade, outFade);
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
