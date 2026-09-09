# Next Session — pick up here (written 2026-09-09, after iOS pin-transform black)

Phone on production still looked dead after faststart shipped. The 720 file was
the right one; GSAP `pin: true` was writing `transform: matrix(1,0,0,1,0,0)` onto
the `<section>` that owned the `<video>`, and iOS Safari paints that surface black.
Desktop playhead is 4K again (v3.1.3). **No Higgsfield spend.**
Do not fire 1080 / 2K / 4K again. Interior I-frames can hitch; that is accepted.

## Read in this order
1. `CLAUDE.md` — v3.1.3 banner, §2 (no pin on the film), §5–7, §10 (rules 11–15), §11.
2. `docs/QUALITY_AND_PERF.md` — pixels-per-byte and the P1–P8 list (those are done).
3. `docs/BOOKING_COMPOSER.md` — page ending.
4. This file.

## The decisions already made — do not re-litigate
- **Mobile stays 720p, always.** Never hand an upres to a phone.
- **Desktop film is 4K.** Localhost serves the gitignored faststart file; preview /
  production serve `FILM.scrubDesktopRemote` (Vercel Blob). 1080 is the miss fallback.
  Interior I-frames (~15–23s) can hitch — accepted 2026-09-09. 4K JPGs remain the loupe.
  Never hand 4K to a phone.
- **Booking composer only.** The process ledger is cut. The page ends there.
- **Do not restore `ScrollTrigger` `pin` / `anticipatePin` on the film.** Progress comes
  from an empty runway (`start: "top top"`, `end: "bottom bottom"`). The film is
  `.film-stage` (`position: fixed`, `pointer-events: none`, no transform). Trust /
  comparison / booking sit in `relative z-10` and cover it.

## Served pair (paths in `FILM` in `lib/scene/sceneTimeline.ts`)
```
phone / portrait / small / tablet
  public/video/lambo-wash-full-scrub-take1-trim-v2-grade-faststart.mp4
  608f, 24fps, 1280×720, all-intra, grade baked, moov at START (~25 MB)

landscape desktop (localhost)
  public/video/lambo-wash-full-scrub-take1-trim-upres-4k-grade-crf21-faststart.mp4
  608f, 24fps, 3840×2160, all-intra, grade baked, CRF 21, moov at START (~143 MB, gitignored)

landscape desktop (preview / production)
  FILM.scrubDesktopRemote — same 4K encode on Vercel Blob, moov at END
  Range re-verified 2026-09-09: `bytes=0-1023` → `0-1023/149832707`

1080 fallback
  public/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade-crf21-faststart.mp4
```

Do not re-upload 4K to Blob unless Range breaks again. Do not hand 4K to a phone.

Variant pick is once at mount inside `VideoScrubber` (`ssr: false`). Tablets excluded
via `(pointer: coarse)` or iPadOS-as-MacIntel. CSS filter is gone. P2 and P8 are done.
`SEEK_EPSILON` is **0.02** (half a 24fps frame) — that was gated C1; it landed as the
interior smoothness fix.

## Why the phone was black (two layers; both required)

**v3.1.1 — the file.** Previous 720/1080 had mdat first, moov at the end. iOS often
never paints. Faststart remuxes (new filenames) + immutable `/video/:path*` cache.

**v3.1.2 — the compositor.** Faststart was already on production (`moov` second box,
25.8 MB, 200). Headless iPhone-class 393×852 requested the 720 file and the playhead
moved, but a real iPhone stayed black because the pin ancestor was transformed.
Native `<video poster>` still vanishes when `src` is set.

Current paint path:
- `.film-stage` is fixed; **not** a GSAP pin target. No transform/filter/overflow on
  that ancestor.
- A real `<img>` stays on top of `<video>` until `requestVideoFrameCallback` (not the
  `playing` event — iOS can fire that on a black surface).
- iOS: first `pointerdown` / `touchstart` → `play()`, wait for a frame, then `pause()`.
- no `translateZ(0)` on `(pointer: coarse)` / `(hover: none)`.
- station copy uses `translateY`, not `translate3d` / `will-change`.
- Trust clip-reveal observes the in-flow overflow box, not the translated inner span.

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
public/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade-crf21-faststart.mp4  1080 fallback
public/video/lambo-wash-full-take1-trim-upres-4k.mp4           signed ByteDance 4K pro raw — local, not in git
public/video/lambo-wash-full-scrub-take1-trim-upres-4k-grade-crf21-faststart.mp4  SERVED localhost desktop
public/images/lambo-wash-full-start.jpg                       720 poster
public/images/lambo-wash-full-start-upres-1080.jpg            1080 poster (fallback)
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
faststart 720+1080 · iOS poster/unlock · video Cache-Control immutable ·
v3.1.2 fixed film layer (no GSAP pin on `<video>`).

## Remaining (only if the designer asks)
1. Confirm production https://carwasher.vercel.app actually runs **this** commit, not
   only faststart. Previews are SSO-gated — share production only. Hard-refresh the
   phone after promote. Git push deploys a preview; promote that. Do not
   `vercel --prod` from this tree (`public/video` is huge; gitignored 4K is 143 MB).
2. C2 (gate scroll until buffered) and C3 (drop extra ScrollTrigger.update) stay gated.
3. Eyeball the 4K interior hitch on a real desktop; drop back to 1080 only if asked.
4. Eyeball SEEK_EPSILON 0.02 on a real desktop; if the playhead feels quantized, it
   can go toward 0.01 — do not go back to 0.003.

## Standing constraints
Branch `cursor/nextjs-agent-rules`, never `main`. Repo `github.com:theempp/carwasher.git`.
Vercel project `carwasher`. Public production: https://carwasher.vercel.app.
Vertical only, damping k=0.09, `cineEase` in `easing.ts` only. Never hard-code scene %
outside `sceneTimeline.ts`. Media stays behind `<CinematicStage>`. Missing media →
labeled placeholder, never a fake claim. ESTATE tokens; film in full native colour.
**No new dependencies.** No Higgsfield unless the latest user message is a standalone
line `GO`. Never overwrite a media file. Never hand 4K to a phone.

Do not drive the owner's Chrome. Headless on port **9333**, own profile
`/tmp/chrome-cinematic-9333`, against **`http://localhost:3001`** (not `127.0.0.1`).
Dev is already on 3001 if 3000 is taken.
