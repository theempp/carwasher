export const DAMPING = 0.09;

/**
 * Vertical pin runway in viewport-heights. Single tuning knob for pacing.
 * Clip 1 (5.04s) used 5. The 25.33s film at that density would crawl, so the
 * runway is far denser per second — the film should feel somewhat fast.
 * Tune here only; nothing else reads scroll distance.
 */
export const PIN_RUNWAY_VH = 13;

export const FILM = {
  /**
   * 720p all-intra, grade baked, moov at the start. Portrait / phone /
   * small / tablet. A phone cannot resolve more than this.
   */
  scrub: "/video/lambo-wash-full-scrub-take1-trim-v2-grade-faststart.mp4",
  /**
   * 1080 all-intra, grade baked, CRF 21, moov at the start. Landscape
   * desktop. This is the highest quality that still scrubs: 4K all-intra
   * (3840×2160 I-frames) melts the decoder on the interior beat. 4K stays
   * on disk for the loupe stills only — never the playhead.
   */
  scrubDesktop:
    "/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade-crf21-faststart.mp4",
  /** Alias of `scrubDesktop` — kept so a future 1080 miss can still step down. */
  scrub1080:
    "/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade-crf21-faststart.mp4",
  /** Poster + arrival still: the frame the film opens on. */
  first: "/images/lambo-wash-full-start.jpg",
  /** Matching 1080 arrival still for the desktop poster. */
  firstDesktop: "/images/lambo-wash-full-start-upres-1080.jpg",
  first1080: "/images/lambo-wash-full-start-upres-1080.jpg",
  /** Last frame of the trim: wet gloss black, near door flush. Not a reveal. */
  last: "/images/lambo-wash-full-trim-last.jpg",
  /**
   * 4K sources for the comparison loupe only. Pulled from the signed 4K
   * archive (frame 0 and frame 607) so a 1:1 inspection shows real detail
   * rather than magnifying the browser's own upscale of a 720/1024 still.
   * Never served as film.
   */
  firstLoupe: "/images/lambo-wash-full-start-upres-4k.jpg",
  lastLoupe: "/images/lambo-wash-full-trim-last-upres-4k.jpg",
  /** Seconds. Kept for reference only — playback reads video.duration. */
  duration: 25.333,
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
 * Pinned-phase stations, one per beat that is actually readable in the
 * 25.33s trim (clip-time / 25.333):
 *   0.00–7.00   foam       → .000–.276
 *   7.00–13.00  rinse      → .276–.513
 *   13.00–15.00 near door  → .513–.592
 *   15.00–23.00 interior   → .592–.908
 *   23.00–25.33 exit/slam  → .908–1.000
 * Foam is split into arrival + wash so station 0 can open at full opacity and
 * clear the frame before the car is buried; the door label runs a little past
 * the door beat so it is readable rather than a blink.
 * Copy is placeholder — the owner has not signed the words.
 */
export const stations = [
  {
    id: 0,
    start: 0,
    end: 0.075,
    holdOpen: true,
    holdClose: false,
    eyebrow: "Arrival",
    headline: ["It shows up", "exactly as it is"],
    sub: "No staging. This is the car as it arrived.",
  },
  {
    id: 1,
    start: 0.075,
    end: 0.276,
    holdOpen: false,
    holdClose: false,
    eyebrow: "The wash",
    headline: ["Foam, panel", "by panel"],
    sub: "Hand-sprayed across every side of the car.",
  },
  {
    id: 2,
    start: 0.276,
    end: 0.513,
    holdOpen: false,
    holdClose: false,
    eyebrow: "The rinse",
    headline: ["Stripped back", "to wet black"],
    sub: "Every panel carried down to the paint again.",
  },
  {
    id: 3,
    start: 0.513,
    end: 0.66,
    holdOpen: false,
    holdClose: false,
    eyebrow: "The door",
    headline: ["One way in,", "the near door"],
    sub: "The far side stays shut.",
  },
  {
    id: 4,
    start: 0.66,
    end: 0.908,
    holdOpen: false,
    holdClose: false,
    eyebrow: "Inside",
    headline: ["Mat, seats,", "wheel, console"],
    sub: "One part at a time. Nothing else enters the frame.",
  },
  {
    id: 5,
    start: 0.908,
    end: 1,
    holdOpen: false,
    holdClose: true,
    eyebrow: "The close",
    headline: ["We back out", "and close up"],
    sub: "Same driveway, same light, door flush.",
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
