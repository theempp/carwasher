# Next Session — pick up here (written 2026-09-08 night)

The repo is current at this commit. Nothing in the v3.1 plan has been executed: **no re-cut, no
upres, no code changes.** This session was planning and documentation only.

## Read in this order
1. `claude.md` — the v3.1 banner at the top, then §5, §6, §7, §10 (rules 11–14) and §11.
2. `docs/QUALITY_AND_PERF.md` — **the main document.** Owns the measurements, the variant split,
   the performance budget, and the eight located glitch risks (P1–P8).
3. `docs/BOOKING_COMPOSER.md` — the only new section, plus the four component upgrades.
4. `docs/FILM_PIPELINE.md` (night banner) and `docs/SCROLL_MECHANICS.md` §6b for the motion traps.

## The two decisions already made — do not re-litigate
- **Straight to the upres** for desktop. Mobile stays 720p, always.
- **Booking composer only.** The process ledger is cut. The page ends there.

## Order of work
1. Re-cut the all-intra scrub from the 30s master (`QUALITY_AND_PERF.md` §3 step 1). Verify
   608 frames / 608 keyframes / 25.333s. New filename. Do not wire it until verified.
2. Preflight the Higgsfield upres with `get_cost: true`. Show the owner the number. Say the upload
   sends footage to Higgsfield. **Wait for a typed GO.**
3. Owner signs the upres frame-by-frame against the 720p. If the look changed, bin it.
4. Variant selection in `VideoScrubber`, chosen once at mount.
5. Bake the grade, delete the CSS filter, add static grain.
6. Fix P1–P8.
7. Booking composer + the Navigation / ScrollProgress / TrustPanel / BeforeAfter upgrades, all
   honoring `prefers-reduced-motion`.
8. Full headless-Chrome regression on both the desktop and iPhone-class paths.

## Standing constraints
Branch `cursor/nextjs-agent-rules`, never `main`. Vertical only, position-mapped, damping k=0.09,
`cineEase` tuned in `easing.ts` only. Never hard-code scene % outside `sceneTimeline.ts`. Media stays
behind `<CinematicStage>`. Missing media → labeled placeholder, never a fake claim. ESTATE tokens
exactly; film in full native colour. No SaaS gradients, glassmorphism, card grids, bounce, parallax.
**No new dependencies.** No sections beyond Trust / Comparison / Booking. No TS or lint errors.

Serve nothing but the current scrub (or its verified re-cut / signed upres): not clip 1, clip 2,
either remainder take, the raw trim, the 30s take, or the 30s scrub (it contains the hard cut at
25.33s). Do not use `lambo-wash-full-hold-take1.jpg` or `-last-take1.jpg` — discarded tail.

Do not drive the owner's Chrome. Launch headless on port 9333 with its own profile; rAF suspends in a
background tab and the run freezes silently.
