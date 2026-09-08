# Film Pipeline — Driveway Wash Clip (SOURCE OF TRUTH for the video build, v3)

> Read this FIRST, then `claude.md`. Last updated: 2026-09-08 (clip 2 signed). **Direction re-locked
> with the owner (Enzo) on 2026-09-08 from a real owner-supplied clip — supersedes the v2
> wash-bay/BMW/horizontal chained-segment plan entirely.**
>
> **Designer lock:** wax is dead. Nose-orbit → front-hold is dead. Clip 2 (frozen rinse) is
> **signed**. Remaining beats (old clips 3–5) collapse into **ONE remainder video** — see **§5**.
> Generation recipe: **§4**. Do not generate until the owner types GO. Do not wire anything past
> clip 1 until they say so. Do not regenerate clip 1 or clip 2.

---

## 1. LOCKED DIRECTION (v3 — supersedes the old wash-bay continuous-take plan)

The site hero **today** is **ONE static, locked-off camera shot** (clip 1) — that camera never pans,
orbits, or pushes in. A gloss-black **Lamborghini Huracán** sits side-profile on a sunlit estate
driveway; a hose sprays in from top-left and foam builds across the paint. As the user scrolls, they
scrub along that clip's timeline. Clip 2 is signed (not wired). The remainder is §5.

