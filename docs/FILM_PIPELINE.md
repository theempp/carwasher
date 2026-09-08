# Film Pipeline — Driveway Wash Clip (SOURCE OF TRUTH for the video build, v3)

> Read this FIRST, then `claude.md`. Last updated: 2026-09-08. **Direction re-locked with the owner
> (Enzo) on 2026-09-08 from a real owner-supplied clip — supersedes the v2 wash-bay/BMW/horizontal
> chained-segment plan entirely.**

---

## 1. LOCKED DIRECTION (v3 — supersedes the old wash-bay continuous-take plan)

The hero is **ONE static, locked-off camera shot** — the camera never pans, orbits, or pushes in. A
gloss-black **Lamborghini Huracán** sits side-profile on a sunlit estate driveway; a hose sprays in
from top-left and foam builds across the paint as the clip runs. As the user scrolls, they scrub
along that clip's timeline:

- **Scroll is VERTICAL** (changed back from v2's horizontal experiment). Scroll down = the clip
  advances; scroll up = it runs in reverse.
- **Clip start = clean gloss black arrival. Clip end = full foam coverage.** This is honestly *not*
  a full dirty→spotless arc yet — see §5 for what's still missing.
- **Camera does not move at all.** This is the opposite choice from v2 ("camera glides continuously")
  and it's deliberate: a static shot reads as observational/real, which is what both the owner's own
  footage and the competitor reference ("VARNISH") do. It also makes future chaining trivial — there
  is no motion vector to match at a hand-off, only lighting and wash-state continuity.
- **Look: full colour, golden hour, warm.** NOT desaturated, NOT moody/dark. This is the opposite
  grade from v2's wash-bay look — see `docs/DESIGN_DIRECTION.md`.

**Why this changed again:** v2 was built around a wash-bay reference photo and a horizontal
continuous-glide concept that was never shot or generated. The owner has now supplied an actual clip
(`LamboWash1.mp4`, renamed `lambo-wash-01.mp4` in this repo) that is a completely different setting,
car, camera style, and grade. Building against real footage beats building against an unproduced
plan — this doc now describes what actually exists plus the minimal next clip needed to complete the
arc.

---

## 2. What exists right now (zero generation cost — this was owner-supplied)

| File | Description |
|---|---|
| `public/video/lambo-wash-01.mp4` | Raw clip as supplied. 5.04s, 24fps, 1280×720 h264, **121 frames, only 1 keyframe.** Do not serve this directly — seeking is unusable (see §3). |
| `public/video/lambo-wash-01-scrub.mp4` | All-intra re-encode of the above. **Serve this one.** |
| `public/images/lambo-wash-01-first.jpg` | Extracted first frame — clean gloss-black arrival, minimal water on the paint. |
| `public/images/lambo-wash-01-last.jpg` | Extracted last frame — full foam/soap coverage across the car. |

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

## 4. The proven generation recipe (for the NEXT clip — unused so far, kept from v2)

This is only needed once the owner wants a second, generated clip (see §5). Nothing here has been
spent yet.

- **Tool:** Higgsfield MCP → `generate_video` (server id begins `229e641b…`).
- **Model:** `seedance_2_5` (image-to-video).
- **mode:** `omni_reference`.
- **medias:** two entries —
  `{ "role": "start_image", "value": "<media_id of lambo-wash-01-last.jpg>" }` (foam coverage,
  framing lock) and `{ "role": "image_references", "value": "<media_id of the clean black-rim
  Huracán still>" }` (paint + **all-black rims**, never silver).
- **resolution:** `720p` to start (cost control); `1080p` for the eventual final if it holds up.
- **aspect_ratio:** `16:9`.
- **duration:** **10s** (retake, 2026-09-08) — 2–3s locked side rinse, orbit while rinsing,
  then a **2–3s front-and-centered hold** at the end.
- **generate_audio:** `false` (scrubbed on scroll — audio is wasted cost).
- **Decline the preset nudge:** decline **"IN THE DARK"** (id
  `24bae836-2c4a-48e0-89b6-49fcc0b21612`) — it hijacks the art direction toward moody/dark, which is
  wrong for this golden-hour direction.
- **Billing:** spends **credits**. ALWAYS preflight with `get_cost: true` and confirm the spend with
  the owner before generating. Pass `use_unlim: false`.

### Prompt brief for the next clip (rinse & reveal → front)
Hold the EXACT start-image framing for the first 2–3 seconds (static locked wide side profile —
same distance as the start frame, do not push in). Gloss-black Huracán, **all-black multi-spoke
rims** (never silver/chrome), driveway, villa, palm, golden backlight. Car is fully foam-covered
at t=0. A pressure-rinse from the top-left hose runs across the ENTIRE car including the rear
haunches, rear bumper, engine cover and rear wheels. Keep rinsing while the camera moves; only
stop ~2 seconds before the last frame. By then every bit of foam is gone, especially the backside.
Then orbit around the nose toward the front: stay **further back** (no dolly-in), **crane higher**.
Arrive front-and-centered with **2–3 seconds left** and HOLD that frame to the end. End: wide,
elevated, front-centered, wet mirror-black, black rims, foam-free. No people. No cuts.

### Poll & fetch pattern (unchanged from v2)
1. `generate_video` returns a job with `status: pending`.
2. Long-poll `jobs_wait` until `completed`.
3. Grab `result_url` (CloudFront .mp4), download into `public/video/`, name it
   `lambo-wash-02-rinse.mp4`, then all-intra re-encode it exactly as in §3 before it touches the site.

---

## 5. Progress & the honest gap

| # | Clip | Status | File |
|---|---|---|---|
| 1 | Arrival → full foam coverage | ✅ have it — owner-supplied, re-encoded, ready to wire up | `public/video/lambo-wash-01-scrub.mp4` |
| 2 | Foam rinse → front reveal (orbit) | ✅ 10s take 2 in repo — **not wired**; one more designer tweak pending | `public/video/lambo-wash-02-rinse-scrub.mp4` |

**Owner confirmation 2026-09-08:** the rinse-off is wanted as a *continuation of the same pinned
scrub*, not a separate gallery beat. Clip 2 still starts on `lambo-wash-01-last.jpg` (full foam,
same side-profile framing as clip 1). **Designer amendment same day:** after 2–3s of locked-camera
rinsing, the camera smoothly orbits around the nose to a dead-on front view, slightly higher
angle — that end frame is the setup for the next scroll transition. Clip 1 stays static. Handoff
at t=0 is still a locked match; motion begins only after the opening hold. Still **do not
generate** until the owner says go (credits). Until clip 2 is signed off, the comparison stays
"ARRIVAL" / "FULL COVERAGE". Do not wire clip 2 into the site yet.

Take 1 (8s, too tight, silver rims, leftover rear foam, camera got close) is archived as
`public/video/lambo-wash-02-rinse-take1.mp4` + `-scrub-take1.mp4` +
`public/images/lambo-wash-02-last-take1.jpg`. Current take 2 is the 10s file at the
canonical `lambo-wash-02-rinse*.mp4` paths. Identity still for black rims:
`public/images/hurracan-black-rims-ref.jpg`.

When clip 2 lands: all-intra re-encode (`-g 1`), serve as `lambo-wash-02-rinse-scrub.mp4`, chain it
behind `<CinematicStage>` (concat or dual-source on one progress 0→1), grow `PIN_RUNWAY_VH` with
the extra duration, add a rinse station, then swap the comparison's second still + label to the
real reveal frame.

**What this means for the site right now:** the hero clip alone does not show a "clean" reveal — it
ends mid-foam. `docs/DESIGN_DIRECTION.md` §5 already accounts for this: the before/after section
must be honestly labeled ("ARRIVAL" vs "FULL COVERAGE") until clip 2 exists, and the trust-panel/CTA
copy should not claim to show a finished clean car. Do not invent or imply a reveal frame that
doesn't exist.

Superseded v2 assets, kept in the repo for reference only, **do not use**:
`public/video/wash-hero.mp4`, `public/video/wash-hero-scrub.mp4`, `public/video/scene-02-wheels.mp4`
— different car (BMW), different setting (wash bay), wrong direction.

---

## 6. Wiring into the site

Keep the media source behind `CinematicStage` (`claude.md` rule 3). Scroll is **VERTICAL** now:
```
progress = clamp(scrollY_within_pin_range / pinRangeHeight, 0, 1)
video.currentTime = dampedProgress * video.duration
```
Serve `lambo-wash-01-scrub.mp4`, never `lambo-wash-01.mp4`. **Cursor is the primary builder for site
code** — see `docs/CURSOR_REBUILD_PROMPT.md`.

---

## 7. Guardrails

- Preflight every generation (`get_cost: true`) and confirm the credit spend before firing — clip 2
  has not been generated and should not be until the owner explicitly says go.
- Decline the "IN THE DARK" preset every time — wrong grade for this direction.
- Clip 2 must *open* on the exact static framing of `lambo-wash-01-last.jpg`. Camera motion is
  allowed only after the 2–3s hold, and only as the designed orbit to a front, slightly-elevated
  end frame — no accidental drift, no early move, no cuts.
- Missing media → the site renders labeled placeholders (don't fake assets or claims).
- Show the owner clip 2 before spending on anything further.
