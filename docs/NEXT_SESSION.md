# Next Session — pick up here (written 2026-09-08, after phone-black + interior hitch)

Phone on production was a black hero. Desktop hitching was the interior beat of a 4K
all-intra decode. Both are addressed in this working tree. **No Higgsfield spend.**
Do not fire 1080 / 2K / 4K again. 4K stays on disk for the comparison loupe only.

## Read in this order
1. `CLAUDE.md` — v3.1 banner, §5–7, §10 (rules 11–14), §11.
2. `docs/QUALITY_AND_PERF.md` — pixels-per-byte and the P1–P8 list (most of those are done).
3. `docs/BOOKING_COMPOSER.md` — page ending.
4. This file.

## The two decisions already made — do not re-litigate
- **Mobile stays 720p, always.** Never hand an upres to a phone.
- **Desktop film is 1080, not 4K.** Highest quality that still scrubs. 4K I-frames melted
  the decoder on the interior (~15–23s / stations 0.59–0.91). 4K JPGs remain the loupe source.
- **Booking composer only.** The process ledger is cut. The page ends there.

## Served pair (paths in `FILM` in `lib/scene/sceneTimeline.ts`)
```
phone / portrait / small / tablet
  public/video/lambo-wash-full-scrub-take1-trim-v2-grade-faststart.mp4
  608f, 24fps, 1280×720, all-intra, grade baked, moov at START (~25 MB)

landscape desktop
  public/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade-crf21-faststart.mp4
  608f, 24fps, 1920×1080, all-intra, grade baked, CRF 21, moov at START (~46 MB)
```

Do **not** point `FILM.scrubDesktop` at the 4K file or the Vercel Blob URL. Blob Range
for that 143 MB object is broken (`bytes=0-1023` → `0-1023/1024`). Local 4K faststart
exists but is gitignored (GitHub 100 MB limit) and is not a scrub source.

Variant pick is once at mount inside `VideoScrubber` (`ssr: false`). Tablets excluded
via `(pointer: coarse)` or iPadOS-as-MacIntel. CSS filter is gone. P2 and P8 are done.
`SEEK_EPSILON` is **0.02** (half a 24fps frame) — that was gated C1; it landed as the
interior smoothness fix.

## Why the phone was black
The previous 720p (and 1080) had **mdat first, moov at the end**. iOS Safari often
never paints. Native `<video poster>` vanishes as soon as `src` is set. `primeSeeking()`
called `play()` without a gesture and left the decoder black. Production also sent
`Cache-Control: max-age=0`, so every refresh re-downloaded 25 MB.

Fixes in this tree:
- faststart remuxes (new filenames, old files still on disk)
- a real `<img>` **on top of** the `<video>` until `requestVideoFrameCallback` / `playing`
- iOS: one `pointerdown` → `play().then(pause)` to unlock seeking
- no `translateZ(0)` on `(pointer: coarse)` / `(hover: none)` — that 3D transform
  blacks out Safari’s video surface
- `next.config.ts` long-cache headers on `/video/:path*`

## Already on disk (do not overwrite, do not re-encode unless asked)
```
public/video/lambo-wash-full-take1.mp4                         30s master — never serve
public/video/lambo-wash-full-take1-trim.mp4                    signed 25.33s 720p trim — never serve
public/video/lambo-wash-full-scrub-take1-trim.mp4              old third-gen 720 scrub — not served
public/video/lambo-wash-full-scrub-take1-trim-v2.mp4           720 all-intra, no grade — local archive
public/video/lambo-wash-full-scrub-take1-trim-v2-grade.mp4     pre-faststart 720 — disk archive, gitignored
public/video/lambo-wash-full-scrub-take1-trim-v2-grade-faststart.mp4  SERVED phone
public/video/lambo-wash-full-take1-trim-upres-1080.mp4         signed ByteDance 1080 raw (3 kf)
public/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade-crf21.mp4  pre-faststart 1080 — disk archive, gitignored
public/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade-crf21-faststart.mp4  SERVED desktop
public/video/lambo-wash-full-take1-trim-upres-4k.mp4           signed ByteDance 4K pro raw — local, not in git
public/video/lambo-wash-full-scrub-take1-trim-upres-4k-grade-crf21-faststart.mp4  4K archive — gitignored, NOT film
public/images/lambo-wash-full-start.jpg                       720 poster
public/images/lambo-wash-full-start-upres-1080.jpg            1080 poster (desktop film)
public/images/lambo-wash-full-start-upres-4k.jpg              4K loupe only
public/images/lambo-wash-full-trim-last.jpg                   comparison still (frame 607)
public/images/lambo-wash-full-trim-last-upres-4k.jpg          4K loupe last
public/images/film-grain.png                                  static 512 tile
```

All served scrubs are **608 frames / 608 keyframes / 25.333s**, last PTS 25.291667,
hard cut at master frame 608 is not in the file.

## Already done — do not redo
P1 one-seek-in-flight · P2 grade bake · P3 ignoreMobileResize · P4a scrollerProxy
removed · P5 lenis refcount · P6 loading readout (buffered range, not loadeddata) ·
P8 grain/scrim · booking composer · nav invert · document rail · Trust reveal ·
Before/After 4K loupe · MotionProvider · C4 tablet exclusion · C1 SEEK_EPSILON 0.02 ·
faststart 720+1080 · iOS poster/unlock · video Cache-Control immutable.

## Remaining (only if the designer asks)
1. Confirm production https://carwasher.vercel.app actually requests the **faststart**
   files (previews are SSO-gated — share production only). Hard-refresh the phone.
2. C2 (gate scroll until buffered) and C3 (drop extra ScrollTrigger.update) stay gated.
3. Blob 4K Range is still broken — do not re-point desktop at it.
4. Eyeball SEEK_EPSILON 0.02 on a real desktop; if the playhead feels quantized, it
   can go back toward 0.01 — do not go back to 0.003.

## Standing constraints
Branch `cursor/nextjs-agent-rules`, never `main`. Vertical only, damping k=0.09,
`cineEase` in `easing.ts` only. Never hard-code scene % outside `sceneTimeline.ts`.
Media stays behind `<CinematicStage>`. Missing media → labeled placeholder, never a
fake claim. ESTATE tokens; film in full native colour. **No new dependencies.**
No Higgsfield unless the latest user message is a standalone line `GO`.
Never overwrite a media file. Never hand 4K to a phone.

Do not drive the owner's Chrome. Headless on port **9333**, own profile, against
**`http://localhost:3001`** (not `127.0.0.1`). Dev is already on 3001 if 3000 is taken.
