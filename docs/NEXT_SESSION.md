# Next Session — pick up here (written 2026-09-10 night, rail + look docs aligned)

The film and the scroll machine are still signed. Desktop 4K stays. **No Higgsfield spend.**
Do not fire 1080 / 2K / 4K again. Do not revert desktop to 1080.

**HOUSE below-pin is locked 2026-09-10.** **HOUSE motion shipped the same night:** clip
handoffs between slabs + sequence ticking. Designer asked for both; `transitions-parts`
stayed closed. Do not restore leftover Trust → Comparison → Booking. Do not copy the
KCS shop. Do not restore the old fade-and-slide `HouseMotion` stub.

## Read in this order
1. `CLAUDE.md` — v3.1.3 banner, §2 (no pin on the film), §4 HOUSE, §5–7, §10 (rules 11–15).
2. `docs/DESIGN_DIRECTION.md` — ESTATE film / HOUSE below pin.
3. `docs/REFERENCE_VAULT.md` — hunt ingested; pick pieces, do not re-open Ingested.
4. `docs/BOOKING_COMPOSER.md` — composer logic still lives; restyled into the house.
5. This file.

## The decisions already made — do not re-litigate
- **Mobile stays 720p, always.** Never hand an upres to a phone.
- **Desktop film is 4K, signed 2026-09-09.** Designer: "keep this version, it looks better."
  Localhost serves the gitignored faststart file; production/preview serve
  `FILM.scrubDesktopRemote` (Vercel Blob). 1080 is miss fallback only.
  Interior I-frames (~15–23s) can hitch — accepted. 4K JPGs remain the loupe.
- **HOUSE below-pin, locked 2026-09-10.** Rail → statement → drive → sequence slabs
  (signed stations only) → honest frames + loupe → request a time → compass close.
  Leftover `TrustPanel` / `BeforeAfter` are deleted. Do not bring them back.
- **HOUSE motion, shipped 2026-09-10 night.** `HouseMotion` wraps `.after-pin`.
  Slabs use `[data-house-slab]` clip-reveals (wipe from the top edge, scrubbed,
  reversible). Sequence uses `[data-house-station]` + `is-active`. Knobs only in
  `lib/animation/houseMotion.ts`. Booking has no scroll entrance. Reduced motion
  snaps slabs open and skips the tick. No second pin. No `cineEase` below the pin.
  No `whileInView`. No `transitions-parts`.
- **Site rail is page-level and fixed from frame one.** `HouseRail` sits in
  `app/page.tsx` (wordmark → `#top`). Film `Navigation` is no longer mounted.
  Do not put a second rail back inside `AfterPin`. Do not restore
  "shop-rail after the pin only" — `CLAUDE.md` and `DESIGN_DIRECTION.md` were
  aligned 2026-09-10. Loading readout sits under `--house-rail-h`.
- **4K decode relief, same night.** `.film-stage.is-covered` hides video + grain
  once `.after-pin` covers the film. Grain has no `mix-blend-mode`. Lenis is
  desktop-only (`preferNativeScroll` in `lenis.ts`). `SEEK_EPSILON` is `2/24` in
  `sceneTimeline.ts`, with an adaptive gate + 20 Hz floor in `useScrollProgress`.
  Do not put `SEEK_EPSILON` back to `0.02` unless they ask.
- **Booking composer stays.** SMS / Calendly logic is intact; only the surface changed.
- **Do not restore `ScrollTrigger` `pin` / `anticipatePin` on the film.** Progress comes
  from an empty runway. Film is `.film-stage` (`position: fixed`, no transform).
- **No 3D transform on `<video>`.** `translateZ(0)` blacks iOS and can rasterize 4K at
  CSS size on desktop. `.film-scrub { transform: none; }`.
- **Desktop picker:** landscape, `innerWidth >= 900`, short side ≥ 500, not tablet.
  No DPR / height gate (a windowed 1× monitor still gets 4K).

## Served pair (`FILM` in `lib/scene/sceneTimeline.ts`)
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

1080 fallback (4K miss only)
  public/video/lambo-wash-full-scrub-take1-trim-upres-1080-grade-crf21-faststart.mp4
