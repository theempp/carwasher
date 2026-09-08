# Scroll Mechanics — how the continuous take reveals (LOCKED)

> Derived 2026-09-08 from two owner-supplied reference videos, analysed frame by frame.
> This is the behavioural spec for the scroll experience. `docs/FILM_PIPELINE.md` owns the film;
> `docs/DESIGN_DIRECTION.md` owns the look; **this file owns the motion.**

---

## 1. The references

| | Ref A | Ref B |
|---|---|---|
| Source | `ScreenRecording_09-08-2026 10-33-11_1.mov` (4.5s) | `ScreenRecording_09-08-2026 00-08-21_1.mov` (8.2s) |
| Site | "Blue-Water Luxury" (`localhost:5174`) | "Pear", via WebForge |
| Subject | Superyacht at sunset | Grafted pear branch → tree |
| Tech | Scroll-controlled WebGL | Scroll-controlled WebGL |

Both refs are real-time 3D. **We are reproducing the *grammar* with a video scrub**, which is a
legitimate and simpler path to the same feel (it is what Apple ships). The grammar below is what
matters; the rendering technique is not.

---

## 2. Ref A is our storyboard, beat for beat

Ref A's structure already matches the locked film:

1. Yacht as a dot on the horizon — wide, near-still. Text **left**.
2. Slow approach. Text swaps to **centre**.
3. Closer. Text **right**.
4. Yacht fills frame and sweeps past camera (heavy motion blur).
5. Camera travels **along the hull**.
6. Eases **into the lit interior**.

Swap yacht → car and ocean → wash tunnel and that is our six-beat film, **including the ease into the
cabin**. Ref A's exterior→interior move is the direct analogue of our interior glimpse. The locked
direction is externally validated — do not re-litigate the beats.

---

## 3. The six mechanics (implement all six)

1. **Scroll is the transport, not a trigger.** Position-mapped, never event-fired. Stop scrolling and
   the image freezes *mid-motion*; scroll back and it runs backward. **This reversibility is the
   single biggest tell** separating this from ordinary scroll-reveal.
2. **One subject that never resets.** Continuous in space and time. (This is exactly the failure the
   old per-scene clips had — each re-anchored to the same dirty reference, so the car reset at every
   boundary and it read as cutting between pages.)
3. **Pinned stage.** Media is `position: fixed`, full-bleed. Nothing scrolls *past*. The scroll
   container is an empty runway whose only job is to generate progress distance (~760vw).
4. **Damped scroll.** Lerp `current` toward `target` each frame (`current += (target-current)*k`,
   k ≈ **0.09**) and drive `video.currentTime` from `current`. **Undamped = flipbook. Damped =
   footage.** This is the detail most implementations miss and it is not optional.
5. **Text as stations composed into the shot.** Copy fades in/out on the same progress value, at
   varying positions in frame. It never pushes layout and never sits in a fixed corner.
6. **Non-linear pacing.** `smootherstep(t) = t³(t(6t−15)+10)`. Slow hold at the open, acceleration
   through the middle, settle at the payoff. At 20% scroll you are only ~6% into the film; at 80%
   you are ~94%. This is Ref A's yacht sitting tiny on the horizon before rushing past.

**Ref B's extra trick, held in reserve:** when it changes context it carries continuity by keeping
the *pear* present across the change — object permanence rather than camera permanence. If a chain
hand-off ever comes out rough, keep the car unmistakably the same car through the join.

---

## 4. Horizontal mapping

- Page scrolls **right**; the car advances right; left = dirty, right = spotless.
- `progress = window.scrollX / (document.body.scrollWidth - window.innerWidth)`.
- **Map vertical wheel to horizontal advance** so a normal trackpad works:
  on `wheel`, if `|deltaY| > |deltaX|`, `preventDefault()` and `scrollBy({left: deltaY})`.
- Support arrow keys (←/→ and ↑/↓) for accessibility.

---

## 5. Two implementation traps (both hit and solved already)

**Trap 1 — keyframes.** `video.currentTime` seeking snaps to the nearest keyframe. The original
`wash-hero.mp4` had **exactly 1 keyframe across 193 frames**, so every seek decoded from frame zero.
Encode the master **all-intra**:

```bash
ffmpeg -i film-master.mp4 -c:v libx264 -g 1 -preset veryfast -crf 20 \
       -pix_fmt yuv420p -an film-master-scrub.mp4
```

Cost measured on the hero clip: 3.3MB → 6.2MB, **1.9× size for instant seeking.** Non-negotiable.

**Trap 2 — endpoint fades.** If every station fades symmetrically, the first headline is invisible on
arrival (localProgress 0 → opacity 0) and the BOOK CTA vanishes exactly at 100%. **Station 0 opens
already at full opacity; the last station holds through the end.** Only the middle stations fade on
both sides.

Also: `requestAnimationFrame` is suspended while a tab is hidden, so state goes stale. On
`visibilitychange` back to visible, re-read scroll and snap `current = target` before applying.

---

## 6. Station map

Six stations over progress 0..1, matching the film's beats:

| # | Range | Eyebrow | Headline | Sub |
|---|---|---|---|---|
| 0 | .00–.16 | Segment 01 — Arrival | It arrives / as it is | No judgement. Just the before. |
| 1 | .16–.34 | Segment 02 — Wheels | Where / it hides | Brake dust, road film, winter brine. |
| 2 | .34–.54 | Segment 03 — Foam | Under / the foam | pH-neutral. Zero contact. Zero swirl. |
| 3 | .54–.70 | Segment 04 — Rinse | Stripped / to paint | Every panel sheeted clean. |
| 4 | .70–.86 | Segment 05 — Cabin | Inside / the quiet | Glass, leather, vents, seams. |
| 5 | .86–1.0 | Segment 06 — Reveal | It leaves / transformed | Book the detail. → CTA |

Copy is a working draft — the owner has not signed off on the words, only the structure.

---

## 7. Reference implementation

`public/direction-lab.html` implements all of the above against the real hero footage. Read it before
rebuilding; it is the behavioural reference, not shipped code.
