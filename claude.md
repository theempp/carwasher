# Luxury Auto Detailing — Cinematic Scroll Website (Master Brief)

> Canonical source of truth. Every tool (Claude, Cursor, Google Antigravity) reads THIS file first.
> The original long-form vision is preserved at `docs/ORIGINAL_BRIEF.md`.

> ⚠️ **UPDATE 2026-09-08 — film direction & site look RE-LOCKED.** The film is now ONE seamless
> **continuous take** with **HORIZONTAL scroll** (car drives right, dirty→spotless), moody/cinematic,
> built as **chained video segments** — see `docs/FILM_PIPELINE.md` (authoritative for the film).
> This supersedes the "12 stills / vertical frame-by-frame / 8-scene cut" framing and the
> vertical `sceneTimeline` below. The **site is also being re-designed** (new font, new colors, new
> look); the palette/typography in §4 will be replaced once the owner confirms the new direction.

---

## 1. Concept (one line)

A scroll-controlled cinematic film of one car being detailed — **dirty → wash → foam → rinse → interior → clean reveal → drive away → sky → BOOK** — where scrolling scrubs the film frame by frame. The car is the character. Scroll is the timeline. The detailing process is the navigation.

The user should feel: *"I'm moving through the detail,"* not *"I'm scrolling a website."*

It must NOT look like a SaaS landing page, template, or generic detailing business site.

---

## 2. Architecture Decision (LOCKED)

**Image-sequence scroll scrub** — the exact technique Apple uses for its product pages.

- The "film" is a **numbered sequence of still frames** (`frame-0001.jpg …`).
- A `<canvas>` draws frame `N`, where `N = f(scrollProgress)`.
- Scrolling forward/back scrubs the sequence. No autoplay, no video codec seeking jank.
- One pinned tall scroll container drives the whole thing via **GSAP ScrollTrigger**.

Why this and NOT real-time 3D (Spline/R3F): faster to a great result, trivially smooth scrubbing, art-directed pixel quality from an image model, no WebGL performance risk on mobile. Real-time 3D (the original `docs/ORIGINAL_BRIEF.md` path) is a **Phase 2 upgrade**, not the first draft.

Why frames and NOT a `<video>`: frame-accurate scrubbing on all browsers, no decode stalls, easy to swap/extend per scene.

**Rough draft** = ~10–16 keyframes (one per scene + transitions), crossfaded/scrubbed — proves the mechanic + art direction.
**Production** = dense per-scene sequences (24–60 frames each) or a rendered clip exploded to frames.

---

## 3. The Car

**BMW F80 M3 — Mineral Grey Metallic.**

Rationale: mid-grey is the only value that *holds specular highlights*, and the whole payoff is dull → reflective. Black reads reflections as noise (reveal lands as nothing); white blows out under the amber backlight. Mineral Grey sits in the reference photo's tonal family, stays inside the black/white/grey/navy foundation, and frees the single electric accent for typography instead of spending it on paint.

Reference composition: `Photo Sep 07 2026, 10 17 30 PM.jpg` — dark wash bay, front three-quarter, overhead rinse falling, amber backlight curtain, wet reflective floor.

---

## 4. Art Direction

**Palette:** black · white · soft gray · deep navy · ONE restrained electric accent (used only for type/UI, never the car).

**Typography:** oversized editorial display headlines; small technical/mono labels; wide tracking; minimal body copy; high contrast; type integrated INTO the scene, never covering the car.

