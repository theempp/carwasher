# Next Session — pick up here (written 2026-09-08, after 4K Blob shipping)

Steps 1–5 of v3.1 are done. 4K is signed, encoded, and served to landscape desktop from
Vercel Blob. Phones still get the grade-baked 720p. Grain is a static 2.5% tile.
**No further Higgsfield spend.** 1080 job 0.51 cr · 4K pro job 20.27 cr. Do not fire
1080, 2K, or 4K again.

## Read in this order
1. `claude.md` — the v3.1 banner at the top, then §5, §6, §7, §10 (rules 11–14) and §11.
2. `docs/QUALITY_AND_PERF.md` — **the main document.** Owns the measurements, the variant split,
   the performance budget, and the eight located glitch risks (P1–P8).
3. `docs/BOOKING_COMPOSER.md` — the only new section, plus the four component upgrades.
4. `docs/FILM_PIPELINE.md` (night banner) and `docs/SCROLL_MECHANICS.md` §6b for the motion traps.

## The two decisions already made — do not re-litigate
- **Straight to the upres** for desktop. Mobile stays 720p, always. Never hand an upres to a phone.
- **Booking composer only.** The process ledger is cut. The page ends there.

## Served pair (paths in `FILM` in `lib/scene/sceneTimeline.ts`)
```
phone / portrait / small
  public/video/lambo-wash-full-scrub-take1-trim-v2-grade.mp4
  608f, 24fps, 1280×720, all-intra, grade baked

landscape desktop
  FILM.scrubDesktop → Vercel Blob 4K
  https://e3wa7nrfmryldhad.public.blob.vercel-storage.com/film/lambo-wash-full-scrub-take1-trim-upres-4k-grade-crf21.mp4
  608f, 24fps, 3840×2160, all-intra, grade baked, CRF 21, 143 MB
  Blob store: carwasher-film on Vercel project theempps-projects/carwasher
```

Variant pick is once at mount inside `VideoScrubber` (`ssr: false`). CSS filter is gone.
P2 and P8 are done.

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
public/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade-crf21.mp4  1080 served-until-4K — keep, not wired
public/video/lambo-wash-full-take1-trim-upres-4k.mp4           signed ByteDance 4K pro raw (4 kf) — local, not in git
public/video/lambo-wash-full-scrub-take1-trim-upres-4k-grade-crf21.mp4  4K all-intra archive — local, not in git; Blob is the served copy
public/images/lambo-wash-full-start.jpg                       720 poster
public/images/lambo-wash-full-start-upres-1080.jpg            1080 poster (unused)
public/images/lambo-wash-full-start-upres-4k.jpg              4K desktop poster
public/images/lambo-wash-full-trim-last.jpg                   comparison still (frame 607)
public/images/film-grain.png                                  static 512 tile
```

All served / archive scrubs are **608 frames / 608 keyframes / 25.333s**, last PTS 25.291667,
hard cut at master frame 608 is not in the file.

## Order of work (remaining) — plan first, do not generate video
1. **P1 — one seek in flight** (`QUALITY_AND_PERF.md` §5). Highest-value remaining fix.
   `seekVideo` in `lib/utils/useScrollProgress.ts` assigns `currentTime` on every rAF
   where delta > 0.003. Skip while `video.seeking`, hold pending target, apply on `seeked`.
2. **P6 — loading readout.** Desktop now fetches 143 MB with `preload="auto"`. Give
   `LoadingScreen` a real progress readout. Measure before changing preload.
3. **P3** `ScrollTrigger.config({ ignoreMobileResize: true })` — pin jump on iOS URL bar.
4. **P4** dead `scrollerProxy` + probable double `ScrollTrigger.update` in `lib/animation/lenis.ts`.
5. **P5** two owners for one lenis instance (`SmoothScroll` vs `useScrollProgress`).
6. **P7** iOS memory ceiling — mitigation is the variant split; never hand 4K to a phone.
7. Booking composer + Navigation / ScrollProgress / TrustPanel / BeforeAfter upgrades,
   all honoring `prefers-reduced-motion`. Spec: `docs/BOOKING_COMPOSER.md`.
8. Full headless-Chrome regression on desktop (Blob 4K) and iPhone-class (720) paths.

P2 (CSS filter) and P8 (grain/scrim) are done. Do not regenerate footage. Do not re-encode
unless asked. Do not deploy unless asked. A Vercel project exists (`carwasher`) and is linked;
the site itself has not been deployed this session.

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