- **Scroll is VERTICAL** (changed back from v2's horizontal experiment). Scroll down = the clip
  advances; scroll up = it runs in reverse.
- **Clip 1 start = clean gloss black arrival. Clip 1 end = full foam coverage.** That is what the
  site serves today. Clip 2 (signed, not wired) is the frozen rinse. The rest of the dirty→spotless
  + interior arc is **one remainder video** in §5 — not generated yet.
- **Clip 1 camera does not move at all.** Clip 2 camera does not move either (signed). Motion starts
  in the remainder video, only on the motivated path in §5 — never empty coverage, never a
  nose-orbit, never a tight cabin dive.
- **Look: full colour, golden hour, warm.** NOT desaturated, NOT moody/dark. This is the opposite
  grade from v2's wash-bay look — see `docs/DESIGN_DIRECTION.md`.

**Why this changed again:** v2 was built around a wash-bay reference photo and a horizontal
continuous-glide concept that was never shot or generated. The owner has now supplied an actual clip
(`LamboWash1.mp4`, renamed `lambo-wash-01.mp4` in this repo) that is a completely different setting,
car, camera style, and grade. Building against real footage beats building against an unproduced plan — this doc describes clip 1
as it exists, plus signed clip 2 and the one remainder video specified in §5.

---

## 2. What exists right now

| File | Description |
|---|---|
| `public/video/lambo-wash-01.mp4` | Raw clip as supplied. 5.04s, 24fps, 1280×720 h264, **121 frames, only 1 keyframe.** Do not serve this directly — seeking is unusable (see §3). |
| `public/video/lambo-wash-01-scrub.mp4` | All-intra re-encode of the above. **Serve this one.** |
| `public/images/lambo-wash-01-first.jpg` | Extracted first frame — clean gloss-black arrival, minimal water on the paint. |
| `public/images/lambo-wash-01-last.jpg` | Extracted last frame — full foam/soap coverage across the car. Clip 2 start. |
| `public/video/lambo-wash-02-rinse.mp4` | Signed clip 2 raw (10.04s, 24fps, 1280×720). Frozen camera, rinse is the subject. **Do not serve.** |
| `public/video/lambo-wash-02-rinse-scrub.mp4` | All-intra re-encode. Signed. **Not wired** until the owner says so. |
| `public/images/lambo-wash-02-last.jpg` | Clip 2 last frame — near-side, foam stripped on the visible body, wet gloss-black. Remainder start. |

Shot description (for consistency if any future frame needs regenerating/extending): gloss black
Lamborghini Huracán, side profile, nose toward camera-left; herringbone/basketweave brick driveway;
modern white villa with a pierced concrete breeze-block screen wall behind; single palm tree
top-center; golden-hour sun behind camera-right producing a visible lens flare; a pressure-washer
hose enters frame from top-left throughout.

---

## 3. Why the all-intra re-encode is mandatory (proven again on this clip)

`video.currentTime` seeking snaps to the nearest keyframe. Verified on `lambo-wash-01.mp4`:
**exactly 1 keyframe across 121 frames** — every seek would decode from frame zero, which makes
scrubbing unusable. Fixed the same way as v2's hero clip:

```bash
ffmpeg -i public/video/lambo-wash-01.mp4 -c:v libx264 -g 1 -preset veryfast -crf 20 \
       -pix_fmt yuv420p -an public/video/lambo-wash-01-scrub.mp4
```

Measured on this clip: 4.9MB → 6.0MB (1.22×), and keyframes went from 1 to **120 of 121 frames.**
Already done — the file is in the repo. **Do not re-encode or "optimize" it smaller** — that
reintroduces seek lag. If you ever swap in a new raw clip, this is the required first step before it
touches the site.

---

## 4. Generation recipe (every generated clip)

- **Tool:** Higgsfield MCP → `generate_video`.
- **Model:** `seedance_2_5` (image-to-video).
- **mode:** `omni_reference`.
- **medias:** `{ "role": "start_image", "value": "<previous last-frame media_id>" }` plus, whenever
  wheels are visible, `{ "role": "image_references", "value": "<media_id of
  hurracan-black-rims-ref.jpg>" }` (paint + **all-black rims**, never silver).
- **resolution:** `720p` first; `1080p` only if a take is signed and we upres.
- **aspect_ratio:** `16:9`.
- **duration:** Clip 2 was **10s**. Remainder duration is **TBD in the next chat** (Seedance allows
  4–30s). Fit the remaining beats into **one** take — do not fire three jobs.
- **generate_audio:** `false`.
- **Decline presets:** **"IN THE DARK"** (`24bae836-2c4a-48e0-89b6-49fcc0b21612`) every time. If
  **ELEVATE** (`5b3c1307-bee6-46e1-bdee-fba2db843d00`) or any other preset nudges, decline it —
  generate the literal brief.
- **Billing:** ALWAYS preflight with `get_cost: true`, show the cost, wait for the owner to type
  **GO**. `use_unlim: false`. Fire **one job at a time**. Clip 2 is signed. Remainder is the next
  (and only remaining) generation.
- **Known media ids (reuse, do not re-upload unless missing):**
  - `lambo-wash-01-last.jpg` start_image: `a96732bb-e206-4409-8c8f-35ead9a4321f`
  - `hurracan-black-rims-ref.jpg` image_references: `93d2f684-1d33-46f5-bf6b-a908c2f53135`
  - `lambo-wash-02-last.jpg` remainder start: **not uploaded yet** — upload this file before firing.

### Poll & fetch (every clip)
1. `generate_video` → `status: pending`.
2. `jobs_wait` until `completed`.
3. Download `result_url` to the canonical raw path in §5, all-intra re-encode exactly as §3
   (`-g 1`, do not compress smaller), extract last frame to the matching `*-last.jpg`.
4. Show start / mid / end frames. **Do not wire into the site.**

### Camera law (clip 2 + remainder)
Every camera move has a job: it shows a wash step, a part of the car, or a readable beat the UI
can later label (a process, a finish, a fact about the work). **No empty glides. No coverage for
coverage’s sake.** If a move cannot be named in one line (“we are watching the rear rinse wrap”),
cut it. Keep professional distance — luxurious, modern, never a lens in the paint.

---

## 5. The continuation (LOCKED 2026-09-08) — clip 1 + signed clip 2 + one remainder

One pinned vertical scrub when wired. Not a new page section. **Site still serves clip 1 only.**
Clip 2 is signed and on disk, **not wired**.

**Scratched:** wax / protectant. Nose-orbit to a front hold as clip 2. Tight cabin POV through
the door. Empty camera moves. Generating old clips 3 / 4 / 5 as **separate jobs**.

**Identity (every clip that shows wheels):** gloss-black Huracán, **all-black multi-spoke rims**
(`public/images/hurracan-black-rims-ref.jpg`). Never silver. No people. No BMW. No wash-bay.
ESTATE, full native colour.

| # | Job | Camera (the job of the move) | Status | Paths |
|---|---|---|---|---|
| **1** | Arrival → full foam | **Frozen.** Near-side wide, nose frame-left. | ✅ on the site | `public/video/lambo-wash-01-scrub.mp4` · stills `lambo-wash-01-first.jpg` / `-last.jpg` |
| **2** | Rinse near side, wrap the visible rear | **Frozen** on clip-1 framing. The *rinse* is the subject. | ✅ **signed 2026-09-08** (job `5a00b140-e83d-43a4-8128-411992098a92`). Not wired. | `lambo-wash-02-rinse.mp4` + `-scrub.mp4` + `images/lambo-wash-02-last.jpg` |
| **3** | Remainder: far-side rinse + door + interior + exit → front hold | **ONE video.** Starts on clip-2 last frame. Camera first moves here: arcs **around the rear** (stay with the car, not a long pull behind it) because the rinse is finishing the **far side**. As it **arrives**, the far door opens in one clean motion. **Hold a reasonable viewing distance** — see the cabin, professional / luxurious / modern. **Do not get close. Do not dive into the seats.** Carpets **lift a little** → ghost vacuum **under and on** the carpet → carpets settle → seats, dash/console, wheel, door cards. Nobody visible. Not cartoon. Then back off (door is done being a window), door **closes**, glide from that far side **around to the front** — the move exists to land the clean-car portrait. Hold. | not generated | target: `lambo-wash-03-remainder.mp4` + `-scrub.mp4` + `images/lambo-wash-03-last.jpg` |

**Remainder last frame (the clean still):** car **front and centered**, camera at **roof height**
pointing **slightly down**, **kept distance** (not tight), wet mirror-black, black rims, foam-free.
This is the future comparison “after” — do not fake it until `lambo-wash-03-last.jpg` exists.

**Clip 2 start_image:** `public/images/lambo-wash-01-last.jpg` (done).
**Remainder start_image:** `public/images/lambo-wash-02-last.jpg`. Upload before firing. Duration
TBD (one take, Seedance 4–30s). Do not split back into 3 / 4 / 5.

### Run-through
Locked near-side, fully foamed (clip 1, on site). Jet strips soap on the visible flank and rear
(clip 2, signed, frozen camera). Then **one remainder clip:** camera arcs around the tail **because
the rinse is finishing the far side**. It arrives at a **held, professional distance**; the far door
opens in sync; we **watch** the interior (carpets lift, ghost vac under + on, then the rest of the
cabin). Camera retreats, door shuts, glide to a **wide, high, front-centered** hold. Stop.

### Failed takes (do not serve)
- Clip 2 take 1, 8s: `lambo-wash-02-rinse-take1.mp4` + `-scrub-take1.mp4` + `lambo-wash-02-last-take1.jpg` — tight, silver rims, leftover rear foam.
- Clip 2 take 2, 10s: `lambo-wash-02-rinse-take2.mp4` + `-scrub-take2.mp4` + `lambo-wash-02-last-take2.jpg` — attempted orbit that never left side-profile, mid-clip silver rims, rear not fully rinsed.

**Site right now:** hero ends mid-foam. Comparison stays **"ARRIVAL" / "FULL COVERAGE"**. Trust/CTA
must not claim a finished clean car. Do not invent a remainder or front still. Clip 2 is signed on
disk but not on the site.

Superseded v2 assets, **do not use**: `public/video/wash-hero.mp4`, `wash-hero-scrub.mp4`,
`scene-02-wheels.mp4` — BMW, wash bay, wrong direction.

---

## 6. Wiring into the site

Keep the media source behind `CinematicStage` (`claude.md` rule 3). Scroll is **VERTICAL** now:
```
progress = clamp(scrollY_within_pin_range / pinRangeHeight, 0, 1)
video.currentTime = dampedProgress * video.duration
```
Serve `lambo-wash-01-scrub.mp4`, never `lambo-wash-01.mp4`. **Do not wire clip 2 or the remainder**
until the owner says so. When they do: concat or dual-source on one progress 0→1, grow
`PIN_RUNWAY_VH` with total duration, add stations that match real beats (rinse / interior / front),
swap the comparison second still to `lambo-wash-03-last.jpg`. **Cursor is the primary builder for
site code** — see `docs/CURSOR_REBUILD_PROMPT.md`.

---

## 7. Guardrails

- Preflight every generation (`get_cost: true`) and confirm the credit spend before firing. No GO,
  no job.
- Decline "IN THE DARK" every time. Decline other preset nudges (including ELEVATE).
- Clip 1 stays static forever. Clip 2 is signed: it *opens* on `lambo-wash-01-last.jpg` and stays
  frozen. Do not regenerate either. Motion starts in the remainder, around the rear, for a reason.
- Far door: viewing distance. See the interior process. Do not push in.
- Remainder end: front-centered, roof height, slight down, keep distance.
- Every camera move must have a named job (see §4 camera law).
- Missing media → labeled placeholders. Never fake a clean/front/interior frame.
- Remainder is **one job**, not clips 3 / 4 / 5. Do not wire until asked.
