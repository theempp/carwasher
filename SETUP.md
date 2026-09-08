# SETUP — Build the Site with Cursor + Nano Banana Pro 2

> ⚠️ **PARTIALLY SUPERSEDED 2026-09-08 (v3).** Section 1 (environment) is still accurate and
> unchanged. Sections 2–3 describe the v1 manual Nano-Banana-stills pipeline, which is no longer how
> this site is built — the hero is now a real supplied video clip, already in the repo at
> `public/video/lambo-wash-01-scrub.mp4`. **For the current build step, use
> `docs/CURSOR_REBUILD_PROMPT.md` instead of §3 below.** Sections 4–6 (verify/deploy/upgrade paths)
> still apply generally.

Read this with `claude.md` (the master brief). This is the *how*. Short and in order.

**Backend setup status: ✅ COMPLETE (verified 2026-09-08).** Section 1 is done. Start at Section 2.

---

## 0. The honest picture (read once)

Three jobs, three tools. Don't overcomplicate it:

- **Claude** wrote the plan (`claude.md`) and the one-shot kickoff prompt (`KICKOFF_PROMPT.md`), and set up the toolchain. Done.
- **Nano Banana Pro 2** = your image/frame factory. It makes the *pictures* of the car through the wash. It does **not** make video, and it does **not** write the website. Its superpower here: it keeps the SAME car consistent across every frame — exactly what an image-sequence needs.
- **Cursor** = the builder. An AI IDE agent that scaffolds and edits the Next.js app.

> The website is NOT a video. It's a numbered pile of still frames that a canvas flips through as you scroll (how Apple does it). That's why an image model is enough for a great rough draft.

**Primary builder: Cursor.** (Google Antigravity does the same job — pick ONE. Running both agents on the same repo creates conflicts.)

---

## 1. Environment — ✅ ALL VERIFIED, NOTHING TO DO

| Thing | Status |
|---|---|
| Node.js v26.8.1 / npm 11.19.0 | ✅ installed (Homebrew) |
| Git 2.55.0 | ✅ installed |
| `gsap-skills` plugin (user scope) | ✅ enabled — core, scrolltrigger, timeline, plugins, react, performance, utils |
| Magic UI MCP (`magic`, user scope) | ✅ connected — no key needed |
| 21st Magic MCP (`21st`, user scope) | ✅ connected — HTTP, keyed |
| Figma MCP | ✅ connected, signed in as enzo marin |
| Vercel MCP | ✅ connected (for the deploy in §5) |
| `public/frames/` | ✅ created, ready for drops |
| Cursor | ⬜ **YOU** — see §3 |

**Figma caveat:** the seat is **View** on "enzo marin's team" (starter tier). Reading/inspecting Figma designs works; writing designs *back into* Figma may be refused. Not a blocker for this build.

**Nano Banana Pro 2 access — MANUAL path (chosen).** Use the Google **Gemini app** or **AI Studio** (aistudio.google.com), select the Nano Banana Pro / Gemini 3 Pro Image model. **No API key, no `.env.local`, nothing to configure.**

---

## 2. Make the frames (Nano Banana Pro 2)

Goal for the rough draft: **~12 frames**, one per beat, SAME Mineral Grey F80 M3 every time.
Drop them in **`public/frames/`** — the folder already exists and documents the naming rule.

1. Open the reference `Photo Sep 07 2026, 10 17 30 PM.jpg`, and generate **frame 1** with this seed prompt:

   > "Cinematic automotive commercial still. A Mineral Grey Metallic BMW F80 M3, front three-quarter view, inside a dark professional wash bay. Overhead rinse water falling, amber backlight curtain behind the car, wet reflective concrete floor, dramatic controlled lighting, realistic, photographic, 16:9. The car is wet and dirty, not yet washed."

2. Then **edit that same image** step by step to make each later frame — this is where Nano Banana Pro 2 wins, because it keeps the car identical:
   - foam sprayed on the wheels → foam on rims rinsing off
   - full car covered in white foam
   - pressure rinse, foam running off, paint reflective
   - front three-quarter, all doors open, floor mats out
   - interior mid-detail (clean seats/dash, no person visible)
   - clean car, doors shut, glossy front reveal
   - rear three-quarter, car driving away, motion in the water
   - car small, driving toward a bright soft-cloud opening

3. Download each as `frame-0001.jpg … frame-0012.jpg`. **Zero-padded, uniform dimensions, 16:9.** Drop into `public/frames/`.

*You can start building BEFORE the frames exist — the site renders labeled placeholders until you add them.*

---

## 3. Build the site (Cursor) — ONE prompt

> ⚠️ Superseded — see the banner at the top of this file. Use `docs/CURSOR_REBUILD_PROMPT.md`.

1. Cursor → **File › Open Folder** → `/Users/zozo/Desktop/AndrewWebsite`
2. Press **Cmd+I** to open Composer, set the mode to **Agent**
3. In the model picker, choose a **Claude** model (Sonnet 4.5 or Opus)
4. Open `docs/CURSOR_REBUILD_PROMPT.md`, copy the fenced prompt block under "THE PROMPT", **paste, send once**
5. It builds against the existing scaffold (Next.js/TS/Tailwind/GSAP already installed) and the
   video already in `public/video/`.
6. Open `http://localhost:3000` and scroll.

---

## 4. Verify & iterate

- Scroll top → bottom: frames should scrub smoothly, labels fade per scene.
- With zero frames: clean placeholders with scene names (proves the machine works).
- Add real frames → refresh → same code, real film.
- Follow-up prompts stay tiny: *"tighten the hero hold to 0–18%,"* *"make the reveal label bigger,"* *"add more frames to the interior scene."*

---

## 5. Deploy (later)

Push to GitHub → import to **Vercel** → live URL. The Vercel MCP is already connected, so you can just ask Claude to do this when the draft is good.

---

## 6. Upgrade paths (after the draft is good)

- **Denser film:** generate 24–60 frames per scene, or render a real clip and explode it to frames with ffmpeg.
- **Real-time 3D:** the original `docs/ORIGINAL_BRIEF.md` Spline → React Three Fiber path, swapped in behind `CinematicStage`.
- **Automated frames:** switch to the Gemini image API and call it from a script instead of the manual app. *(Would need a `GEMINI_API_KEY` in `.env.local` — already covered by `.gitignore`.)*
