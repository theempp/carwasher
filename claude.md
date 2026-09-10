# Luxury Auto Detailing — Cinematic Scroll Website (Master Brief)

> Canonical source of truth. Every tool (Claude, Cursor, Google Antigravity) reads THIS file first.
> The original long-form vision is preserved at `docs/ORIGINAL_BRIEF.md`.

> ⚠️ **UPDATE 2026-09-08 (v3) — direction RE-LOCKED again, this time from a real owner-shot clip.**
> The film is now **ONE static locked-off shot** (camera never moves), **VERTICAL scroll**, a glossy
> black **Lamborghini Huracán** on a sunlit estate driveway, shown in full colour (not desaturated).
> This supersedes the previous v2 direction (horizontal continuous take, wash bay, Mineral Grey BMW,
> monochrome MINERAL look) entirely. Authoritative docs:
> - `docs/FILM_PIPELINE.md` — the film (owns the footage)
> - `docs/FULL_FILM_DRAFT.md` — full-film 30s draft (unsigned; sharpen before GO)
> - `docs/REMAINDER_BRIEF.md` — remainder take 2 (unsigned archive / remainder-only path)
> - `docs/DESIGN_DIRECTION.md` — **ESTATE**, the new locked look (owns the palette/type)
> - `docs/SCROLL_MECHANICS.md` — the motion (owns the scroll behaviour, now vertical)
> - `docs/CURSOR_REBUILD_PROMPT.md` — the one-shot prompt to hand to Cursor
> Sections 3–6 below are rewritten to match. Do not build against anything older.

---

> ⚠️ **UPDATE 2026-09-08 (night) — v3.1. Direction unchanged; quality, performance and the ending are.**
> The film's softness was measured, not guessed: the all-intra encode is near-transparent to its
> source (SSIM 0.9937) — **the master is 1280×720 and we upscale it 2.5× on a retina desktop.**
> ⚠️ **UPDATE 2026-09-08 (late) — v3.1.1.** Phone hero was black (moov-at-end + no real poster).
> Desktop interior hitch was 4K all-intra. Served pair is now **faststart 720 (phone)** and
> **faststart 1080 (desktop)**. 4K is loupe stills only. `SEEK_EPSILON` is 0.02.
> ⚠️ **UPDATE 2026-09-09 — v3.1.2.** Faststart was on production; iOS was still black because
> GSAP `pin: true` writes `transform: matrix(1,0,0,1,0,0)` onto the video's ancestor.
> Film is a **fixed layer** + empty runway. Do not restore `pin` on the film. Pickup:
> `docs/NEXT_SESSION.md`.
> ⚠️ **UPDATE 2026-09-09 — v3.1.3.** Desktop playhead is 4K again (local faststart on
> localhost; Vercel Blob on preview/production). Phone stays 720. 1080 is the 4K miss
> fallback. Designer signed this look 2026-09-09 ("keep this version"). Do not revert
> to 1080. No `translateZ` on `<video>`. Interior I-frames can hitch. Do not hand 4K
> to a phone. Pickup: `docs/NEXT_SESSION.md`.
> ⚠️ **UPDATE 2026-09-09 (night) — custom domain.** Production also serves
> `https://ctluxurydetails.com` (www 308s to apex). `carwasher.vercel.app` stays.
> DNS stays at GoDaddy. Do not redo domain attach. Pickup: `docs/NEXT_SESSION.md`.

---

## 1. Concept (one line)

A scroll-controlled cinematic clip of one car being washed on a private estate driveway — **static
camera, golden-hour light, glossy black paint disappearing under hand-sprayed foam as you scroll** —
followed by a short trust statement and a before/after comparison, ending in a BOOK CTA.

The user should feel: *"I'm watching this happen in real time as I scroll,"* not *"I'm scrolling a
website."* Scroll position IS the clip's playhead — nothing more, nothing less.

It must NOT look like a SaaS landing page, template, or generic detailing business site.

---

## 2. Architecture Decision (LOCKED, v3)

**Video-scrub, not canvas image-sequence.** The hero is a single `<video>` element, all-intra
encoded (every frame a keyframe), whose `currentTime` is driven directly by damped scroll progress.

- Why video and not stills now: the footage already exists (owner-shot/-generated real motion —
  spray arcing, foam texture building, light shifting on wet paint) and reads far better as
  continuous video than as ~12 interpolated stills. A static locked camera also means there is no
  camera-move interpolation problem stills would have to fake.
- Why scrubbing a `<video>` is safe: `video.currentTime` seeking snaps to the nearest keyframe. An
  ordinary export has ~1 keyframe for the whole clip, which makes scrubbing unusable. Fixed by
  re-encoding **all-intra** (`-g 1`, every frame a keyframe) — proven on this exact clip, see
  `docs/FILM_PIPELINE.md` §3. This is non-negotiable, not optional polish.
