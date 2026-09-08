# SETUP — Build the Site with Claude + Cursor/Antigravity + Nano Banana Pro 2

Read this with `claude.md` (the master brief). This is the *how*. Short and in order.

---

## 0. The honest picture (read once)

Three jobs, three tools. Don't overcomplicate it:

- **Claude** wrote the plan (`claude.md`) and the one-shot kickoff prompt (below). Done.
- **Nano Banana Pro 2** = your image/frame factory. It makes the *pictures* of the car through the wash. It does **not** make video, and it does **not** write the website. Its superpower here: it keeps the SAME car consistent across every frame — that's exactly what an image-sequence needs.
- **Cursor OR Antigravity** = the builder. An AI IDE agent that scaffolds and edits the Next.js app. **They do the same job — pick ONE as primary.** Running both agents on the same repo at once just creates conflicts.

> The website is NOT a video. It's a numbered pile of still frames that a canvas flips through as you scroll (how Apple does it). That's why an image model is enough to get a great rough draft.

**Recommended primary:** Cursor (mature, Claude-native, applies precise diffs).
**Antigravity's edge:** its agent can open the running site in a browser and self-verify visually — great as the "does it actually look right?" second pass. Optional.

---

## 1. One-time installs

1. **Node.js** (LTS) + **Git** — `node -v` should print v18+.
2. **Cursor** — cursor.com. Sign in, set the model to a Claude model.
   *(or)* **Google Antigravity** — install, sign in with Google, it runs on Gemini 3.
3. **Nano Banana Pro 2 access** — Google **Gemini app** or **AI Studio** (aistudio.google.com). Select the Nano Banana Pro / Gemini 3 Pro Image model. No API key needed for the manual path.

---

## 2. Make the frames (Nano Banana Pro 2)

Goal for the rough draft: **~12 frames**, one per beat, SAME Mineral Grey F80 M3 every time.

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

3. Download each as `frame-0001.jpg … frame-0012.jpg` (uniform size). Drop them in `public/frames/`.

*You can start building BEFORE the frames exist — the site renders labeled placeholders until you add them.*

---

## 3. Build the site (Cursor or Antigravity) — ONE prompt

1. Open this folder (`AndrewWebsite`) in Cursor/Antigravity.
2. Open the agent panel (Cursor: Cmd-I / Composer in Agent mode).
3. Paste the **Kickoff Prompt** from `KICKOFF_PROMPT.md` (also printed in chat). Send it once.
4. Let the agent scaffold, build, and start the dev server. It reads `claude.md`, builds the scrubber, and reports.
5. Open `http://localhost:3000` and scroll.

---

## 4. Verify & iterate

- Scroll top → bottom: frames should scrub smoothly, labels fade per scene.
- With zero frames: you should see clean placeholders with scene names (proves the machine works).
- Add real frames → refresh → same code, real film.
- Follow-up prompts stay tiny: *"tighten the hero hold to 0–18%,"* *"make the reveal label bigger,"* *"add more frames to the interior scene."*

---

## 5. Deploy (later)

- `git init` → push to GitHub → import to **Vercel** → live URL. (Ask Claude to do this when you're ready.)

---

## 6. Upgrade paths (after the draft is good)

- **Denser film:** generate 24–60 frames per scene, or render a real clip and explode it to frames with ffmpeg.
- **Real-time 3D:** the original `docs/ORIGINAL_BRIEF.md` Spline → React Three Fiber path, swapped in behind `CinematicStage`.
- **Automated frames:** call the Gemini image API from a script instead of the manual app.
