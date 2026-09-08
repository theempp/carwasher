# Full-film first draft — designer lock (unsigned)

> Last updated 2026-09-08 (sharpen: whole-car foam + rinse, drone camera).
> This file owns the **full-film draft**. Read with `docs/FILM_PIPELINE.md` §4
> and `docs/DESIGN_DIRECTION.md` (ESTATE).
> **Do not generate until the owner types GO.** Do not wire. Do not overwrite
> clip 1, signed clip 2, or remainder take 2.

This is a **new 30s job** that plays the entire wash in one take. It is not a
remainder retake. Remainder take 2 stays on disk (`docs/REMAINDER_BRIEF.md`).

The site goal: one vertical scroll that feels like **being on a drone** — exterior
detailing, then interior, then the front, then overhead as the car leaves.
Professional, photoreal, **one consistent vibe** the whole way (ESTATE: golden
hour, warm stone, gloss black, no grade change, no wash-bay).

---

## What the draft is

One Higgsfield video, starting on
`public/images/lambo-wash-full-start.jpg` (clean gloss-black Huracán, near-side
wide, estate driveway, golden hour).

In order:

1. **Entire car** foamed — every panel, not one flank
2. **Entire car** rinsed — every panel stripped to wet gloss black
3. Interior clean (imaginary tools only)
4. Drone to the front
5. Locked looking straight down; camera stays fixed; car pulls off slowly

Signed clip 1 and clip 2 stay on disk. This draft **re-invents** foam and rinse.
The site keeps serving clip 1 only until the owner wires this take.

---

## Designer locks added 2026-09-08 (do not drop)

1. **Whole car.** Foam and rinse must cover the **entire** Huracán — near side,
   front, far side, rear, roof edges, sills. Not “the panels we can see from a
   locked side profile.” The drone moves so the coverage is readable. No missed
   sections. No leftover foam islands after the rinse.
2. **Drone camera.** Every move is smooth, decided, professional drone footage.
   Constant velocity. No jitter, no snap zoom, no whip-pan, no rear-jerk fake-out.
   One feel from first frame to last. The scroll site should feel like this
   camera, not like a website.

---

## Model (locked for this draft)

| Model | Max length | Use |
|---|---|---|
| **Kling 3.0** | **15s** | Wrong tool. Do not use. |
| **Seedance 2.5** `omni_reference` | **30s** | **Use this.** |
| Wan 3.0 | 30s | Backup only if Seedance misses sequential interior. |

- `seedance_2_5` · `omni_reference`
- **30s** · **720p** · **16:9**
- `generate_audio: false`
- `use_unlim: false`
- ALWAYS `get_cost: true` first. Wait for **GO**.
- Decline **IN THE DARK** (`24bae836-2c4a-48e0-89b6-49fcc0b21612`) every time.
- Decline **ELEVATE** (`5b3c1307-bee6-46e1-bdee-fba2db843d00`) and other preset nudges.

GPT 6 Astra (Supercomputer chat) can sharpen copy and judge a take. It cannot
render the MP4. The pixels come from Seedance.

---

## Media

| | |
|---|---|
| Start still | `public/images/lambo-wash-full-start.jpg` — upload once; no media id yet |
| Rim still | `public/images/hurracan-black-rims-ref.jpg` — `93d2f684-1d33-46f5-bf6b-a908c2f53135` |
| Do not start on | the frosted / mottled interior screenshot |

---

## Clip 1 + 2 (review reel only)

`.tmp-review/01-plus-02.mp4` — signed foam + rinse for comparison. Not served.
Not wired. This draft must **beat** that reel on coverage (whole car, not one side).

---

## 30s beat share

Foam and rinse now **travel**. Frozen side-profile cannot show the whole car.

| Time | Beat |
|---|---|
| 0–7 | Start on the still. Hose / foam begins on the near side, then the drone **glides around the whole car** so every panel receives foam — front, far side, rear, roof edges. Full coverage. Smooth drone. No freeze, no jerk. |
| 7–13 | Same drone language. Jet rinse **follows the foam around the entire car**. Every panel strips to wet gloss black. No leftover soap. All-black rims stay black. |
| 13–15 | Near-side door opens. Drone glides in through that door. Viewing distance. Pin-sharp. Leather / Alcantara, orange stitch. No fur. |
| 15–23 | Imaginary interior clean (below). Living drift. No freeze. |
| 23–25 | Backup. Door closes with the backup. |
| 25–27 | Continuous drone around the **front** only (this is not a rinse wrap — rinse already finished). Low, distant, front-centered. Short settle (~1s). |
| 27–29 | Glide up. Angle to true nadir. Car parked until the lock. |
| 29–30 | Camera **fixed** overhead. Car pulls off slowly. Last frame still has the car. |

