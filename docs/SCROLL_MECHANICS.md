# Scroll Mechanics — how the static-shot clip reveals (LOCKED, v3)

> Updated 2026-09-08 after the owner supplied `lambo-wash-01.mp4` and the direction moved back to a
> **vertical** scroll over a **static-camera** clip. `docs/FILM_PIPELINE.md` owns the film;
> `docs/DESIGN_DIRECTION.md` owns the look; **this file owns the motion.**
>
> Everything in §3 below is unchanged in substance from the v2 spec — those mechanics were derived
> from real reference sites and are axis-independent. Only the axis (§4) and the station map (§6)
> change for v3.

---

## 1. Why vertical again

v2 moved to horizontal scroll to match a continuous side-travelling camera glide. That footage was
never produced. The clip actually in hand (`lambo-wash-01.mp4`) is a **static locked-off shot** — the
car doesn't travel across the frame, it sits still while the wash happens *to* it. There is no
lateral motion to justify a horizontal scroll axis. Vertical scroll is also what the competitor
reference site ("VARNISH," analysed 2026-09-08) uses for this exact kind of shot. Revert to vertical.

---

## 2. What stays true regardless of axis

These were derived from real reference sites (a yacht site and a grafted-tree site, both real-time
3D) in the v2 session and hold regardless of scroll direction:

1. **Scroll is the transport, not a trigger.** Position-mapped, never event-fired.
2. **One subject that never resets.** The car and camera are continuous in space and time for the
   whole pinned duration.
3. **Pinned stage.** Media is `position: fixed`, full-bleed, while an empty scroll runway generates
   progress distance.
4. **Damped scroll.** Lerp `current` toward `target` each frame
   (`current += (target - current) * k`, k ≈ **0.09**), drive `video.currentTime` from `current`, not
   from raw scroll. **Undamped = flipbook. Damped = footage.** Not optional.
5. **Non-linear pacing.** `smootherstep(t) = t³(t(6t−15)+10)` applied to progress before it drives
   playback — a slower hold at the open, faster through the middle. As of 2026-09-08 the site uses
   `cineEase` (22% linear + 78% smootherstep) so the first scroll actually moves the clip; damping
   `k = 0.09` is unchanged. Tune in `lib/animation/easing.ts` only.
6. **Text as stations composed into the shot**, fading on the same progress value, never pushing
   layout.

---

## 3. Two implementation traps (both hit before, both apply again)

**Trap 1 — keyframes.** `video.currentTime` seeking snaps to the nearest keyframe.
`lambo-wash-01.mp4` measured at **1 keyframe across 121 frames** — already fixed, see
`docs/FILM_PIPELINE.md` §3. Serve `lambo-wash-01-scrub.mp4`, never the raw file.

**Trap 2 — endpoint fades.** If every station fades symmetrically, the first label is invisible on
arrival and the last one vanishes exactly at the pin's end. **Station 0 opens at full opacity; the
last pinned station holds through release into the trust panel.** Only middle stations fade both
ways.

Also: `requestAnimationFrame` is suspended while a tab is hidden. On `visibilitychange` back to
visible, re-read scroll and snap `current = target` before continuing, or the video jumps once the
tab refocuses.

---

## 4. Vertical mapping

- Page scrolls **down**; the clip advances from arrival toward full foam coverage as scroll
  increases; scrolling up runs it backward.
- Inside the pin range:
  `progress = clamp((scrollY - pinStart) / pinRangeHeight, 0, 1)`
  where `pinRangeHeight` is the scroll distance allotted to the pinned stage (GSAP ScrollTrigger's
  `end` relative to `start`) — tune this so the clip's 5.04s duration feels deliberate, not rushed;
  start around **400–600vh** of runway and adjust by feel.
- Standard vertical wheel/trackpad/touch input works natively — **no wheel-axis remapping needed**
  this time (that was a horizontal-scroll-only requirement in v2 and can be dropped).
- Arrow keys (↑/↓), Page Up/Down, spacebar should all work as they normally do for vertical scroll —
  don't intercept them; ScrollTrigger's pin handles this if wired normally.

---

## 5. Release into normal scroll

Once `progress` reaches 1.0 (currently: full foam coverage), the pin releases and the page continues
as an ordinary vertical scroll into the Trust panel and Before/After section
(`docs/DESIGN_DIRECTION.md` §5). These sections are NOT pinned and NOT scroll-scrubbed — they're
regular content with restrained scroll-triggered fade/translate-in, same motion vocabulary, much
simpler mechanics (no video, no damping needed).

