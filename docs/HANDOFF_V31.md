# v3.1 handoff — archive

> Superseded 2026-09-08 night. Tasks A/B and C1/C4 are done. Current served pair, remaining
> work, and pickup prompt live in `docs/NEXT_SESSION.md`. Do not re-implement anything below.
> Left as a record of the P6 / C-item reasoning.

## Read first
`claude.md` · `docs/QUALITY_AND_PERF.md` (§4 budget, §5 P1–P8, §6 verification) · `docs/NEXT_SESSION.md`.

## Binding constraints — do not violate
- Branch `cursor/nextjs-agent-rules`, never `main`. **No new dependencies.** No TS or lint errors.
- **Never overwrite a media file.** Every encode lands on a new filename.
- **Never hand an upres to a phone.** Serve only the current variant pair:
  - phone/portrait/small → `public/video/lambo-wash-full-scrub-take1-trim-v2-grade.mp4` (1280×720)
  - landscape desktop → `FILM.scrubDesktop`, the Vercel Blob 4K (143 MB)
  Not clip 1, not clip 2, not either remainder take, not the raw trim, not the 30s take or its 30s
  scrub. Never `lambo-wash-full-hold-take1.jpg` or `-last-take1.jpg`.
- Vertical only. Damping `k = 0.09`. `cineEase` tuned in `easing.ts` only. Never hard-code scene %
  outside `sceneTimeline.ts`. Media stays behind `<CinematicStage>`.
- **Do not regenerate video. Do not touch Higgsfield.** (1080 job 0.51 cr and 4K pro 20.27 cr are
  already spent and signed; firing another costs real money.)
- Do not deploy. The Vercel project `carwasher` is linked but the site has never been deployed.
- Do not drive the owner's Chrome — rAF suspends in a background tab and the run freezes silently.
  Launch your own headless Chrome on **port 9333** with its own profile, against
  **`http://localhost:3001`** (not `127.0.0.1` — Next blocks `_next` chunks from it).

---

## Task A — P6: the loading readout (measure first, then build)

### The defect
`CinematicStage` flips `ready` on `loadedData` / `readyState >= 2`. That is `HAVE_CURRENT_DATA` —
**the first frame only, not the file.** So on desktop the "Loading" label disappears as soon as frame
0 decodes, and the user then scrubs into an unbuffered region of a 143 MB file and the playhead
stalls silently. The missing percentage is the symptom; the wrong readiness gate is the defect.

### A1. Measure before changing anything (no edits)
Headless Chrome via CDP, desktop profile (1728×1117 @ DPR 2):
1. Time from navigation to `loadeddata`, `canplay`, `canplaythrough`, and
   `buffered.end(0) === duration` for the Blob 4K. Run **cold and warm CDN cache**, unthrottled and
   at a throttled profile (`Network.emulateNetworkConditions`, ~10 Mbps).
2. Response headers on the Blob URL — does it send `Accept-Ranges: bytes`? Does Chrome issue one
   143 MB request under `preload="auto"` or ranged chunks? This decides whether progress is
   measurable at all.
3. Reproduce the failure: scrub to ~90% immediately after `loadeddata`, confirm the stall.

Report the numbers before writing code.

### A2. Preload decision
Default: **keep `preload="auto"`** and make the wait honest. `preload="metadata"` makes first paint
cheaper but makes the first scrub worse, which is the thing being fixed. iOS effectively ignores
`preload="auto"` until a user gesture, so this is a desktop-only question. Only revisit if A1 shows
the fetch blocking first paint.

### A3. Build
- `LoadingScreen` takes an optional `progress?: number | null` (0–1) and renders the numeral in the
  existing tracked-label style (`LOADING 42`), falling back to bare `Loading` when unknown. If a bar
  is wanted it must be a **hairline** matching `ScrollProgress` — a filled bar is off-spec (ESTATE).
- **Source of truth is `video.buffered`** — `bufferedEnd / duration`. Do **not** side-fetch the file
  with `fetch`/XHR for a byte-accurate number; that double-downloads 143 MB.
- Sample at **≤4 Hz**, not every rAF. Use the range containing 0. Clamp monotonically increasing so a
  multi-range buffer cannot make the numeral run backwards.
- Split the two states: *first frame up* (hide the poster — existing `ready`) vs *safe to scrub*
  (hide the readout — `canplaythrough`, or fully buffered on the desktop path). `CinematicStage`
  owns both, fed by callbacks from `VideoScrubber`, so media logic stays behind the stage.
- **Do not gate scroll on buffering** without asking — that is a scroll-feel change.

---

## Task B — Step 8: full headless regression, both paths

Own Chrome on port 9333, own profile, `http://localhost:3001`. Two profiles:
- **Desktop:** 1728×1117 @ DPR 2 (the 3.10× upscale case).
- **iPhone-class:** 393×852 @ DPR 3, **4× CPU throttle**, touch emulation.

Run each **twice — cold and warm CDN cache** — and report both; the Task A timings are meaningless
without saying which you got.

Existing criteria (all still binding):
- only the served variant is requested; no console errors;
- forward *and* reverse both track `cineEase(p) × (duration − 0.04)` within 0.05 s;
- an instant 0→1 jump trails ~9.8 → 19.7 → 23.4 → 25.3 over ~1 s;
- a mid-scroll stop holds `currentTime` to 4 decimals;
- no horizontal overflow; the trust headline wraps;
- both fallback ladders degrade (mp4 blocked → stills; stills blocked → labeled placeholder). The
  `error`-before-hydration `useEffect` in `VideoScrubber` must stay.