```

Do not re-upload 4K to Blob unless Range breaks again. Do not hand 4K to a phone.

Production https://carwasher.vercel.app was promoted 2026-09-09 to the 4K commit
(`dpl_HzWQnZc4GFJCsJH4mAdLjzjBitnm`). Previews are SSO-gated — share production only.
Git push deploys a preview; promote that. Do not `vercel --prod` from this tree.

**Custom domain (done 2026-09-09 — do not redo attach):**
- Apex `https://ctluxurydetails.com` and `www.ctluxurydetails.com` are on Vercel
  project `carwasher` (team `theempps-projects`), production, not a preview branch.
- Redirect: `www` → apex, 308.
- Registrar: GoDaddy. Nameservers stay `ns69.domaincontrol.com` /
  `ns70.domaincontrol.com`. Do not move NS to Vercel.
- Records (rank 1 for this project): A `@` → `216.198.79.1` and `64.29.17.1`;
  CNAME `www` → `ddb3d890badd77c3.vercel-dns-017.com`.
- Designer signed the live domain 2026-09-09 ("everything is good here").
  `carwasher.vercel.app` stays as a working alias.

## Already done — do not redo
P1 one-seek-in-flight · P2 grade bake · P3 ignoreMobileResize · P4a scrollerProxy
removed · P5 lenis refcount · P6 loading readout · P8 grain/scrim · booking composer
scaffold · nav invert · document rail · Trust reveal · Before/After 4K loupe ·
MotionProvider · C4 tablet exclusion · C1 seek floor (now `2/24`, was 0.02) · faststart 720+1080 ·
iOS poster/unlock · video Cache-Control immutable · v3.1.2 fixed film layer (no
GSAP pin on `<video>`) · v3.1.3 desktop 4K + Blob Range + no `translateZ` on video ·
custom domain `ctluxurydetails.com` on project `carwasher` (www → apex) ·
HOUSE clip handoffs + sequence tick · film hidden when covered · no grain blend ·
no Lenis on phones · `SEEK_EPSILON` `2/24` + adaptive gate.

## Next (edits on the locked HOUSE — not more film)
The 25.33s trim is the whole hero. Do not generate remainder, rinse, or a new upres
unless the designer types a standalone `GO` after a quoted cost.

Start from this locked look **and** the shipped HOUSE motion. Do not restyle the
whole house. Do not add a second motion library.

1. **Edits they name** — type, colour, section order, buttons, copy, or motion feel
   (tune `houseMotion.ts` / station CSS). Look docs + vault win.
2. **Signed words** — station copy in `sceneTimeline.ts`, house headline
   ("The standard on your street."), frame labels, booking tier names. Placeholder
   until signed. Never invent prices, turnaround, or "spotless / finished / after."
3. **Booking channel** — SMS is `+14752898400`. Calendly page is still empty. Wire the
   calendar when the owner names it. No backend.
4. **Real iPhone check** — still owed on production after the next promote. Confirm
   the 720 file paints (not black) **and** that native scroll (no Lenis) still scrubs.
   Desktop 4K is already signed.
5. C2 (gate scroll until buffered) and C3 (drop extra ScrollTrigger.update) stay
   gated unless the designer asks. The adaptive seek gate is already in.

## Standing constraints
Branch `cursor/nextjs-agent-rules`, never `main`. Repo `github.com:theempp/carwasher.git`.
Vercel project `carwasher`. Public production: https://ctluxurydetails.com
(www 308s here). Alias still live: https://carwasher.vercel.app.
Vertical only, damping k=0.09, `cineEase` in `easing.ts` only. Never hard-code scene %
outside `sceneTimeline.ts`. Media stays behind `<CinematicStage>`. Missing media →
labeled placeholder, never a fake claim. ESTATE overlay + HOUSE tokens below the pin;
film in full native colour. **No new dependencies.** No Higgsfield unless the latest
user message is a standalone line `GO`. Never overwrite a media file. Never hand 4K
to a phone.

Do not drive the owner's Chrome. Headless on port **9333**, own profile
`/tmp/chrome-cinematic-9333`, against **`http://localhost:3000`** (not `127.0.0.1`).
KCS already holds 3001; EP holds 3002. This job's `dev` is on **3000**.
