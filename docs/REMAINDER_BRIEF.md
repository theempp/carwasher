# Remainder (clip 3) — designer lock for the next generation chat

> Last updated 2026-09-08 after remainder **take 2** (unsigned). Read this with
> `docs/FILM_PIPELINE.md` §4–§5. **Do not generate until the owner types GO.**
> Do not wire. Do not overwrite clip 1 or signed clip 2.
>
> If the next job is the **full wash in one 30s take**, this file is not the owner.
> Use `docs/FULL_FILM_DRAFT.md` instead. Take 2 stays on disk either way.

Take 2 is saved on disk as the current remainder. Keep it. The next chat **tweaks from take 2** —
it does not start from take 1, and it does not start from a blank remainder plan.

The designer said take 2 is **all right**, with **two tweaks** they will name in the next chat.
Do not invent a third change. Wait for those two notes before writing a new prompt.

---

## Take 2 (unsigned — current reference — do not serve, do not delete)

| | |
|---|---|
| Job | `29b9abc7-a5e4-4ca9-8788-77abcf21e8f8` |
| Cost | 117 credits · 18.04s · 1280×720 · 24fps · 433 frames |
| Recipe | `seedance_2_5` · `omni_reference` · 720p · 16:9 · `generate_audio: false` · `use_unlim: false` |
| Start image | `public/images/lambo-wash-02-last.jpg` — media id `71f5b7e5-b6f8-428c-9047-e7fed1154aa5` |
| Rim still | `public/images/hurracan-black-rims-ref.jpg` — `93d2f684-1d33-46f5-bf6b-a908c2f53135` |
| Raw | `public/video/lambo-wash-03-remainder-take2.mp4` |
| Scrub | `public/video/lambo-wash-03-remainder-scrub-take2.mp4` (433/433 keyframes, `-g 1`) |
| Hold grab | `public/images/lambo-wash-03-hold-take2.jpg` — **low, distant, front-and-centered** (~15.0s). This is the comparison still. |
| Last grab | `public/images/lambo-wash-03-last-take2.jpg` — overhead driveway; **the car has already left the frame** |

Canonical remainder paths (`lambo-wash-03-remainder.mp4`, `-scrub.mp4`, `lambo-wash-03-hold.jpg`,
`lambo-wash-03-last.jpg`) are **empty on purpose** until a take is signed.

---

## Take 1 (unsigned archive — do not serve, do not delete)

Keep on disk. Do not regenerate from it. Do not serve it.

| | |
|---|---|
| Job | `36110b94-aabf-4681-a458-1795d71e6f5c` |
| Cost | 156 credits · 24.04s |
| Raw / scrub | `lambo-wash-03-remainder-take1.mp4` + `-scrub-take1.mp4` |
| Why it lost | Fur on seats (played twice). Rear-jerk fake-out. Two camera freezes (~5s). Never landed the front hold or the overhead drive-off. Hold grab is still a side profile. |

---

## What to keep from take 2

Watch `public/video/lambo-wash-03-remainder-take2.mp4`. This is the baseline.

- **Open:** camera glides in as the **near-side door** opens. Near door already in the start frame. Do not go around the rear. Do not open the far door.
- **No fur.** Leather / Alcantara seats. Foam + swipe exists (spray nozzle, then a tool).
- **Floor / mats become readable** once the camera is in the cabin (~4.5s). Better than take 1’s worm’s-eye.
- **No parked freezes.** Interior does not sit 2–3s. Front does not park 2–3s before the boom.
- **Exit order:** camera backs up and the door closes with that backup; front path starts after, not in the same instant.
- **Front path:** one continuous drone line around the **FRONT**. No rotate-toward-the-rear. No jerk. This is the big win vs take 1.
- **Front portrait:** low, distant, front-and-centered at ~15s. Comparison still = that frame, not the last frame.
- **Boom:** camera rises directly above the roof. ~17.5s still has the car in the overhead. Keep that beat.
- **18s / 117 cr.** Site scroll should feel somewhat fast, not slow. Do not pad empty air back in.
- Recipe, start image, rim still, IN THE DARK decline — unchanged.

---

## Known misses on take 2 (for the designer to pick from — do not assume)

These are what the take-2 review actually saw. The next chat waits for the designer to name **exactly two** tweaks. Do not stack extra fixes.

1. **Approach height / path.** Take 2 still starts too low. The ask was: as the door opens, drone **glides up and around the door slowly** and adjusts angle so floor + mats stay visible. Take 2 is more of a push-in; the rise is late.
2. **Carpets do not lift.** They sit flat. The golden shot still wants carpets to **lift and stay lifted** for the whole interior.
3. **Foam is too heavy** at ~6.5s (frost / full-cabin coat). Ask was **gentle** interior foam, same family as exterior soap, then swipe.
4. **True last frame lost the car.** Overhead at 18.0s is empty driveway. Keep the car in the last frame (as at ~17.5s).

---

## Still locked (unless the designer’s two tweaks change it)

- **One video.** Not old clips 3 / 4 / 5. Not a regenerate of clip 1 or signed clip 2.
- Start on clip-2 last frame. Media ids above — reuse, do not re-upload unless missing.
- Viewing distance through the open door — see the cabin; do not dive into the seats.
- Camera language: **drone footage / a drone experience.** Smooth. Decided. Always moving. Living drift during interior is ok; a freeze is not.
- Front: low, distant, front-and-centered. **Not** a 3s parked hold — boom starts as that portrait arrives.
- Comparison still = front portrait (`*-hold.jpg`). Last frame = overhead with the car driving off (`*-last.jpg`).
- Preflight. `use_unlim: false`. Decline **IN THE DARK** (`24bae836-2c4a-48e0-89b6-49fcc0b21612`) every time. Decline **ELEVATE** (`5b3c1307-bee6-46e1-bdee-fba2db843d00`) and other preset nudges.
- All-black rims whenever wheels show. ESTATE, full native colour. No wax. No BMW. No wash-bay.
- Do not wire.

---

## Next chat job

1. Read this file first, then `docs/FILM_PIPELINE.md` §4–§5.
2. Watch take 2 (`lambo-wash-03-remainder-take2.mp4`).
3. **Wait for the designer to name the two tweaks.** Confirm keep vs those two kills. Do not add a third.
4. Propose duration + beat share that **keeps take 2’s spine** (open, no fur, no freeze, front path, boom) and only rewrites the two named beats.
5. Write the generation prompt. Preflight cost (`get_cost: true`). Wait for GO.
6. Then generate → wait → save as `-take3` if unsigned (canonical remainder only if signed) → all-intra `-g 1` → hold + last stills → show frames.
7. Do not wire.
