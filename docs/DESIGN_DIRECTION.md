# Design Direction — ESTATE (film) / HOUSE (below pin)

> Film direction locked 2026-09-08 from the owner clip. Below-pin rebuilt 2026-09-10 from an Awwwards + Dribbble hunt. Palette below the pin is a different instrument — limestone and charcoal, not cream Fraunces on hairlines.

## 1. One line

**Film:** golden-hour estate light carries the colour. Overlay stays quiet so it never competes with black paint, warm stone, and the palm.  
**Below the pin:** the page is a house, not a leftover landing. Charcoal / limestone, editorial serif, one hard book.

## 2. Film tokens (overlay only)

```css
:root {
  --ink:      #101114;
  --paper:    #dad0c1;
  --paper-fg: #1c2329;
  --panel:    #101114;
  --panel-fg: #f3eee6;
  --muted:    #8b8680;
  --rule:     rgba(28, 35, 41, 0.16);
  --rule-inv: rgba(243, 238, 230, 0.18);

  --display-font: "Instrument Serif", serif;
  --label-font:   "Instrument Sans", sans-serif;
}
```

Film grade: **none.** Native golden hour. Never desaturate. Never a CSS `filter` on the live `<video>`.

Grain: static tiled texture, ~2.5% opacity, as shipped. Never animated.

Scrim (wordmark / nav only): top and bottom bands. The car sits in the clear middle.

## 3. Below-pin tokens (scoped to `.after-pin`)

From the hunt (Amali limestone, Carlyle house voice, O’Gara editorial). Restyle to this driveway — do not copy those brands, and do not copy the KCS shop.

```css
.after-pin {
  --house-ink:    #1c2329;
  --house-stone:  #dad0c1;
  --house-paper:  #f3eee6;
  --house-muted:  #6f6a62;
  --house-display: "Instrument Serif", serif;
}
```

- Display: Instrument Serif, roman, tight leading, sentence case.
- Body: Instrument Sans, regular. No tracked caps.
- No Fraunces, no Archivo tracking, no cream `#F6F2E9`, no Syne extra-bold.

## 4. Type

- Wordmark on the film: **CtLuxuryDetails** (serif, overlay). It leaves with the pin.
- Below-pin display: Instrument Serif, few words, no slogan until signed.
- Station copy stays composed into the shot.
- One family pair for the whole site.

## 5. Forbidden

SaaS gradients · glassmorphism · card grids · bounce · decorative parallax · industrial wash-bay look · fake “after” chrome · copying Amali / Carlyle / O’Gara / Semler / KCS as the page · leftover Trust → Comparison → Booking.

## 6. Released sections

Pin is the film (ESTATE overlay). Film Book stays quiet. Below the pin, in this order:

1. `shop-rail` — after pin only
2. House statement — `type-object` / `stone-field`
3. The drive — `split-concept`
4. The sequence — `sequence-slab` from signed stations only
5. Frames — honest first / last stills (`type-object`), loupe intact
6. Request a time — existing composer, restyled (`rule-field` + `hard-cta`)
7. `compass-end`

Do not invent film the hero does not show. No prices until signed.
