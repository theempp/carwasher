# Booking Composer — the page's ending (v3.1 spec, not yet built)

> Decided 2026-09-08 (night). Replaces the dead `#book` anchor in `app/components/CtaSection.tsx`.
> This is the **only** new section in v3.1 — the process ledger was considered and cut, so the page
> stays short and mobile stays cheap. `docs/DESIGN_DIRECTION.md` owns the look this must obey.

---

## 1. Why this and nothing else

Today the CTA is a heading and an `<a href="#book">` that points at its own section — a link to
nowhere. It is the only part of the site that does commercial work and it currently does none.

Two sections were on the table; the owner cut the process ledger to protect mobile performance. So
everything goes here, and the page ends: **hero scrub → Trust → Comparison → Request a time.** No
other sections. No new routes — the value of this site is one uninterrupted scroll, and a nav that
jumps to `/services` breaks the film's spell.

---

## 2. What it does

Three choices, composing one prefilled message that hands off to the owner's real channel:

1. **Service** — tier or job type (3 options, placeholder names)
2. **Vehicle** — free text, one line
3. **Preferred window** — a small set of coarse options, not a date picker

The composed message is **shown on the page before it is sent**, so the user can see exactly what
they are about to hand over, and so the section is testable with no channel wired.

**Still zero backend.** The output is a link: `sms:` / `tel:` / an Instagram DM URL / a Calendly
prefill / Square. No form POST, no validation theatre, no email capture.

---

## 3. What is blocked on the owner

- **The channel.** Which of phone / Instagram / Calendly / Square, and the actual destination.
  Until it is supplied, `BOOKING_HREF` stays a single clearly-labeled placeholder constant in one
  place, and the composed message renders so the flow can still be verified end to end.
- **The words.** Tier names, what each includes, prices, turnaround.

**Honesty rule (binding, same as the comparison labels):** no prices, no turnaround promises, no
guarantees, no "spotless/finished/detailed" language until the owner signs the words. Placeholder
copy must read as placeholder — never as a claim. The film shows a wet car; the site never says
otherwise.

---

## 4. Form and behaviour

- **Not a card grid, not a pricing table** — both forbidden. Options are a tracked-label list on
  hairline rules, `--muted` at rest, `--ink`/`--panel-fg` when selected, using ESTATE tokens exactly.
- Real radio-group semantics (`role="radiogroup"`, arrow-key navigation, visible focus). Keyboard
  reaches everything.
- **No hover-only affordances** — this is the section a thumb has to operate. Every target
  comfortably thumb-sized and inside the safe area.
- Motion: clip-reveal and opacity only. No bounce, no parallax. Honors `prefers-reduced-motion` —
  which the current section does not, and neither do `TrustPanel` or `BeforeAfter`.
- Selection state is local component state. Nothing persists, nothing is stored, nothing is sent
  anywhere until the user follows the link.
- The plain link out is present in the DOM from the first render, so the section still works if the
  interactive layer fails.

---

## 5. Also in v3.1 (upgrades, not new sections)

- **Navigation** — currently absolute inside the hero, so it disappears the moment the pin releases.
  Make it a persistent hairline header that inverts across film → panel → paper.
- **ScrollProgress** — extend the rail past the pin across the whole document, so the numeral keeps
  meaning something after the film ends.
- **TrustPanel** — per-line clip-reveal and a rule that draws, replacing the single fade.
- **BeforeAfter** — keep the two-up. A wipe would imply one locked camera and the two frames are shot
  from different distances. Add a press-and-hold 1:1 loupe for honest inspection.
- **Reduced motion** — the scroll hook honors it; none of the Motion sections do. Fix with the above.

No new dependencies. `gsap`, `motion` and `lenis` are already installed. `three` / `@react-three/*`
are installed but **unused, and stay unused** — R3F here would fight ESTATE and cost the frames the
scrub needs.