**When clip 2 + the remainder exist:** they belong on this same pinned stage, not as new page
sections. Extend `PIN_RUNWAY_VH` so the full film still feels **somewhat fast, not slow**; add
stations that match real beats (rinse / near-door foam interior / front hold / drive-off); keep
Trust / comparison / BOOK after the pin. Generate and wire only when the owner says so — see
`docs/FILM_PIPELINE.md` §5 and `docs/REMAINDER_BRIEF.md`. Clip 1 on the site stays static.
Clip 2 is signed (frozen rinse) and not wired. Remainder camera is a **drone** — motivated
(a wash step, a part, a process), never empty coverage, never a rear-jerk (`docs/FILM_PIPELINE.md`
§4 camera law).

---

## 6. Station map (pinned phase only)

> **Superseded 2026-09-08 (evening).** The table below described the 5.04s clip-1 hero. The pinned
> phase is now the 25.33s full-film trim, and the stations live in `lib/scene/sceneTimeline.ts` —
> that file is the single source, this table is kept only as the shape of the thing.
> Current stations, keyed to film progress (clip-time / 25.333):
> arrival `.000–.075` · the wash `.075–.276` · the rinse `.276–.513` · the door `.513–.660` ·
> inside `.660–.908` · the close `.908–1.000` (holds through release).
> `PIN_RUNWAY_VH` is **13** — 25s at clip 1's density crawled.

The pinned phase is one continuous clip, not eight invented beats like v2 — station count matches
what's actually visible in a 5-second clip:

| # | Range (of pin progress) | Eyebrow | Headline | Sub |
|---|---|---|---|---|
| 0 | .00–.30 | Arrival | It shows up / exactly as it is | No staging. This is the car as it arrived. |
| 1 | .30–.75 | The wash | Watch it / disappear | Foam builds, panel by panel. |
| 2 | .75–1.0 | (holds, no new label — carries into Trust panel on release) | | |

Copy is a working draft — the owner has not signed off on final words. Keep station 0 at full opacity
on load (Trap 2, §3) and let the last station's label persist through release rather than fading out
right before the pin ends.

## 6b. Runtime cost — the traps that only show up on a phone (v3.1)

> Added 2026-09-08 (night). `docs/QUALITY_AND_PERF.md` §5 is the full list with file/line detail;
> these are the ones that are *motion* bugs rather than media bugs, so they are recorded here too.

**Trap 3 — a seek queue is not a playhead.** `seekVideo` currently assigns `video.currentTime` on
every rAF where the delta exceeds 0.003. Desktop absorbs it; iOS backs the seek queue up until the
film stutters or stalls mid-scroll. **Keep at most one seek in flight:** skip while `video.seeking`
is true, hold the pending target, apply it on `seeked`. Damping (§2.4) decides *what* the playhead
should be; this decides *how often we are allowed to ask for it*. The two are separate and both are
required.

**Trap 4 — `dvh` moves while you scroll.** The stage is `h-dvh`, and on iOS Safari and Chrome Android
the URL bar showing/hiding changes `dvh` mid-gesture. With `invalidateOnRefresh: true` the pin then
recalculates under the user's thumb — the classic pin jump. Fix with
`ScrollTrigger.config({ ignoreMobileResize: true })`.

**Trap 5 — two owners for one lenis, and a proxy nobody reads.** `SmoothScroll` (in `layout.tsx`) and
`useScrollProgress` both call `ensureSmoothScroll()`, and only the former calls
`releaseSmoothScroll()` on cleanup — under StrictMode's dev double-invoke that can destroy lenis
while the hook still depends on it. Separately, `lenis.ts` registers a `scrollerProxy` on
`document.documentElement` while the `ScrollTrigger.create` in `useScrollProgress` sets no `scroller`
and so uses the default (window) and never consults it — meanwhile `lenis.on("scroll", …)` calls
`ScrollTrigger.update()` on top of ScrollTrigger's own listener. Verify, then own the lifecycle in
one place and remove the dead path so update runs once per frame.

**Trap 6 — never swap `src` mid-session.** v3.1 serves a 720p file to portrait/mobile and a 1080p
upres to desktop landscape. Choose **once, at mount**. Changing `src` later resets `currentTime` and
drops the playhead on the floor.

---

## 7. Reference implementation

`public/direction-lab.html` still exists from v2 and demonstrates the damping/pacing mechanics
correctly, but its footage, axis, and visual direction are all superseded — read it only for the
motion math (damping constant, smootherstep, endpoint-fade handling), not for layout or look.
