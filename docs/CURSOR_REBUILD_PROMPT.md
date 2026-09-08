# One-shot Cursor rebuild prompt

> Paste the block below into Cursor as a single prompt. It is written to be self-contained.
> Do not paste the surrounding notes.

---

## Notes before you paste (for the owner, not for Cursor)

- **Figma is NOT in this pipeline.** Verified 2026-09-08 via the Figma MCP `whoami`: the account
  (`enzo marin`, `enzo marin's team`) is on a **View seat, Starter tier** — read-only. `create_new_file`,
  `use_figma` and `generate_figma_design` all require a Full/Dev seat. Decision: build straight to code
  from the token spec in `docs/DESIGN_DIRECTION.md`. Revisit Figma only if the site grows real pages
  (service menu, pricing, booking flow), where components and handoff start paying for themselves.
- The film does not exist yet — **zero credits spent.** The prompt below tells Cursor to build against
  a placeholder so the whole site is testable before footage lands.

---

## THE PROMPT

```
Rebuild this Next.js site as a horizontally scroll-scrubbed cinematic film.

READ FIRST, in this order — they are the source of truth and they override your assumptions:
1. docs/SCROLL_MECHANICS.md   — how the scroll must behave (six mechanics, all mandatory)
2. docs/DESIGN_DIRECTION.md   — the MINERAL design tokens (locked, do not invent alternatives)
3. docs/FILM_PIPELINE.md      — the film source and how it gets assembled
4. claude.md                  — master brief; §4 and §5 are superseded by the two docs above

Also read public/direction-lab.html. It is a WORKING reference implementation of the exact scroll
behaviour and the MINERAL direction, verified in-browser. Match its behaviour. It is not shipped
code — reimplement it properly in React/TypeScript, do not copy the file into the app.

WHAT TO BUILD

A single page. One pinned full-bleed <CinematicStage> and a horizontal scroll runway (~760vw) whose
only job is to generate progress. Six text stations composed over the film. Minimal chrome:
wordmark, nav, hairline progress rail, giant progress numeral. Ends in a BOOK CTA that links out.

NON-NEGOTIABLES
- Scroll is HORIZONTAL. progress = scrollX / (body.scrollWidth - innerWidth). Car advances right.
- Map vertical wheel to horizontal advance (if |deltaY| > |deltaX|: preventDefault, scrollBy left).
  Support arrow keys.
- DAMPED scrub: lerp current toward target at k = 0.09 in a rAF loop, then drive the film from
  `current`. Undamped reads as a flipbook. This is the single most important detail.
- Non-linear pacing: smootherstep(t) = t*t*t*(t*(t*6-15)+10) applied to progress before it drives
  the film.
- Station 0 starts at full opacity (no fade-in); the last station holds through the end (no
  fade-out). Only middle stations fade both ways. Symmetric fades leave the hero headline invisible
  on arrival and kill the CTA exactly at 100% — this bug has already been found once.
- On visibilitychange back to visible: re-read scroll and snap current = target before applying
  (rAF is suspended while hidden, so state goes stale).
- Keep the film source behind <CinematicStage> so frames/video/3D can be swapped without touching
  anything else. This is an existing architectural rule — respect it.
- Centralize the station timeline in lib/scene/ as the single source. Never hard-code percentages
  across components.

THE FILM SOURCE
public/video/film-master-scrub.mp4 does NOT exist yet. Until it does, <CinematicStage> must fall
back to public/video/wash-hero-scrub.mp4, and if that is missing too, render a clearly-labeled
placeholder showing the current station label. Never fake an asset and never invent a file path.
When the real master lands, dropping it in must upgrade the site with no code change.

Note: the served video is all-intra encoded (every frame a keyframe) specifically so currentTime
seeking is instant. Do not re-encode or "optimize" it to a smaller file — that reintroduces seek lag.

DESIGN
Follow docs/DESIGN_DIRECTION.md exactly. MINERAL: pure black/white, film filtered
grayscale(1) contrast(1.16), Anton display type at ~15vw bleeding off both edges and drifting
counter to the scroll, Archivo labels at .34em tracking, #8C99A6 for sub-copy and rules.
THERE IS NO ACCENT COLOUR — do not add one. The only colour on the site is the light in the film.

Clamp the display size so it does not swallow a 375px viewport, and verify there.

QUALITY BAR
- TypeScript and lint must be clean. Fix errors immediately, do not leave them.
- Verify the site actually runs and the scrub actually works before you report done.
- Small targeted edits. No new dependencies beyond what package.json already has (gsap is available).
- Do not add sections, features, or copy that were not asked for.
```

---

## After Cursor finishes

Check these by hand, in this order — they are the things most likely to be wrong:

1. **Scroll backward.** The film must run in reverse smoothly. If it only works forward, the scrub is
   event-driven rather than position-mapped and mechanic #1 is broken.
2. **Stop mid-scroll.** The image must freeze mid-motion, not snap to a nearest state.
3. **Land on the page.** The first headline must already be visible.
4. **Scroll to 100%.** The BOOK CTA must still be on screen.
5. **375px viewport.** The Anton headline must not swallow the screen.
6. **Background the tab, return.** The film must resync rather than jump from a stale position.
