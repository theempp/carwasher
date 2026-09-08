# Film Pipeline — Driveway Wash Clip (SOURCE OF TRUTH for the video build, v3)

> Read this FIRST, then `claude.md`. Last updated: 2026-09-08 (remainder take 2 unsigned).
> **Direction re-locked with the owner (Enzo) on 2026-09-08 from a real owner-supplied clip —
> supersedes the v2 wash-bay/BMW/horizontal chained-segment plan entirely.**
>
> **Designer lock:** wax is dead. Nose-orbit → front-hold is dead. Clip 2 (frozen rinse) is
> **signed**. Remaining beats collapse into **ONE remainder video** — see **§5** and
> `docs/REMAINDER_BRIEF.md` (remainder-only path). Remainder **take 2 exists, unsigned**.
> A separate **full-film 30s draft** is locked in `docs/FULL_FILM_DRAFT.md` — sharpen
> that brief before GO. Generation recipe: **§4**. Do not generate until the owner
> types GO. Do not wire anything past clip 1 until they say so. Do not overwrite
> clip 1 or signed clip 2 files.

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
  + interior arc is **one remainder video** in §5 — take 2 is on disk, unsigned.
- **Clip 1 camera does not move at all.** Clip 2 camera does not move either (signed). Motion starts
  in the remainder video, only on the motivated path in §5 / `docs/REMAINDER_BRIEF.md` — never
  empty coverage, never a nose-orbit, never a fur interior, never a rear-jerk fake-out, never a
  parked freeze.
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
| `public/video/lambo-wash-03-remainder-take1.mp4` | Remainder take 1 raw (24.04s). **Unsigned archive. Do not serve.** |
| `public/video/lambo-wash-03-remainder-scrub-take1.mp4` | All-intra of take 1. Unsigned archive. |
| `public/images/lambo-wash-03-hold-take1.jpg` | Take 1 mid-hold grab — still a side profile, **not** a front still. |
| `public/images/lambo-wash-03-last-take1.jpg` | Take 1 last frame — not overhead, not a drive-off. |
| `public/video/lambo-wash-03-remainder-take2.mp4` | Remainder take 2 raw (18.04s). **Unsigned current reference. Do not serve.** |
| `public/video/lambo-wash-03-remainder-scrub-take2.mp4` | All-intra of take 2 (433/433 keyframes). Unsigned. |
| `public/images/lambo-wash-03-hold-take2.jpg` | Take 2 front portrait (~15s) — low, distant, front-and-centered. Comparison still. |
| `public/images/lambo-wash-03-last-take2.jpg` | Take 2 last frame — overhead; car already left the frame. |

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
- **duration:** Clip 2 was **10s**. Remainder take 1 was **24s / 156 cr**. Remainder take 2
  was **18s / 117 cr**. Next take stays in that neighborhood unless the designer’s two tweaks
  need a second. Seedance allows 4–30s. Fit the remaining beats into **one** take — do not
  fire three jobs.
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
  - `lambo-wash-02-last.jpg` remainder start: `71f5b7e5-b6f8-428c-9047-e7fed1154aa5` (uploaded
    2026-09-08 — reuse, do not re-upload unless missing).

### Poll & fetch (every clip)
1. `generate_video` → `status: pending`.
2. `jobs_wait` until `completed`.
3. Download `result_url`. If unsigned, save as `*-takeN` (same pattern as clip 2 / remainder
   take 1 / take 2). If signed, write the canonical raw path in §5. All-intra re-encode exactly
   as §3 (`-g 1`, do not compress smaller). Extract `*-hold.jpg` from the front portrait
   (comparison still) and `*-last.jpg` from the true last frame (overhead / drive-off — car
   still in frame).
4. Show start / mid / hold / end frames. **Do not wire into the site.**

### Camera law (clip 2 + remainder)
Every camera move has a job: it shows a wash step, a part of the car, or a readable beat the UI
can later label (a process, a finish, a fact about the work). **No empty glides. No coverage for
coverage’s sake.** If a move cannot be named in one line (“we are watching the rear rinse wrap”),
cut it. Keep professional distance — luxurious, modern, never a lens in the paint. Remainder camera
reads as **drone footage**, not a yanked dolly.

---

## 5. The continuation (LOCKED 2026-09-08) — clip 1 + signed clip 2 + one remainder

One pinned vertical scrub when wired. Not a new page section. **Site still serves clip 1 only.**
Clip 2 is signed and on disk, **not wired**.

**Scratched:** wax / protectant. Nose-orbit to a front hold as clip 2. Tight cabin POV through
the door. Empty camera moves. Generating old clips 3 / 4 / 5 as **separate jobs**. Far-side
rear wrap as the remainder’s first move (clip 2 already rinsed; camera starts on clip-2
framing). Interior **fur / sheepskin** on the seats. A camera fake-out that rotates toward the
**rear** then jerks to the front.

**Identity (every clip that shows wheels):** gloss-black Huracán, **all-black multi-spoke rims**
(`public/images/hurracan-black-rims-ref.jpg`). Never silver. No people. No BMW. No wash-bay.
ESTATE, full native colour.

