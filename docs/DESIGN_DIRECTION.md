# Design Direction — ESTATE (LOCKED, v3)

> Locked 2026-09-08 after the owner supplied a real footage clip (`public/video/lambo-wash-01.mp4`)
> and a competitor reference (a site called "VARNISH" — static-camera driveway wash, serif wordmark,
> bold serif trust statement, before/after slider). **This replaces MINERAL (the v2 direction)
> entirely** and replaces `claude.md` §4. Palette, type and motion below are the source of truth.

---

## 1. The direction in one line

**Let the footage carry the colour.** The clip is golden-hour, warm stone, palm green, glossy black
paint — full native colour, ungraded. The UI stays quiet and achromatic (ink / paper / warm neutral
grey) so it never competes with the light already in the frame. Type is an elegant serif, not a
brutalist condensed display face — the mood here is *estate*, not *industrial bay*.

Why this replaces MINERAL: MINERAL was built for a dark, moody wash-bay clip and worked by stripping
all colour so the amber backlight was the only colour anywhere. The new clip is the opposite kind of
footage — bright, warm, outdoors — so forcing `grayscale(1)` on it would throw away the exact quality
that made the reference (and the owner's own clip) worth building around.

---

## 2. Tokens (authoritative)

```css
:root {
  /* colour — UI stays achromatic; the film carries all saturation */
  --ink:      #0E0D0B;   /* primary text on light ground, dark panel background */
  --paper:    #F6F2E9;   /* warm off-white ground for released-scroll sections */
  --paper-fg: #0E0D0B;   /* text on --paper */
  --panel:    #0B0A08;   /* trust-panel / before-after dark background */
  --panel-fg: #F6F2E9;   /* text on --panel */
  --muted:    #8A8375;   /* warm neutral grey — sub-copy, rules, labels (replaces v2's #8C99A6) */
  --rule:     rgba(14,13,11,.14);       /* hairlines on --paper */
  --rule-inv: rgba(246,242,233,.18);    /* hairlines on --panel / over the film */

  /* type */
  --display-font:   "Fraunces", serif;
  --display-weight: 480;
  --display-optical: "opsz" 72; /* Fraunces variable axis — use the display/optical-size cut, not text */
  --display-size:   clamp(2.25rem, 8vw, 6.5rem);
  --display-ls:     -.01em;
  --display-lh:     .98;

  --label-font: "Archivo", sans-serif;   /* carried over from v2 — reads well small */
  --label-ls:   .34em;
  --label-size: .6rem;
  --label-weight: 600;
}
```

**Film grade:** none. Serve the clip at native colour. If it needs any correction at all, a gentle
`contrast(1.04) saturate(1.05)` at most — this is a taste call at build time, not a mandate. **Do
not desaturate.**

**Scrim (over the film, for the wordmark/nav only):** `linear-gradient(180deg, rgba(0,0,0,.35) 0%,
rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,.4) 100%)` — top and bottom only, so the chrome is
legible without veiling the car, which sits in the clear middle band.

**Fonts:** Fraunces (display/serif) + Archivo (labels), both Google Fonts.
```
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Archivo:wght@400;500;600;700;800&display=swap
```

---

## 3. Type behaviour

- Display type (wordmark, trust-panel headline) is a serif, set well inside the viewport — this is
  *not* the v2 bleed-off-both-edges brutalist treatment. It should read like a confident magazine
  headline, not a poster.
- The trust-panel headline is the single largest text moment on the page — e.g. "THE STANDARD ON
  YOUR STREET." (placeholder copy; owner has not signed off on final words). Set on `--panel`
  background, `--panel-fg` text.
- Sub-copy and reviews stay small, `--muted`, max-width ~26rem.
- Labels (`--label-font`) are small caps-style tracked text: section eyebrows, nav items, the
  progress readout. Progress can be a simple numeral or a thin rail — no giant numeral requirement
  this time (that was a MINERAL-specific device tied to the bleed-type treatment).

---

## 4. Chrome

Wordmark `[BRAND]` (placeholder — owner supplies the real name/logo) bottom-left, sitting directly on
the film with the scrim beneath it — this placement is deliberate, copied from the competitor
reference, not top-left like v2. Minimal nav top-right. Hairline progress rail along the bottom edge
of the pinned stage.

**Forbidden** (carried forward, still binding): SaaS gradients · glassmorphism · card grids ·
rounded-everything · sci-fi portals · game-like visuals · visible human detailer · clutter ·
decorative motion with no purpose. No bounce, no random parallax, no generic scroll-reveals.

---

## 5. Sections after the pinned hero (new in v3)

The v2 direction was a single long film with no page content after it besides the CTA. v3 adds two
ordinary (non-pinned) sections once the hero scrub releases, matching the competitor reference
structure:

1. **Trust panel** — dark (`--panel`), the big serif headline + a short line of review/credibility
   copy. Text only, no media dependency, so it's buildable immediately.
2. **Before/After** — a comparison of `public/images/lambo-wash-01-first.jpg` (arrival) against
   `public/images/lambo-wash-01-last.jpg` (full foam coverage). **Label these honestly** — "ARRIVAL"
   vs "FULL COVERAGE," not "before/after clean" — because no rinsed-clean frame exists yet (see
   `docs/FILM_PIPELINE.md` §5). Swap the labels and the second image the moment a real reveal frame
   lands; don't fake the copy in the meantime.

Both sections use the same achromatic UI tokens as the chrome; only the film itself carries colour.

---

## 6. Known constraint to handle at build time

Fraunces at `--display-size` is comfortably inside the viewport at all breakpoints by design (unlike
v2's intentional 15vw bleed), so there is no mobile-floor crisis to solve here — but still verify the
trust-panel headline wraps cleanly at 375px before shipping.