v3.1 additions:
- the **iPhone-class run requests `lambo-wash-full-scrub-take1-trim-v2-grade.mp4`**, never the Blob
  URL. This is the P7 mitigation and it is a shipping gate.
- frame-time trace while scrubbing: **no frame over 16.7 ms sustained** on either path.
- **zero seek backlog.** `window.__scrubStats` is populated in dev by the seek controller in
  `lib/utils/useScrollProgress.ts`: assert `maxInFlight === 1` and report `timeouts` (should be 0 —
  a non-zero count means the watchdog is firing and `seeked` is being dropped).
- one lenis instance and one `gsap.ticker` entry after a full dev remount cycle (StrictMode).
- new since the last pass, verify these too: the fixed header inverts correctly across
  film → panel → paper; the rail stays legible over both grounds; the press-and-hold loupe on
  `BeforeAfter` shows real 4K detail and releases on pointerup/blur; the booking composer's `<output>`
  recomposes on every change and the plain `<a>` is present in the DOM before hydration.

---

## Task C — flagged, each needs its own explicit GO from the owner

Do **not** implement these without being told to.

| # | What | Why it is gated |
|---|---|---|
| C1 | Raise `SEEK_EPSILON` in `useScrollProgress.ts` from 0.003 to ~0.02 (half a 24fps frame) | Quantizes the playhead — a scroll-feel change. Would cut seek count sharply with no visible difference in principle, but must be seen before it lands. |
| C2 | Gate scroll until the film is buffered | Scroll-feel change. |
| C3 | Remove `lenis.on("scroll", ScrollTrigger.update)` in `lib/animation/lenis.ts` | It is the canonical integration; removing it trades a redundant second update pass for a one-frame read lag. **Measure the cost of the second pass first** — with one trigger it is likely under 0.05 ms and not worth chasing. |
| C4 | Exclude iPads/tablets from the 4K variant in `pickFilmVariant()` (`VideoScrubber.tsx`) | **Real gap.** The predicate is a screen test, not a device-class test: iPad Pro 12.9 landscape (1366×1024, DPR 2) passes every clause and gets the 143 MB 4K. A 3840×2160 yuv420p decode surface is ~12.4 MB/frame plus a 143 MB buffer — fine on desktop, tab-reaping on iPadOS. Fix is either a `(pointer: coarse)` exclusion or a UA test covering iPadOS-reports-as-MacIntel (`maxTouchPoints > 1`). Changes device→media mapping, so it is gated. |

---

## Already done this session — do not redo

- **P1** — `createSeekController()` in `lib/utils/useScrollProgress.ts`. At most one seek in flight;
  the delta is measured against the last *requested* time, never `video.currentTime` (which returns
  the pre-seek position while a seek is pending, so the old guard could not tell a near-identical
  seek was already queued). Intermediates are coalesced, not queued. 500 ms watchdog because iOS
  drops `seeked` under decoder pressure and one lost event would wedge the playhead. Rebinds when
  the `ssr:false` video element arrives. Dev-only stats on `window.__scrubStats`.
- **P3** — `ScrollTrigger.config({ ignoreMobileResize: true })` in `lib/animation/gsap.ts`.
- **P4a** — dead `scrollerProxy` deleted from `lib/animation/lenis.ts` (verified: exactly one
  `ScrollTrigger.create` in the app and it sets no `scroller`). P4b left alone — see C3.
- **P5** — `owners` refcount in `lenis.ts`; `useScrollProgress` now releases symmetrically.
- **7a** — `BookingComposer.tsx` replaces `CtaSection.tsx` (deleted). Native radios behind styled
  labels, live `<output>`, single `BOOKING_HREF` placeholder constant, plain `<a>` in the DOM from
  first render, safe-area padding, ≥44px targets. Copy is placeholder and reads as placeholder.
- **7b** — `Navigation` is a fixed hairline header, wordmark moved up into it (owner's call), tone
  inverts off `data-tone` on each section.
- **7c** — `ScrollProgress` is fixed and reads whole-document position. **Note:** during the pin the
  numeral now tracks scroll position rather than the eased playhead, so it advances linearly where
  it used to follow `cineEase`. One meaning for the whole page. Owner should eyeball this.
- **7d** — `TrustPanel` per-line clip-reveal, headline as a line array, rule draws on `scaleX`.
- **7e** — press-and-hold 1:1 loupe on `BeforeAfter`, reading **4K** sources so it shows real detail
  instead of magnifying the browser's upscale of a 1024/1280 still. New still extracted from the
  signed 4K archive, nothing overwritten:
  `public/images/lambo-wash-full-trim-last-upres-4k.jpg` (3840×2160, 388 KB, frame 607).
  Exposed as `FILM.firstLoupe` / `FILM.lastLoupe` in `sceneTimeline.ts` — loupe only, never served
  as film.
- **7f** — `MotionProvider` (`MotionConfig reducedMotion="user"`) wraps children in `layout.tsx`,
  covering every Motion section at once. Covers Motion-driven animation only: the scroll hook keeps
  its own handling (`k = 1`, snap) and raw CSS transitions still need their own media query.
