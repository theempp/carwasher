# Film Quality & Performance Budget (v3.1 — owns image quality and runtime cost)

> Written 2026-09-08 (night) after the owner asked why the scrubbed film looks soft and set
> "mobile and desktop as smooth and fast as possible, no glitches" as a hard constraint.
> `docs/FILM_PIPELINE.md` owns the footage · `docs/DESIGN_DIRECTION.md` owns the look ·
> `docs/SCROLL_MECHANICS.md` owns the motion · **this file owns pixels-per-byte and frame cost.**
>
> Nothing in this file has been executed yet. It is the plan the next session picks up.

---

## 1. Measured diagnosis — the encode is NOT the problem

Run 2026-09-08 with ffmpeg against the files on disk:

| Step | Result |
|---|---|
| 30s master → 25.33s raw trim (`lambo-wash-full-take1-trim.mp4`) | PSNR **43.65 dB** — a lossy re-encode |
| raw trim → all-intra scrub (`lambo-wash-full-scrub-take1-trim.mp4`) | PSNR **43.08 dB**, SSIM **0.9937** |
| Keyframes in the served scrub | **608 / 608** — correct, do not touch |
| Master resolution | **1280×720**, h264 High, yuv420p, 24fps |

SSIM 0.9937 means the all-intra step is very nearly transparent to its own source. The scrub encode
is doing its job. **The softness is resolution, not compression.**

### The actual arithmetic

Landscape uses `object-fit: cover` on a 16:9 film, so the film is **height-constrained** and scales
to fill the viewport height:

| Viewport | Device lines | Upscale from 720 |
|---|---|---|
| 1440×900 @ DPR 2 | 1800 | **2.50×** linear, 6.3× area |
| 1728×1117 @ DPR 2 (16" MBP) | 2234 | **3.10×** linear |
| 1920×1080 @ DPR 1 | 1080 | 1.50× linear |

That resample is done by the browser's cheapest bilinear filter, every frame, while seeking. No
re-encode recovers it.

### Portrait is a completely different story — and this is what protects mobile

`.film-fit` letterboxes under `max-aspect-ratio: 1/1` (`object-fit: contain`), so on a phone the film
is **width-constrained**:

| Device | CSS width | DPR | Device px wide | vs 1280 source |
|---|---|---|---|---|
| iPhone 15/16 Pro | 393 | 3 | 1179 | **0.92× — source already exceeds need** |
| iPhone SE | 375 | 2 | 750 | 0.59× |
| Pixel 8 | 412 | 2.625 | 1081 | 0.84× |

**A phone cannot resolve more than the 720p master already carries.** Shipping an upres to mobile
would be pure cost — more bytes, more decode, more memory — for zero visible pixels. This is the
whole reason the variant split below is not optional.

---

## 2. Decisions (owner, 2026-09-08 night)

1. **Go straight to the upres** for the desktop path.
2. **Booking composer only** for new page content — no process ledger. Reason given: keep the page
   short so mobile does not crash.
3. **Mobile and desktop both smooth, fast, no glitches** is a shipping gate, not a nice-to-have.

---

## 3. The quality plan, in order

### Step 1 — Re-cut the all-intra scrub from the 30s master (free, do first)

The served file is currently a **third-generation** encode: master → lossy trim → all-intra. Encoding
all-intra directly from the master drops one whole generation for free.

```bash
ffmpeg -i public/video/lambo-wash-full-take1.mp4 \
       -t 25.333333 \
       -c:v libx264 -g 1 -preset veryfast -crf 20 \
       -pix_fmt yuv420p -an \
       public/video/lambo-wash-full-scrub-take1-trim-v2.mp4
```

**Rules:** new filename, never overwrite. The existing scrub stays on disk until the replacement is
verified. Must land on **608 frames / 25.333s / 608 keyframes** and must stop before the hard cut at
25.33s — verify all four before wiring. Expected gain ~1–2 dB: real, but on its own it will not
rescue the softness.

### Step 2 — Preflight the Higgsfield upres (needs owner GO before any spend)

Per `docs/FILM_PIPELINE.md` §4: *"720p first; 1080p only if a take is signed and we upres."* The take
is signed, so this is the sanctioned path.

- Tool: Higgsfield MCP → `upscale_video`, on the **signed trim**.
- **Always** `get_cost: true` first, show the owner the number, wait for a typed **GO**.
- `use_unlim: false`. One job. Decline any preset nudge.
- Uploading sends the footage to Higgsfield — say so before uploading, not after.

### Step 3 — Owner signs the upres frame-by-frame

ML upscalers synthesize detail; they can rewrite foam edges, the lens flare, and the brick weave.
Pull matched frames from the upres and the 720p (arrival, mid-foam, rinse, door, interior, close) and
put them side by side. **If it changed the look, bin it and keep 720p.** `sceneTimeline.ts` station
ranges are normalized to duration, so a resolution swap is a one-line `FILM.scrub` change either way.

### Step 4 — Two variants, picked at mount

| Path | Source | Res | Why |
|---|---|---|---|
| Portrait / small / low-DPR | re-cut from master | 1280×720 | §1 shows a phone cannot resolve more |
| Landscape desktop | upres (if signed) | 1920×1080 | 1.67× short of a retina 1440 window, but the byte cost of 1440p is not worth it — grain covers the rest |

Choose once, at mount, from `matchMedia` orientation × viewport × `devicePixelRatio`. **Never swap
mid-session** — changing `src` resets `currentTime` and drops the playhead. Selection logic lives
inside `VideoScrubber`; the variant paths live in `FILM` in `sceneTimeline.ts`. Nothing outside
`CinematicStage` learns that variants exist.

### Step 5 — Bake the grade, add grain

- **Bake** `contrast(1.04) saturate(1.05)` into the encode and delete it from `.film-scrub`. A CSS
  filter over a fullscreen video is a per-frame GPU pass for a result that is identical when baked.
  `DESIGN_DIRECTION.md` §2 already calls the grade "a taste call at build time" — baking is in spec.
- **Grain** at ~2.5% opacity to mask upscale softness and h264 banding in the flat sky and the white
  villa. Must be a **static tiled texture, composited once** — never animated, never a canvas loop.
  Film grain is ESTATE-compatible; animated noise is decorative motion with no purpose (forbidden).

---

## 4. Performance budget (the shipping gate)

| Metric | Mobile | Desktop |
|---|---|---|
| Hero video bytes | ≤ ~16 MB | ≤ ~55 MB |
| Scrub frame time | ≤ 16.7 ms sustained | ≤ 16.7 ms sustained |
| Dropped frames while scrubbing | none visible on a 4× throttled CPU | none |
| Seek backlog | zero — never more than one seek in flight | zero |
| Layout shift after load | 0 | 0 |
| New dependencies | 0 | 0 |

Current 720p all-intra is 24.5 MB at CRF 20 (7.7 Mbps). Portrait letterboxes to a band roughly
1179×663, so CRF 22 on the mobile variant is defensible to reach the budget — **measure before
committing to a number**; do not blindly raise CRF.

---

## 5. Known glitch risks in the code as it stands today

Each of these is a real, located defect or hazard, not a speculative cleanup. Fix them as part of
this work, not later.

**P1 — Unthrottled seeks flood the decoder.** `seekVideo` in `lib/utils/useScrollProgress.ts` assigns
`video.currentTime` on **every rAF** where the delta exceeds 0.003. On iOS the seek queue backs up and
the film stutters or freezes mid-scroll. Fix: keep at most one seek in flight — skip while
`video.seeking` is true, hold the pending target, apply it on `seeked`. **The single highest-value
mobile fix in this list.**

**P2 — Per-frame CSS filter on a fullscreen video.** `.film-scrub { filter: contrast(1.04)
saturate(1.05) }` in `globals.css`. Removed by Step 5 above.

**P3 — Mobile URL-bar resize thrashes the pin.** The stage is `h-dvh`; on iOS Safari and Chrome
Android the bar showing/hiding changes `dvh` mid-scroll, and with `invalidateOnRefresh: true` the pin
recalculates under the user's thumb — the classic pin jump. Fix:
`ScrollTrigger.config({ ignoreMobileResize: true })`.

**P4 — Dead `scrollerProxy` and a probable double update.** `lib/animation/lenis.ts` registers a
`scrollerProxy` on `document.documentElement`, but the `ScrollTrigger.create` in `useScrollProgress`
sets no `scroller`, so it uses the default (window) and never consults the proxy. Meanwhile
`lenis.on("scroll", () => ScrollTrigger.update())` runs update on top of ScrollTrigger's own
listener. Verify, then remove the dead path so update runs once per frame.

**P5 — Two owners for one lenis instance.** `SmoothScroll` (mounted in `layout.tsx`) calls
`ensureSmoothScroll()` and its cleanup calls `releaseSmoothScroll()`; `useScrollProgress` also calls
`ensureSmoothScroll()`. The singleton makes the happy path safe, but under React StrictMode's dev
double-invoke the cleanup can destroy lenis while the hook still depends on it. Own the lifecycle in
exactly one place.

**P6 — `preload="auto"` on a large file.** Fine at 24 MB, questionable at 55 MB. Measure. If the wait
is long, a bare "Loading" label over a multi-second fetch is a poor first impression — give
`LoadingScreen` a real progress readout rather than silently stalling.

**P7 — iOS memory ceiling.** A large all-intra decode surface plus a full buffer is what actually
gets a mobile tab reaped. The §4 variant split is the mitigation; this is why mobile must never be
handed the upres.

**P8 — Compositing.** Keep the video on its own layer and make sure the scrim and grain sit above it
without forcing repaints. Verify in DevTools layers, don't assume.

---

## 6. Verification — extends the existing pass list

Existing criteria stay binding: only the served scrub requested, no console errors, forward and
reverse both track `cineEase(p) * (duration - 0.04)` within 0.05s, an instant 0→1 jump trails
~9.8 → 19.7 → 23.4 → 25.3 over ~1s, a mid-scroll stop holds `currentTime` to 4 decimals, no
horizontal overflow, the trust headline wraps, and both fallback ladders still degrade
(mp4 blocked → stills; stills blocked → labeled placeholder — the `error`-before-hydration
`useEffect` in `VideoScrubber` stays).

Added for v3.1:

- Run the whole suite a second time under **iPhone-class emulation** (393×852, DPR 3, 4× CPU
  throttle) and confirm the **720p** variant is the one requested — not the upres.
- Frame-time trace while scrubbing: no frame over 16.7 ms sustained on either path.
- Assert zero seek backlog — instrument `seeking`/`seeked` and confirm at most one in flight.
- Confirm the re-cut lands on 608 frames / 608 keyframes / 25.333s before it is wired.
- Headless Chrome only, on port 9333 with its own profile. Never drive the owner's Chrome — rAF
  suspends in a background tab and the run silently freezes.
