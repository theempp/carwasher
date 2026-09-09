# Next Session — pick up here (written 2026-09-08, after the 1080 path shipped)

Steps 1–5 of v3.1 are done and wired. The site serves a grade-baked 720p re-cut to phones
and the signed grade-baked 1080 upres (CRF 21, 45.9 MB) to landscape desktop. Grain is a
static 2.5% tile. **Nothing Higgsfield has been spent since the signed 1080 job (0.51 cr).**

## Read in this order
1. `claude.md` — the v3.1 banner at the top, then §5, §6, §7, §10 (rules 11–14) and §11.
2. `docs/QUALITY_AND_PERF.md` — **the main document.** Owns the measurements, the variant split,
   the performance budget, and the eight located glitch risks (P1–P8).
3. `docs/BOOKING_COMPOSER.md` — the only new section, plus the four component upgrades.
4. `docs/FILM_PIPELINE.md` (night banner) and `docs/SCROLL_MECHANICS.md` §6b for the motion traps.

## The two decisions already made — do not re-litigate
- **Straight to the upres** for desktop. Mobile stays 720p, always. Never hand an upres to a phone.
- **Booking composer only.** The process ledger is cut. The page ends there.

## Already on disk (do not overwrite, do not re-encode unless asked)
```
public/video/lambo-wash-full-take1.mp4                         30s master — never serve
public/video/lambo-wash-full-take1-trim.mp4                    signed 25.33s 720p trim — never serve
public/video/lambo-wash-full-scrub-take1-trim.mp4              old third-gen 720 scrub — not served
public/video/lambo-wash-full-scrub-take1-trim-v2.mp4           720 all-intra, no grade — local archive, not in git
public/video/lambo-wash-full-scrub-take1-trim-v2-grade.mp4     SERVED on phone / portrait / small
public/video/lambo-wash-full-take1-trim-upres-1080.mp4         signed ByteDance 1080 raw (3 kf)
public/video/lambo-wash-full-scrub-take1-trim-upres-1080.mp4   1080 all-intra, no grade — local archive, not in git
public/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade.mp4  CRF 20 archive — local, not in git
public/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade-crf21.mp4  SERVED on landscape desktop
public/images/lambo-wash-full-start.jpg                       720 poster
public/images/lambo-wash-full-start-upres-1080.jpg            1080 poster
public/images/lambo-wash-full-trim-last.jpg                   comparison still (frame 607)
public/images/film-grain.png                                  static 512 tile
```

All served / archive scrubs are **608 frames / 608 keyframes / 25.333s**, last PTS 25.291667,
hard cut at master frame 608 is not in the file. Variant pick lives in `VideoScrubber` (once at
mount, `ssr: false`). Paths live in `FILM` in `lib/scene/sceneTimeline.ts`.

## Order of work (remaining)
1. **NOW — ByteDance 4K cost quote only.** `generate_video` model `bytedance_video_upscale`,
   `resolution: "4k"`, `fps: 24`, `preset: "common"`, `model_version: "standard"`,
   `get_cost: true`, `use_unlim: false`, `count: 1`. Do **not** upload. Do **not** fire the job.
   Dedicated `upscale_video` has no `get_cost` — quote through `generate_video` like the 1080
   (0.51 cr at 25.333s) and 2K (1.00 cr at 25s) preflights. Show the number. Wait for typed **GO**.
   Uploading sends the signed trim to Higgsfield — say so before doing it.
2. If GO: one 4K job on the signed 720 trim (`lambo-wash-full-take1-trim.mp4`), new filename,
   owner signs frames against the 1080. If the look changed, bin it. Then all-intra + bake +
   wire as `FILM.scrubDesktop` only. Mobile stays 720.
3. Fix P1–P8 (`QUALITY_AND_PERF.md` §5). P2 (CSS filter) and P8 (grain/scrim layering) are done.
   **P1 (one seek in flight) is the highest-value remaining fix.**
4. Booking composer + Navigation / ScrollProgress / TrustPanel / BeforeAfter upgrades, all
   honoring `prefers-reduced-motion`.
5. Full headless-Chrome regression on both the desktop and iPhone-class paths.

## Standing constraints
Branch `cursor/nextjs-agent-rules`, never `main`. Vertical only, position-mapped, damping k=0.09,
`cineEase` tuned in `easing.ts` only. Never hard-code scene % outside `sceneTimeline.ts`. Media stays
behind `<CinematicStage>`. Missing media → labeled placeholder, never a fake claim. ESTATE tokens
exactly; film in full native colour. No SaaS gradients, glassmorphism, card grids, bounce, parallax.
**No new dependencies.** No sections beyond Trust / Comparison / Booking. No TS or lint errors.

Serve nothing but the current variant pair (or a verified replacement): not clip 1, clip 2,
either remainder take, the raw trim, the 30s take, or the 30s scrub (it contains the hard cut at
25.33s). Do not use `lambo-wash-full-hold-take1.jpg` or `-last-take1.jpg` — discarded tail.

Do not drive the owner's Chrome. Launch headless on port 9333 with its own profile; rAF suspends in a
background tab and the run freezes silently. Use `http://localhost:3001`, not `127.0.0.1` — Next
blocks `_next` chunks from the latter.