| # | Job | Camera (the job of the move) | Status | Paths |
|---|---|---|---|---|
| **1** | Arrival → full foam | **Frozen.** Near-side wide, nose frame-left. | ✅ on the site | `public/video/lambo-wash-01-scrub.mp4` · stills `lambo-wash-01-first.jpg` / `-last.jpg` |
| **2** | Rinse near side, wrap the visible rear | **Frozen** on clip-1 framing. The *rinse* is the subject. | ✅ **signed 2026-09-08** (job `5a00b140-e83d-43a4-8128-411992098a92`). Not wired. | `lambo-wash-02-rinse.mp4` + `-scrub.mp4` + `images/lambo-wash-02-last.jpg` |
| **3** | Remainder: near door + **foam interior** (golden) + drone around the front + overhead drive-off | **ONE video. Drone.** Starts on clip-2 last frame. **Keep take 2’s spine:** glide in as the **near-side door** opens; no fur; foam then swipe; backup **and** door close together, then 1–2s later one continuous path around the **FRONT**; low distant front-and-centered portrait (not a parked freeze); boom **directly above the roof** while the car **drives off**. Take 2 approach still starts too low (asked: rise and slowly around the door so floor/mats stay visible). Carpets in take 2 sit **flat** — golden shot still wants them **lifted and staying lifted**. Foam in take 2 is heavy, not gentle. Take 2 last frame lost the car. Full notes: `docs/REMAINDER_BRIEF.md`. Next chat: designer names **two tweaks** only. | take 2 unsigned | target (when signed): `lambo-wash-03-remainder.mp4` + `-scrub.mp4` + `images/lambo-wash-03-hold.jpg` + `lambo-wash-03-last.jpg`. Takes: `*-take1.*` archive, `*-take2.*` current |

**Remainder comparison still:** grabbed from the **front hold** (`lambo-wash-03-hold.jpg`) — car
**front and centered**, camera **low and distant** (not roof height, not a down-angle), wet
mirror-black, black rims. Do not use the true last frame for comparison.

**Remainder last frame:** overhead, car driving off. That is `lambo-wash-03-last.jpg`, not the
“after” still.

**Clip 2 start_image:** `public/images/lambo-wash-01-last.jpg` (done).
**Remainder start_image:** `public/images/lambo-wash-02-last.jpg` — uploaded, media id
`71f5b7e5-b6f8-428c-9047-e7fed1154aa5`. Duration: take 2 was **18s / 117 cr**. Do not split
back into 3 / 4 / 5.

### Run-through
Locked near-side, fully foamed (clip 1, on site). Jet strips soap on the visible flank and rear
(clip 2, signed, frozen camera). Then **one remainder clip (drone):** glide in as the **near
door** opens (take 2: rise and around the door so floor/mats stay visible) → **golden interior**
(carpets stay lifted, gentle foam, then swipe/scrub) → backup **and** door close together →
1–2s later drone around the **front** to a **low, distant front-centered** portrait (no parked
freeze) → boom over the roof as the car **drives off**, car still in the last frame. Stop.

### Takes on disk (do not serve)
- Clip 2 take 1, 8s: `lambo-wash-02-rinse-take1.mp4` + `-scrub-take1.mp4` + `lambo-wash-02-last-take1.jpg` — tight, silver rims, leftover rear foam.
- Clip 2 take 2, 10s: `lambo-wash-02-rinse-take2.mp4` + `-scrub-take2.mp4` + `lambo-wash-02-last-take2.jpg` — attempted orbit that never left side-profile, mid-clip silver rims, rear not fully rinsed.
- Remainder take 1, 24s: `lambo-wash-03-remainder-take1.mp4` + `-scrub-take1.mp4` + `lambo-wash-03-hold-take1.jpg` + `lambo-wash-03-last-take1.jpg` — fur on seats (twice). Rear-jerk. Two freezes. Never landed the front portrait or the overhead drive-off. Job `36110b94-aabf-4681-a458-1795d71e6f5c`.
- Remainder take 2, 18s: `lambo-wash-03-remainder-take2.mp4` + `-scrub-take2.mp4` + `lambo-wash-03-hold-take2.jpg` + `lambo-wash-03-last-take2.jpg` — **current unsigned reference.** No fur. Front path around the front. Boom exists. Hold is a real front portrait. Designer said all right; two tweaks coming. Known misses: approach still low, carpets flat, foam heavy, last frame lost the car. Job `29b9abc7-a5e4-4ca9-8788-77abcf21e8f8`.

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
`PIN_RUNWAY_VH` with total duration so the full film still feels **somewhat fast, not slow**,
add stations that match real beats (rinse / near-door foam interior / front hold / drive-off),
swap the comparison second still to `lambo-wash-03-hold.jpg` (front hold — not the last frame).
**Cursor is the primary builder for site code** — see `docs/CURSOR_REBUILD_PROMPT.md`.

---

## 7. Guardrails

- Preflight every generation (`get_cost: true`) and confirm the credit spend before firing. No GO,
  no job.
- Decline "IN THE DARK" every time. Decline other preset nudges (including ELEVATE).
- Clip 1 stays static forever. Clip 2 is signed: it *opens* on `lambo-wash-01-last.jpg` and stays
  frozen. Do not regenerate either. Remainder motion starts as a **drone glide to the near door**.
- Near door: viewing distance. Golden interior = lifted carpets + gentle foam + swipe/scrub. No
  fur. Do not push into the seats.
- Remainder front portrait: low, distant, front-centered. Boom over the roof as the car leaves —
  do not park 2–3s before the rise. Last frame still has the car. Comparison still = hold, not
  last frame.
- Every camera move must have a named job (see §4 camera law). No rear-jerk fake-out.
- Missing media → labeled placeholders. Never fake a clean/front/interior frame.
- Remainder is **one job**, not clips 3 / 4 / 5. Do not wire until asked. Take 2 is unsigned.
