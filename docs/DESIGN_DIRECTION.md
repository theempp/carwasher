# Design Direction — MINERAL (LOCKED)

> Owner-approved 2026-09-08 after a live side-by-side scroll test of three directions
> (Apex / Tungsten / Mineral) in `public/direction-lab.html`.
> **This replaces `claude.md` §4 entirely.** Palette, type and motion below are the source of truth.

---

## 1. The direction in one line

**Brutal monochrome.** Pure black and white, the film fully desaturated, oversized condensed type
bleeding off both edges of the frame. **No chromatic accent anywhere** — the only colour in the
entire site is the light inside the film itself.

Why it won: the other two directions spent an accent colour on UI. Mineral spends nothing, so every
bit of colour the viewer sees is the wash bay's own light on wet Mineral Grey paint. The type gets
out of the way by being *enormous* rather than by being quiet.

---

## 2. Tokens (authoritative)

```css
:root {
  /* colour — greyscale only, no chroma */
  --bg:      #000000;   /* page + stage ground */
  --fg:      #FFFFFF;   /* display type, wordmark */
  --muted:   #8C99A6;   /* sub-copy, labels, rules — mineral blue-grey */
  --accent:  #8C99A6;   /* SAME as muted. There is deliberately no accent hue. */
  --rule:    rgba(255,255,255,.18);

  /* type */
  --display-font:   "Anton", sans-serif;
  --display-weight: 400;
  --display-size:   clamp(2.75rem, 15vw, 15rem);   /* mobile floor, see §5 */
  --display-ls:     .005em;
  --display-lh:     .86;
  --display-transform: uppercase;

  --label-font: "Archivo", sans-serif;
  --label-ls:   .34em;
  --label-size: .6rem;
}
```

**Film grade:** `filter: grayscale(1) contrast(1.16)` on the video element. The footage is graded to
monochrome in the browser, so a colour-graded master still reads correctly.

**Scrim:** `linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.1) 40%, rgba(0,0,0,.75) 100%)`
— top and bottom weighted, middle clear so the car is never veiled.

**Fonts:** Anton + Archivo, both Google Fonts.
```
https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700;800&display=swap
```

---

## 3. Type behaviour (this is the direction, not decoration)

- Display type is set at **~15vw** and is *meant* to bleed off both edges. Do not fit it to the
  viewport. `white-space: nowrap` on the headline; overflow is intentional.
- Each station's type slides **counter to the scroll direction** — as the film advances right, the
  type drifts left. Shift range ≈ `(0.5 - localProgress) * 42vw`.
- Sub-copy stays small, `--muted`, max-width ~22rem, and does *not* bleed.
- Progress readout is a **giant numeral** in the display face (≈2.6rem), not a percentage label.

---

## 4. Chrome

Wordmark `MINERAL` top-left, nav top-right (Work / Process / Book), hairline progress rail at the
bottom, giant progress numeral above its right end. That is the entire UI.

**Forbidden** (carried forward from `claude.md` §4, still binding): SaaS gradients · glassmorphism ·
card grids · rounded-everything · sci-fi portals · game-like visuals · visible human detailer ·
clutter · decorative motion with no purpose. No bounce, no random parallax, no generic
scroll-reveals.

---

## 5. Known constraint to handle at build time

`clamp(2.75rem, 15vw, 15rem)` — 15vw is 216px at 1440w, which is correct and intended on desktop.
**The mobile floor matters:** below ~430px the headline must not swallow the viewport. The clamp
floor above is the fix; verify on a 375px viewport before shipping.

---

## 6. Where this was decided

`public/direction-lab.html` — the live three-way comparison, driven by the real hero footage with a
damping slider and a linear/cinematic pacing toggle. Keep it in the repo as the reference for how
the motion should feel; it is not part of the shipped site.