**UI (only what's necessary):** logo · minimal nav · thin scroll progress indicator · CTA · scene labels.

**Forbidden:** SaaS gradients · glassmorphism · card grids · rounded-everything · sci-fi portals · game-like visuals · visible human detailer · clutter · decorative motion with no purpose.

Motion: restrained. fade / translate / scale / clip-reveal / overlap. No bounce, no random parallax, no generic scroll-reveals everywhere.

---

## 5. Scroll Timeline (centralized, tunable)

Percentages are starting values, tuned in ONE place: `lib/scene/sceneTimeline.ts`.

```
0.00–0.15  hero          dirty/wet car, reference three-quarter, hold
0.15–0.35  wheel-clean   foam onto rims → coverage → rinse clean
0.35–0.55  exterior-wash spray → full foam → pressure rinse → reflective paint
0.55–0.65  interior-reveal camera to front, doors open, mats fly out
0.65–0.85  interior-detail vacuum, wipe seats/dash/doors (nobody visible)
0.85–0.90  clean-reveal  reassemble; FRONT camera arrives as interior finishes (the payoff)
0.90–0.97  departure     camera to rear, car drives away
0.97–1.00  sky-transition bright cloud opening; car vanishes → BOOKING CTA
```

```ts
export const sceneTimeline = [
  { start: 0.00, end: 0.15, scene: "hero",           label: "THE ARRIVAL" },
  { start: 0.15, end: 0.35, scene: "wheel-clean",    label: "THE WHEELS" },
  { start: 0.35, end: 0.55, scene: "exterior-wash",  label: "THE WASH" },
  { start: 0.55, end: 0.65, scene: "interior-reveal",label: "OPEN UP" },
  { start: 0.65, end: 0.85, scene: "interior-detail",label: "THE INTERIOR" },
  { start: 0.85, end: 0.90, scene: "clean-reveal",   label: "THE REVEAL" },
  { start: 0.90, end: 0.97, scene: "departure",      label: "DRIVE AWAY" },
  { start: 0.97, end: 1.00, scene: "sky-transition", label: "BOOK YOUR DETAIL" },
];
```

---

## 6. Frame Assets

```
public/frames/frame-0001.jpg  (dirty hero)
public/frames/frame-0002.jpg
...                            (one per scene/transition for the rough draft)
```

- Zero-padded, sequential, one folder, uniform dimensions, 16:9 (or 21:9 hero).
- Generated by **Nano Banana Pro 2** with the SAME car held consistent across every frame.
- Never invent a frame path. If frames are missing, the scrubber renders a clearly-labeled placeholder gradient with the scene label so the whole site is testable before art lands.

---

## 7. Tech Stack

- **Next.js (App Router) + TypeScript + Tailwind** — app + layout + type.
- **GSAP + ScrollTrigger** — pin the stage, map scroll → progress (0..1).
- **Canvas 2D frame scrubber** — preload frames, draw `frames[index]`, `index = round(progress * (N-1))`.
- Overlay layer — editorial type per scene, driven by the same progress value.
- **No backend.** CTA links out (phone / Instagram DM / Calendly / Square — Andrew's existing channel).

Keep 3D/media logic isolated behind a `<CinematicStage>` so the film source (frames now, video or R3F later) can be swapped without touching the rest of the site.

---

## 8. Project Structure

```
app/
  layout.tsx  page.tsx  globals.css
  components/
    Navigation.tsx  ScrollProgress.tsx  CtaSection.tsx
    experience/  CinematicStage.tsx  FrameScrubber.tsx  SceneOverlay.tsx  LoadingScreen.tsx
lib/
  scene/sceneTimeline.ts     # the timeline above (single source)
  animation/easing.ts
  utils/useScrollProgress.ts
public/
  frames/                    # generated frames
  images/                    # reference, logo
```

---

## 9. Toolchain (who does what)

| Tool | Role |
|---|---|
| **Claude** (this) | Architect. Owns this brief + the kickoff prompt. Can scaffold. |
| **Nano Banana Pro 2** (Gemini 3 Pro Image) | Frame factory. Generates the hero + every scene keyframe with a consistent Mineral Grey F80 M3. Stills only — it is NOT a video model. |
| **Cursor** *or* **Google Antigravity** | The builder IDE. ONE agent scaffolds and edits the Next.js app from the kickoff prompt. They are substitutes — pick one primary. **Cursor is the chosen primary.** |

**Available to any agent working this repo (all connected & verified 2026-09-08):**
`gsap-skills` plugin (ScrollTrigger/pinning/timeline/performance guidance) · Magic UI MCP · 21st Magic MCP · Figma MCP (read-only, View seat) · Vercel MCP (deploy).

**Frame pipeline is MANUAL** — Nano Banana Pro 2 via the Gemini app / AI Studio. No API key, no `.env.local`. Frames land in `public/frames/`.

See `SETUP.md` for the exact step-by-step and the one paste-in prompt.

---

## 10. Engineering Rules

1. Read this file before building. 2. Keep the timeline centralized (never hard-code scene % across components). 3. Keep the film source behind `CinematicStage`. 4. Missing frames → labeled placeholder, never a fake claim. 5. Small targeted edits; no unrequested dependencies. 6. Fix TS/lint immediately; verify the site actually runs. 7. Preserve the art direction — never silently swap it for a generic look. 8. Ship the core scroll experience before any extra feature.

---

## 11. Definition of Done — Rough Draft

1. `npm run dev` runs clean. 2. Page pins and scroll scrubs the frame sequence smoothly. 3. Placeholder renders correctly with zero frames present. 4. Dropping real frames into `public/frames/` upgrades it with no code change. 5. Editorial scene labels fade in/out on the same progress. 6. Hero matches the reference three-quarter. 7. Ends in a premium BOOK CTA that links out. 8. Mobile scrolls and scrubs (reduced frame count ok). 9. No SaaS look, no invented assets.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
