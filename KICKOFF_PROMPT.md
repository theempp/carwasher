# KICKOFF PROMPT — paste this once into Cursor/Antigravity agent (or a new Claude chat)

---

You are the lead engineer building a premium, cinematic, scroll-scrubbed website for a luxury car-detailing business. Work in this repo. **Read `claude.md` fully before writing anything** — it is the source of truth. Also skim `SETUP.md`.

Build the complete ROUGH DRAFT in one autonomous pass, then report. Do not ask me questions unless something is genuinely blocking.

CORE MECHANIC: this is NOT a video and NOT real-time 3D. It is an Apple-style image-sequence scroll scrub — a `<canvas>` draws frame N of a numbered still sequence, where N is a function of scroll progress, inside one pinned tall scroll container driven by GSAP ScrollTrigger.

STACK: Next.js (App Router) + TypeScript + Tailwind + GSAP/ScrollTrigger. No backend.

BUILD THIS:
1. `create-next-app` (TS, Tailwind, App Router, no src dir) if the app isn't scaffolded yet. Install `gsap`.
2. `lib/scene/sceneTimeline.ts` — export the exact `sceneTimeline` array from `claude.md` §5 as the single source of scene timing/labels.
3. `lib/utils/useScrollProgress.ts` — hook returning normalized scroll progress 0..1.
4. `app/components/experience/FrameScrubber.tsx` — preloads `/frames/frame-0001.jpg`… up to a configurable count; draws the frame for the current progress to a full-bleed canvas (contain/cover, retina-aware, resize-safe). **If a frame is missing, draw a labeled placeholder** (dark gradient + current scene label from the timeline) so the site works with ZERO frames present.
5. `app/components/experience/SceneOverlay.tsx` — oversized editorial headline + small mono label per scene, fading/translating in and out based on the same progress (restrained motion only).
6. `app/components/experience/CinematicStage.tsx` — pins the stage, wires ScrollTrigger scrub, composes FrameScrubber + SceneOverlay. Keep the film source isolated here so it can be swapped later.
7. `app/components/Navigation.tsx` (logo + minimal nav) and `app/components/ScrollProgress.tsx` (thin progress bar).
8. `app/components/CtaSection.tsx` — final BOOK YOUR DETAIL screen with a placeholder outbound link (comment it clearly for me to fill in phone/Instagram/Calendly/Square).
9. `app/page.tsx` — assembles everything into the tall pinned scroll experience.
10. A minimal on-brand `LoadingScreen.tsx` while frames preload.

ART DIRECTION (from `claude.md` §4 — obey strictly): black / white / soft gray / deep navy + ONE restrained electric accent (type/UI only, never the car). Oversized editorial type, small mono labels, minimal UI. FORBIDDEN: SaaS gradients, glassmorphism, card grids, sci-fi portals, game-like visuals, clutter, bouncy/parallax noise. It must read like a luxury automotive film, not a SaaS landing page.

WHEN DONE:
1. Run `npm run dev` and confirm it compiles with no TS/lint errors.
2. Confirm: page pins, scroll scrubs, placeholders render with zero frames, labels fade per scene, CTA at the end.
3. Report concisely: files created, how to drop frames into `public/frames/`, and the one line where I paste my booking link. Do not add features beyond this draft.
