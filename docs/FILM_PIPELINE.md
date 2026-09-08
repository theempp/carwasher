# Film Pipeline — Cinematic Wash Film (SOURCE OF TRUTH for the video build)

> Read this FIRST, then `CLAUDE.md`. This file is the handoff for building the wash film as
> **one seamless, continuous, horizontally-scrubbed take**.
> Last updated: 2026-09-08. **Direction re-locked with the owner (Enzo) on 2026-09-08.**

---

## 1. LOCKED DIRECTION (user-approved 2026-09-08 — supersedes the old 8-scene cut)

The film is **ONE continuous take**, not a set of separate scenes that cut/crossfade. A single
Mineral Grey BMW drives **forward to the right** through a moody, cinematic automatic wash tunnel.
As the user scrolls, they scrub along that one unbroken journey:

- **Scroll is HORIZONTAL.** The page scrolls **right**, not down. Scroll-right = the car advancing
  through the wash.
- **Left = dirty, right = spotless.** Start of scroll: dull, dirty, wet car arriving. End of scroll:
  flawless mirror finish driving off into bright light (the BOOK CTA end card).
- **Camera glides in one continuous move** — it orbits/glides around the car as it travels right,
  pushes IN for detail beats (wheel, foam), and at the open-door side eases INTO the cabin to show a
  clean interior up close, then eases back OUT and keeps gliding. **No hard cuts. The car never stops
  and never "resets."**
- **Look: cinematic & moody.** Deep shadows, restrained/controlled pops of colored light, glossy
  reflections. NOT the bright, saturated "retail car wash" look. (The colorful Scene-2 test clip is
  **superseded** — see Progress.)
- **Camera language: mix, guided by the beat** — wide travelling glides for the big wash moments,
  tighter push-ins for details — but all as ONE flowing camera move.

**Why this changed:** the old approach generated separate clips each anchored to the SAME dirty
reference, so the car "reset" at every scene boundary — that reset felt like cutting between pages.
The owner wants one car, one continuous story, revealed by scroll.

---

## 2. Production method — CHAINED SEGMENTS (locked)

Generate the journey as **3 segments of 10 s** (re-locked 2026-09-08, see §4) where **each segment
starts on the EXACT last frame of the previous segment**. Because the car is mid-motion and mid-transformation at every hand-off, the
stitched result reads as one unbroken take — no seam, no reset.

Per-segment loop:
1. Generate segment N (**10 s**) with `start_image` = the hand-off frame.
   - Segment 1's `start_image` = the anchor image (dirty car, below).
   - Segment N's (N≥2) `start_image` = the **last frame of segment N−1**, extracted with ffmpeg and
     re-uploaded via `media_upload` / `media_import_url` to get a fresh media_id.
2. Poll `jobs_wait`, download the mp4 into `public/video/`.
3. Extract its last frame: `ffmpeg -sseof -0.05 -i seg-0N.mp4 -frames:v 1 -q:v 2 seg-0N-last.jpg`
   (grab a frame ~50 ms before the end), upload it, feed as the next segment's `start_image`.
4. Show the owner each segment for approval before spending on the next.

At the end, concatenate all segments into `public/video/film-master.mp4` (section 5). Because
segments are already continuous, a plain concat needs **no crossfades** — the joins are invisible.

> `ffmpeg` is **installed and verified** (v9.0.1, via `brew install ffmpeg`, 2026-09-08).

---

## 3. The proven generation recipe (produced the approved hero clip)

