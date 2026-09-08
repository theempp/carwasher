# One-shot Cursor rebuild prompt (v3 — ESTATE / driveway wash)

> Paste the block below into Cursor as a single prompt. It is written to be self-contained.
> Do not paste the surrounding notes.

---

## Notes before you paste (for the owner, not for Cursor)

- This is the **third** locked direction. v1 was a Nano-Banana still-frame sequence; v2 was a
  horizontal continuous wash-bay glide (never fully built out); v3 (this one) is built around a real
  clip you supplied, `LamboWash1.mp4`, now in the repo as `public/video/lambo-wash-01.mp4` plus an
  already-produced scrub-ready re-encode `public/video/lambo-wash-01-scrub.mp4`. Nothing needs to be
  generated for Cursor to start — the media already exists.
- Figma is still not in this pipeline (View-seat, read-only — see the v2 note in git history if you
  want the detail). Build straight to code from `docs/DESIGN_DIRECTION.md`.
- The clip only shows arrival → full foam coverage, not a rinsed-clean reveal. The prompt below
  builds an honest site around that — a second clip (rinse/reveal) is a documented follow-up in
  `docs/FILM_PIPELINE.md`, not something to fake now.

---

## THE PROMPT

```
Rebuild this Next.js site as a vertically scroll-scrubbed cinematic clip, in the ESTATE direction.
This replaces any previous MINERAL/horizontal-scroll work in this repo — do not preserve that look
or axis.

READ FIRST, in this order — they are the source of truth and they override your assumptions or
anything you infer from existing code in this repo:
1. docs/SCROLL_MECHANICS.md   — how the scroll must behave (vertical, damped, all mandatory)
2. docs/DESIGN_DIRECTION.md   — the ESTATE design tokens (locked, do not invent alternatives)
3. docs/FILM_PIPELINE.md      — the media that exists and what's still missing
4. claude.md                  — master brief; read fully, it points at the three docs above

WHAT ALREADY EXISTS — DO NOT REGENERATE OR REPLACE
- public/video/lambo-wash-01.mp4        raw clip, DO NOT serve this directly (bad seeking)
- public/video/lambo-wash-01-scrub.mp4  all-intra re-encoded, SERVE THIS ONE
- public/images/lambo-wash-01-first.jpg first frame still (arrival)
- public/images/lambo-wash-01-last.jpg  last frame still (full foam coverage)
These are real, final media files already in the repo at those exact paths. Use them as-is.

WHAT TO BUILD

A single page with two phases:

PHASE 1 — pinned hero (vertical scroll-scrub)
One pinned, full-bleed <video> element playing public/video/lambo-wash-01-scrub.mp4, scrubbed by
scroll position via video.currentTime — never autoplaying, never using CSS/JS playback controls.
Wordmark "[BRAND]" bottom-left directly on the film (placeholder — I will supply the real name),
minimal nav top-right, hairline progress rail. Two text stations per docs/SCROLL_MECHANICS.md §6
("Arrival" then "The wash"), composed into the shot, not laid out as a fixed banner.

PHASE 2 — released normal scroll, below the pin
1. Trust panel: dark background (--panel token), large Fraunces serif headline (placeholder copy,
   e.g. "THE STANDARD ON YOUR STREET."), one short line of sub-copy. No media dependency — build this
   with text and tokens only.
2. Before/After section: public/images/lambo-wash-01-first.jpg vs public/images/lambo-wash-01-last.jpg,
   labeled honestly "ARRIVAL" and "FULL COVERAGE" — NOT "before/after clean" and NOT any wording that
   implies a finished, rinsed reveal, because that frame does not exist yet. Use a simple side-by-side
   or wipe/slider comparison; either is fine, just keep the labels honest.
3. BOOK CTA: closing screen with a placeholder outbound link (comment clearly where I paste my real
   phone / Instagram DM / Calendly / Square link).

NON-NEGOTIABLES
- Scroll is VERTICAL. Standard scroll — do NOT remap wheel axes (that was a v2-only requirement for
  horizontal scroll and does not apply here).
- DAMPED scrub: lerp current toward target at k = 0.09 in a rAF loop, then drive video.currentTime
  from `current`, not from raw scroll position. Undamped reads as a flipbook. This is the single most
  important detail — verify it by scrolling fast and confirming the video trails smoothly rather than
  snapping frame to frame.
- Non-linear pacing: smootherstep(t) = t*t*t*(t*(t*6-15)+10) applied to progress before it drives
  currentTime.
- Station 0 starts at full opacity (no fade-in); the last pinned station's label holds through the
  release into the Trust panel rather than fading out right before the pin ends. Symmetric fades on
  every station is a known bug from a previous build of this site — don't reintroduce it.
- On visibilitychange back to visible: re-read scroll and snap current = target before continuing
  (rAF is suspended while the tab is hidden, so state goes stale and the video jumps otherwise).
- Keep the media source behind a <CinematicStage> component so it can be swapped later without
  touching the rest of the site. This is an existing architectural rule in this repo — respect it.
- Centralize the station timeline in lib/scene/ as the single source. Never hard-code percentages or
  progress ranges across components.
- The served video (lambo-wash-01-scrub.mp4) is all-intra encoded (every frame a keyframe)
  specifically so currentTime seeking is instant. Do NOT re-encode, compress, or "optimize" it — that
  reintroduces seek lag. If ffmpeg or any build step touches it, that's a bug.
- If for any reason the video files are missing at build/runtime, fall back to the still images, and
  if those are missing too, render a clearly-labeled placeholder. Never silently fail or fake footage
  that doesn't exist.

DESIGN
Follow docs/DESIGN_DIRECTION.md exactly. ESTATE: the film plays in FULL NATIVE COLOUR — do NOT
desaturate or grayscale it, that was the previous (now superseded) direction. UI chrome (wordmark,
nav, labels, trust panel, before/after captions) stays achromatic using the --ink/--paper/--panel/
--muted tokens in that doc. Display type is Fraunces (serif), labels are Archivo at .34em tracking.
There is no separate UI accent colour — the only saturated colour on the page is the light already in
the footage.

Load fonts via:
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Archivo:wght@400;500;600;700;800&display=swap

QUALITY BAR
- TypeScript and lint must be clean. Fix errors immediately, do not leave them.
- Verify the site actually runs (npm run dev) and the scrub actually works — forward, backward, and
  paused mid-scroll (video must freeze mid-motion, not snap to a nearest keyframe) — before you
  report done.
- Small targeted edits over the existing scaffold where it still fits (Next.js App Router, TS,
  Tailwind, GSAP are already installed in package.json). No new dependencies beyond what's already
  there unless something in these docs specifically requires it.
- Do not add sections, features, or copy beyond what's specified above.
```

---

## After Cursor finishes

Check these by hand, in this order:

1. **Scroll backward.** The clip must run in reverse smoothly through the pinned phase.
2. **Stop mid-scroll.** The video must freeze mid-motion (foam mid-spread), not snap to a nearest
   state.
3. **Land on the page.** The "Arrival" label must already be visible with no fade-in delay.
4. **Scroll to the end of the pin.** It should release cleanly into the Trust panel — no visible pop
   or layout jump at the handoff.
5. **Read the Before/After labels.** They must say "Arrival" / "Full coverage" (or equivalent honest
   wording), never anything implying a finished clean reveal.
6. **375px viewport.** Confirm the Fraunces trust-panel headline wraps cleanly and nothing overflows.
7. **Background the tab, return.** The video must resync rather than jump from a stale position.
8. **Check the video file actually served.** Open devtools → Network, confirm
   `lambo-wash-01-scrub.mp4` is what's requested, not `lambo-wash-01.mp4`.