- Canvas image-sequence (the original v1 approach) remains a valid **fallback** if a future scene
  needs to be stills-only (e.g. a static before/after comparison) but is no longer the primary
  mechanism for the hero.

**One full-bleed stage, normal document flow below it.** The hero clip is `position: fixed`
for a vertical scroll runway; Trust / comparison / booking sit in a `relative z-10` stack and
cover it as they arrive. GSAP ScrollTrigger maps runway scroll → progress only — **it does not
`pin` the film.** Pinning writes a transform onto the trigger, and iOS Safari then paints
`<video>` black (even an identity matrix). Do not put `pin: true` or `anticipatePin` back on
any ancestor of the `<video>`.

---

## 3. The Car

**Lamborghini Huracán — gloss black.**

Rationale (changed from v2's Mineral Grey BMW): the payoff in this footage is not paint reflectivity
(dull → mirror) — it's **coverage** (bare gloss paint → foam texture spreading across it). Black
paint gives the sharpest silhouette against the driveway's warm stone, white villa, and golden
backlight, and the black-vs-white-foam contrast is what makes the transformation legible frame to
frame. This also matches the owner-approved external reference (a competitor site, "VARNISH" —
analysed 2026-09-08) which uses the same estate-driveway, static-camera, side-profile setup.

Reference clip: `public/video/lambo-wash-01.mp4` (owner-shot/-sourced, 2026-09-08) — static side
profile, car facing left, herringbone brick driveway, modern white villa with a pierced concrete
screen wall, single palm tree, golden-hour backlight with lens flare from camera-right, hose entering
frame top-left.

---

## 4. Art Direction — **ESTATE (LOCKED 2026-09-08, v3)**

> The authoritative spec is **`docs/DESIGN_DIRECTION.md`** — read it before writing any style code.
> This replaces v2's MINERAL (brutal monochrome, Anton type, forced grayscale grade) entirely.

**Direction: ESTATE.** The film plays in **full native colour** — golden-hour light, warm stone,
palm green — because that warmth *is* the reference look; forcing a grayscale grade (v2's approach)
would destroy the exact thing that sold this direction. UI chrome stays achromatic (ink/paper/warm
neutral grey) so the only saturated colour on the page is the light in the footage itself — same
underlying principle as v2, just no longer applied to the footage too.

Elegant serif display type (**Fraunces**) for the wordmark and the trust-panel headline, paired with
small tracked-out **Archivo** labels (carried over from v2 — it already reads well small).

**UI (only what's necessary):** wordmark · minimal nav · hairline progress rail + numeral · CTA ·
one section label per beat.

**Forbidden:** SaaS gradients · glassmorphism · card grids · rounded-everything · sci-fi portals ·
game-like visuals · visible human detailer · clutter · decorative motion with no purpose.

Motion: restrained. fade / translate / clip-reveal. No bounce, no random parallax, no generic
scroll-reveals everywhere. **Scroll damping is mandatory — see `docs/SCROLL_MECHANICS.md`.**

---

## 5. Scroll Timeline (centralized, tunable)

> Full spec: `docs/SCROLL_MECHANICS.md`. Summary only, below — do not hard-code these numbers in
> more than one place; `lib/scene/sceneTimeline.ts` (or its v3 equivalent) is the single source.

The experience is now **two phases**, not one long multi-beat film:

1. **Pinned hero scrub (vertical, ~0–85% of the runway)** — the hero is
   the signed **25.33s full-film trim**, served as the pair in `FILM`
   (`-v2-grade-faststart.mp4` on phone, 4K on landscape desktop — local
   faststart / Blob remote, 1080 only if 4K misses): foam → rinse → in
   through the near door → interior → back out and the door closes flush.
   `PIN_RUNWAY_VH = 13`. Clip 1, clip 2 and both remainder takes stay on
   disk and are no longer served. Wax is not in the film. 4K JPGs remain
   the comparison loupe.
2. **Normal scroll flow (released, ~85–100%)** — Trust panel ("THE STANDARD ON YOUR STREET." — placeholder copy) →
   Before/After comparison → **Request a time** (the booking composer, `docs/BOOKING_COMPOSER.md`).
   These are ordinary stacked sections, not pinned. The composer replaces the old dead `#book`
   anchor; it is the only section added in v3.1 and the page ends there.

This is a deliberate simplification from v2's eight-beat wash-bay-to-departure narrative: one
continuous drone take carries the whole wash, and anything added later chains onto the same pin
rather than becoming a new page section.

---

## 6. Media Assets

```
public/video/lambo-wash-full-scrub-take1-trim-v2-grade-faststart.mp4
  SERVED on phone / portrait / tablet — 720p all-intra, grade baked, moov at start
public/video/lambo-wash-full-scrub-take1-trim-upres-4k-grade-crf21-faststart.mp4
  SERVED on localhost landscape desktop — 4K all-intra, grade baked, moov at start (gitignored)
FILM.scrubDesktopRemote  (Vercel Blob, same 4K encode)
  SERVED on preview/production landscape desktop — Range-verified; moov at end
public/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade-crf21-faststart.mp4
  FALLBACK on desktop when 4K misses — 1080 all-intra, grade baked, moov at start
public/video/lambo-wash-full-scrub-take1-trim.mp4  25.33s all-intra trim (608 frames) — archive, do not serve
public/images/lambo-wash-full-start.jpg            poster + ARRIVAL comparison still
public/images/lambo-wash-full-trim-last.jpg        frame 607 — wet gloss black, near door flush (comparison)
public/video/lambo-wash-full-take1-trim.mp4        raw trim — DO NOT serve
public/video/lambo-wash-full-take1.mp4             original 30s take — hard cut at 25.33s, DO NOT serve
public/video/lambo-wash-full-scrub-take1.mp4       30s all-intra — includes the hard cut, DO NOT serve
public/images/lambo-wash-full-hold-take1.jpg       from the discarded 30s tail — DO NOT use
public/images/lambo-wash-full-last-take1.jpg       from the discarded 30s tail — DO NOT use

public/video/lambo-wash-01.mp4         raw owner clip (5.04s, 24fps, 1280x720, 1 keyframe — DO NOT serve this)
public/video/lambo-wash-01-scrub.mp4   all-intra re-encode — former hero, keep on disk, no longer served
public/images/lambo-wash-01-first.jpg  first frame still — poster image / "before" fallback
public/images/lambo-wash-01-last.jpg   last frame still — "after" fallback until the remainder’s
                                        front hold exists (see docs/FILM_PIPELINE.md §5)
public/video/lambo-wash-02-rinse.mp4   signed clip 2 raw — DO NOT serve
public/video/lambo-wash-02-rinse-scrub.mp4  signed clip 2 all-intra — not wired
public/images/lambo-wash-02-last.jpg   clip 2 last frame — remainder start_image
public/video/lambo-wash-03-remainder-take1.mp4  remainder take 1 raw — UNSIGNED archive, do not serve
public/video/lambo-wash-03-remainder-scrub-take1.mp4  take 1 all-intra — unsigned archive
public/video/lambo-wash-03-remainder-take2.mp4  remainder take 2 raw — UNSIGNED current reference, do not serve
public/video/lambo-wash-03-remainder-scrub-take2.mp4  take 2 all-intra — unsigned
public/images/lambo-wash-03-hold-take2.jpg      take 2 front portrait — comparison still (unsigned)
public/images/lambo-wash-03-last-take2.jpg      take 2 last frame — overhead, car already gone
```

- Never invent a media path. If the current `FILM.scrub` / `FILM.scrubDesktop` files are missing, `<CinematicStage>` must fall
  back to the still frames, and if those are missing too, render a clearly-labeled placeholder — same
  rule as v1/v2, unchanged.
- Generated continuation is specified in `docs/FILM_PIPELINE.md` §5 and `docs/REMAINDER_BRIEF.md`:
  clip 2 signed / not wired; remainder take 2 unsigned (designer said all right; two tweaks next).
  Do not fake rinse, interior, or front-reveal frames on the site. The comparison is the trim's own
  first and last frames, labelled ARRIVAL / RINSED, DOOR CLOSED — never "after", "spotless",
  "finished" or "clean reveal", because the last frame is a wet car, not a dried one.

---

## 7. Tech Stack

- **Next.js (App Router) + TypeScript + Tailwind** — app + layout + type.
- **GSAP + ScrollTrigger** — pin the stage, map scroll → damped progress (0..1).
- **`<video>` scrub (primary)** — all-intra MP4, `video.currentTime = progress * duration`.
  v3.1: at most one seek in flight (see `docs/QUALITY_AND_PERF.md` §5 P1), and the resolution
  variant is chosen once at mount inside `VideoScrubber` — never swapped mid-session, because
  changing `src` resets `currentTime` and drops the playhead.
- **Canvas 2D frame-sequence (fallback only)** — kept as a documented escape hatch, not the default.
- Overlay layer — one section label + the trust-panel headline, driven by the same progress value.
- **No backend.** CTA links out (phone / Instagram DM / Calendly / Square — owner's existing
  channel — `[BRAND]` and the actual link are placeholders until the owner supplies them).

Keep media logic isolated behind a `<CinematicStage>` so the source (video now, denser video or R3F
later) can be swapped without touching the rest of the site.

---

## 8. Project Structure

```
app/
  layout.tsx  page.tsx  globals.css
  components/
    Navigation.tsx  ScrollProgress.tsx  CtaSection.tsx  TrustPanel.tsx  BeforeAfter.tsx
    experience/  CinematicStage.tsx  VideoScrubber.tsx  FrameScrubber.tsx(fallback)  SceneOverlay.tsx  LoadingScreen.tsx
lib/
  scene/sceneTimeline.ts     # phase/station timing — single source
  animation/easing.ts
  utils/useScrollProgress.ts
public/
  video/                     # lambo-wash-01.mp4 + -scrub.mp4
  images/                    # stills, reference, logo
```

---

## 9. Toolchain (who does what)

| Tool | Role |
|---|---|
| **Claude** (this) | Architect. Owns this brief + the docs + the Cursor prompt. Can scaffold. |
| **Higgsfield (`generate_video`, `seedance_2_5`)** | Generates the **remainder** as one video, chained off `lambo-wash-02-last.jpg`. See `docs/FILM_PIPELINE.md` §5 and `docs/REMAINDER_BRIEF.md`. Do not regenerate clip 1 or signed clip 2. Take 2 is unsigned. |
| **Cursor** *or* **Google Antigravity** | The builder IDE. ONE agent scaffolds and edits the Next.js app from `docs/CURSOR_REBUILD_PROMPT.md`. They are substitutes — pick one primary. **Cursor is the chosen primary.** |

**Available to any agent working this repo (all connected & verified 2026-09-08):**
`gsap-skills` plugin (ScrollTrigger/pinning/timeline/performance guidance) · Magic UI MCP · 21st Magic MCP · Figma MCP (read-only, View seat) · Vercel MCP (deploy).

See `SETUP.md` for environment status (already verified, nothing to redo).

---

## 10. Engineering Rules

1. Read this file before building. 2. Keep the timeline centralized (never hard-code scene % across components). 3. Keep the media source behind `CinematicStage`. 4. Missing media → labeled placeholder, never a fake claim. 5. Small targeted edits; no unrequested dependencies. 6. Fix TS/lint immediately; verify the site actually runs. 7. Preserve the art direction — never silently swap it for a generic look. 8. Ship the core scroll experience before any extra feature. 9. **Scroll axis is VERTICAL** (v3 — do not build the old horizontal mapping). 10. **Clip 1 camera never moves.** Do not add pan/zoom/parallax to the owner clip. Clip 2 is signed
    and also frozen. The remainder is a **drone path** (`docs/REMAINDER_BRIEF.md`) — no fur
    interior, no rear-jerk, no parked freeze, no empty coverage.

**Added in v3.1 (2026-09-08 night):**

11. **Performance is a shipping gate, not polish.** The budget in `docs/QUALITY_AND_PERF.md` §4 is
    binding on mobile and desktop alike, and the known glitch risks in §5 are located defects to
    fix — not speculative cleanups.
12. **Never overwrite a media file.** Every re-encode or upres lands on a new filename, and the old
    file stays on disk until the replacement is verified and signed.
13. **Never hand the upres to mobile.** A phone letterboxes the 16:9 film and is width-constrained,
    so 1280px already exceeds what it can resolve (`docs/QUALITY_AND_PERF.md` §1). More bytes there
    buy zero pixels and risk the tab being reaped.
14. **Preflight every paid generation.** `get_cost: true`, show the owner the number, wait for a
    typed **GO**. Say so *before* uploading footage to an external service, not after.
15. **Never GSAP-pin an ancestor of `<video>`.** iOS Safari composites the decode surface black
    inside any transformed parent. Film = `.film-stage` (fixed, no transform) + empty runway.

---

## 11. Definition of Done — Rough Draft

1. `npm run dev` runs clean. 2. Page pins and vertically scroll-scrubs the served all-intra trim (`lambo-wash-full-scrub-take1-trim.mp4`, or its verified v3.1 re-cut) smoothly, forward and backward, with no stutter. 3. Placeholder renders correctly with zero media present. 4. Dropping a real second clip upgrades the experience with no code change beyond the timeline config. 5. Trust panel and before/after sections render below the released scroll. 6. Hero matches the reference clip framing (static, side profile, driveway). 7. Ends in a premium BOOK CTA that links out. 8. Mobile scrolls and scrubs. 9. No SaaS look, no invented assets, no claim the car is "clean" when the only footage shown is dirty→foamed.

**Added in v3.1:** 10. Desktop gets the upres variant and mobile gets 720p — verified by watching which file is actually requested under iPhone-class emulation. 11. No frame over 16.7 ms sustained while scrubbing on either path, with the CPU throttled 4×. 12. At most one video seek in flight at any moment. 13. The booking composer composes a visible message and hands off to a single placeholder link constant. 14. `prefers-reduced-motion` is honored by every section, not just the scroll hook.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