- **Tool:** Higgsfield MCP → `generate_video` (server id begins `229e641b…`).
- **Model:** `seedance_2_5` (image-to-video).
- **mode:** `omni_reference`
- **medias:** one entry, `{ "role": "start_image", "value": "<media_id>" }` — locks the clip's FIRST
  frame (anchor for seg 1; previous segment's last frame for seg 2+).
- **resolution:** `720p` (owner chose 720p to control cost; `1080p` fine for finals).
- **aspect_ratio:** `16:9`.
- **duration:** `10` seconds per segment (**re-locked 2026-09-08**; range 4–30). Preflight the 10 s
  cost — the ~32.5 cr figure was measured at 5 s and linearity is unconfirmed.
- **generate_audio:** `false` (scrubbed on scroll — audio is wasted cost).
- **Decline the preset nudge:** decline **"IN THE DARK"** (id
  `24bae836-2c4a-48e0-89b6-49fcc0b21612`) via `declined_preset_id`. It hijacks the art direction.
- **Billing:** spends **credits** (no free unlim on this model). 5 s @ 720p preflighted at
  **~32.5 credits**. ALWAYS preflight with `get_cost: true` and confirm the spend with the owner
  before generating. Pass `use_unlim: false`.

### Anchor image (segment 1 only)
- **media_id:** `3de63af0-a9e9-4040-8d44-648f1d6ee608`
- Filename: `Photo Sep 07 2026, 10 17 30 PM.jpg` (repo root) — Mineral Grey BMW in a dark wash bay,
  side profile **facing right**, overhead water curtain, moody backlight, wet reflective floor.
- Only segment 1 uses this. Every later segment chains off the previous segment's last frame, which
  keeps the car & lighting consistent automatically.

### Poll & fetch pattern
1. `generate_video` returns a job with `status: pending`.
2. Long-poll `jobs_wait` (timeout 15 s) until `completed` — a 5 s clip took ~3 min, so budget longer
   for 10 s.
3. Grab `result_url` (CloudFront .mp4). Download into `public/video/`.

---

## 4. Segment storyboard (RE-LOCKED 2026-09-08 — **3 segments x 10s**)

> **Changed from 6x5s to 3x10s on owner approval.** Rationale: every hand-off regenerates from a
> *still*, which discards motion vector — the model cannot know how fast the car was travelling, so
> velocity can jump at each join. 6 segments = 5 chances to stutter; 3 segments = 2.
> Credits are ~the same either way (5s @720p preflighted ~32.5cr, so 3x10s ~= 6x5s ~= 195cr **if
> pricing is linear — NOT yet confirmed, preflight before firing**). 10s beats 15s because longer
> generations drift more within a clip and a failed 15s is a 3x more expensive redo.

All segments: Mineral Grey BMW, moody cinematic wash tunnel, car moving right, one continuous glide,
no people, no cuts.

| # | Beats covered | Continuous camera move | Car state | Hand-off (last frame ->) |
|---|---|---|---|---|
| 1 | Arrival + wheels/first foam | Wide slow glide in from front 3/4 as the car rolls in from the left, then down & tighter to the front wheel; foam applicator sweeps | Dirty/wet -> foam starting | camera rising as foam spreads |
| 2 | Full foam + rinse | Rise back to a wide side 3/4, machinery sweeps the paint, then orbit toward rear 3/4 as jets sheet the foam off | Fully foamed -> glossy Mineral Grey emerging | paint mostly clean, wet, reflective |
| 3 | Interior glimpse + reveal/drive away | Orbit to the open-door side, ease IN to the clean cabin, ease back OUT, final hero glide as the car drives out into bright soft light | Clean -> flawless mirror finish | car exiting into light -> BOOK CTA end card |

**Motion phrasing for the prompts** must follow `docs/SCROLL_MECHANICS.md` §3 — one unbroken
gliding move, no cuts, no reset, continuous forward travel to the right.

---

## 5. Progress

| # | Segment | Status | File / Job |
|---|---|---|---|
| — | Old hero (8 s drive-through) | ✅ exists, may be reused/re-cut as seg 1 source | `public/video/wash-hero.mp4` · job `dedc2d88-9eda-4638-bbbd-445cef3ab99d` |
| — | Old Scene-2 colorful wheels test | ⚠️ SUPERSEDED (wrong look/method — do not use) | `public/video/scene-02-wheels.mp4` · job `9b0acd19-b578-48e6-afaf-4ffb9acfbc19` |
| — | All-intra scrub encode of hero | ✅ done — proves the seek fix | `public/video/wash-hero-scrub.mp4` |
| 1 | Arrival + wheels/first foam (10s) | ⬜ to generate — **awaiting owner "go"** | |
| 2 | Full foam + rinse (10s) | ⬜ chained | |
| 3 | Interior + reveal/drive away (10s) | ⬜ chained | |

Save each new segment as `public/video/seg-0N-<name>.mp4` and update this table.

**Credits: ZERO spent as of 2026-09-08.** No generation has been fired. Preflight `get_cost: true`
for a **10s** clip first — the 32.5cr figure is measured at 5s and linearity is unconfirmed.

---

## 6. Assembling the film ("put the film together")

`ffmpeg` required (`brew install ffmpeg`). Since chained segments are already continuous, concat with
NO crossfade:
```bash
cd public/video
printf "file 'seg-01-arrival.mp4'\nfile 'seg-02-foam-rinse.mp4'\nfile 'seg-03-reveal.mp4'\n" > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c:v libx264 -pix_fmt yuv420p -crf 18 film-master.mp4
```

### ⚠️ REQUIRED: all-intra encode for scrubbing

`video.currentTime` seeking snaps to the nearest keyframe. `wash-hero.mp4` was measured with
**exactly 1 keyframe across 193 frames** — every seek decoded from frame zero, which makes scrubbing
unusable. The master MUST be re-encoded with every frame a keyframe:

```bash
ffmpeg -i film-master.mp4 -c:v libx264 -g 1 -preset veryfast -crf 20 \
       -pix_fmt yuv420p -an film-master-scrub.mp4
```

Measured cost on the hero clip: 3.3MB -> 6.2MB, **1.9x size for instant seeking.** Non-negotiable.
Serve `film-master-scrub.mp4` to the site, not `film-master.mp4`.

**Wire into the site.** Keep the film source behind `CinematicStage` (CLAUDE.md rule 3). The scroll is
HORIZONTAL — map scroll-x progress (0..1) to `video.currentTime = progress * duration` on the
`film-master.mp4`, or explode to frames and scrub the canvas:
`ffmpeg -i film-master.mp4 -vf fps=30 public/frames/frame-%04d.jpg` (back up any existing frames
first). **Cursor is the primary builder for site code** unless the owner asks Claude to edit directly.

> NOTE: The website is being **re-designed** (new font, new colors, new look) — see the kickoff
> prompt. The old art direction in `CLAUDE.md` (§4) is being replaced; confirm the new palette/type
> before rebuilding.

---

## 7. Guardrails
- Preflight every generation (`get_cost: true`) and confirm the credit spend before firing.
- Decline the "IN THE DARK" preset every time.
- Chain off the previous segment's last frame (seg 2+) — that is what keeps the take seamless.
- Look is cinematic & moody, not bright/colorful.
- Show the owner each segment before spending on the next.
- Missing frames → the site already renders labeled placeholders (don't fake assets).