After rinse, do **not** wrap the rear again or fake-out toward the rear. Interior
entry is the near door. The later path is around the front only.

---

## Interior language (protect this)

Nothing enters the frame. Each part cleans itself, in order.

**Quality:** photoreal, consistent sharpness from the approach through the cabin.
Fine Alcantara nap and orange stitch stay readable. No digital frost, no mottled
grey overlay, no haze, no focus collapse.

**Forbidden in frame:** person, hands, spray bottle, nozzle, wand, brush, cloth.

1. Driver floor mat and carpet only
2. Driver seat, then passenger seat
3. Steering wheel and dashboard
4. Center console
5. Door panel and sill — last wipe as the camera leaves

Same language each time: thin pearl sheen (exterior-soap family, never a frost
coat), dust lifts and vanishes, material resolves clean.

---

## Seedance 2.5 prompt (current draft)

Copy into `generate_video` when the owner types GO. Sharpen in chat first if asked.

```
One continuous professional drone shot, 30 seconds, 16:9, photoreal. Full native golden-hour colour on a private estate driveway. Gloss-black Lamborghini Huracán, all-black multi-spoke rims. Herringbone brick, white villa, pierced breeze-block wall, single palm, warm backlight. Same light, same grade, same calm drone feel from first frame to last. No wash-bay. No BMW. No wax. No people.

Start locked on the supplied start frame: clean wet-ready side profile, nose camera-left. Camera language is drone footage the entire time — smooth, decided, constant velocity, living drift. No jitter, no snap zoom, no whip-pan, no handheld shake, no cut, no freeze except the one-second front settle later.

WHOLE-CAR FOAM (first beat): a hose enters from top-left and sprays thick white foam. The drone does not stay on one flank. It glides slowly around the entire car so EVERY panel is seen receiving foam — near side, front bumper and hood, far side, rear, roof edges, sills, wheels. Do not leave any section bare. By the end of this beat the whole car is fully foamed.

WHOLE-CAR RINSE (second beat): without a cut, a jet rinse follows that same complete path around the entire car and strips EVERY panel to wet mirror-black. Near side, front, far side, rear, roof, sills. No leftover foam islands. No missed sections. Rims stay all-black. Camera stays a smooth drone — no jerk when changing sides.

NEAR DOOR: after the whole car is rinsed, the near-side door opens. The drone glides in through that opening only. Do not go around the rear again. Do not open the far door. Viewing distance — see the cabin, do not dive into the seats. Pin-sharp the whole way in. Dark leather and Alcantara, orange contrast stitch. No fur, no sheepskin. Floor and mats readable. No digital frost, no mottled grey overlay, no haze, no smear.

INTERIOR CLEAN — imaginary only. No person, no hands, no spray bottle, no nozzle, no wand, no brush, no cloth. Nothing enters the frame. Each component cleans itself, one at a time; other surfaces wait. Same physical language on every part: a thin pearl moisture sheen (same family as the exterior soap, never a heavy frost) travels across that surface, fine dust motes lift and vanish, the material resolves to clean leather / Alcantara. Order: (1) driver floor mat and carpet only, (2) driver seat then passenger seat, (3) steering wheel and dashboard only, (4) center console only, (5) door panel and sill as the camera begins to leave. Living drone drift. No parked freeze in the cabin.

EXIT: camera backs away through the open door; the near-side door closes with that backup.

FRONT: one continuous drone path around the FRONT of the car only. No rotate toward the rear. No jerk. Arrive low, distant, front-and-centered. Full stop. Pause one second. The car does not move.

OVERHEAD: after that pause the camera glides up and over the roof, adjusting until it is locked looking straight down — true nadir, centered on the car. The car stays parked until that lock. Then the camera stays FIXED overhead while the car pulls off slowly down the driveway. Last frame is still that direct-down view with the car in frame.

Always one vibe: luxury estate, warm, quiet, professional. Comparison still is the front portrait, not the last frame.
```

---

## After GO (not before)

1. Concat 1+2 → `.tmp-review/01-plus-02.mp4` (coverage reference)
2. Upload start still. Preflight. Show credits.
3. Fire **one** job. Save as `public/video/lambo-wash-full-take1.mp4` (unsigned).
   All-intra `-g 1`. Hold = front portrait. Last = overhead with the car.
4. Judge: whole-car foam? whole-car rinse? drone-smooth? interior sharp? Do not wire.

---

## Out of this draft

- Do not overwrite clip 1 or signed clip 2 **files**
- Do not lift carpets unless the designer names it
- Do not pad a 3s parked front hold
- Do not serve or wire
- Astra may judge the take; Seedance renders it
