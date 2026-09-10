# Next Session — pick up here (written 2026-09-09, after designer signed 4K)

The film and the scroll machine are signed. Desktop 4K stays. **No Higgsfield spend.**
Do not fire 1080 / 2K / 4K again. Do not revert desktop to 1080.

## Read in this order
1. `CLAUDE.md` — v3.1.3 banner, §2 (no pin on the film), §5–7, §10 (rules 11–15), §11.
2. `docs/BOOKING_COMPOSER.md` — page ending; blocked on owner words + channel.
3. `docs/DESIGN_DIRECTION.md` — ESTATE.
4. This file.

## The decisions already made — do not re-litigate
- **Mobile stays 720p, always.** Never hand an upres to a phone.
- **Desktop film is 4K, signed 2026-09-09.** Designer: "keep this version, it looks better."
  Localhost serves the gitignored faststart file; production/preview serve
  `FILM.scrubDesktopRemote` (Vercel Blob). 1080 is miss fallback only.
  Interior I-frames (~15–23s) can hitch — accepted. 4K JPGs remain the loupe.
- **Booking composer only.** The process ledger is cut. The page ends there.
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
MotionProvider · C4 tablet exclusion · C1 SEEK_EPSILON 0.02 · faststart 720+1080 ·
iOS poster/unlock · video Cache-Control immutable · v3.1.2 fixed film layer (no
GSAP pin on `<video>`) · v3.1.3 desktop 4K + Blob Range + no `translateZ` on video ·
custom domain `ctluxurydetails.com` on project `carwasher` (www → apex).

## Next (copy and channel — not more film)
The 25.33s trim is the whole hero. Do not generate remainder, rinse, or a new upres
unless the designer types a standalone `GO` after a quoted cost.

1. **Brand** — replace `[BRAND]` in `Navigation.tsx` and `app/layout.tsx` when the
   owner supplies the name (and a mark if they have one).
2. **Booking channel** — `BOOKING_HREF` in `BookingComposer.tsx` is still `#book`.
   Wire one real outbound (`sms:` / `tel:` / Instagram DM / Calendly / Square)
   when the owner names the channel and the destination. No backend.
3. **Signed words** — station copy in `sceneTimeline.ts`, Trust headline
   ("THE STANDARD ON YOUR STREET."), comparison labels (ARRIVAL / RINSED, DOOR
   CLOSED), booking tier names. Placeholder until signed. Never invent prices,
   turnaround, or "spotless / finished / after."
4. **Real iPhone check** — hard-refresh production after this promote. Confirm
   the 720 file paints (not black). Desktop 4K is already signed.
5. C2 (gate scroll until buffered) and C3 (drop extra ScrollTrigger.update) stay
   gated unless the designer asks.

## Standing constraints
Branch `cursor/nextjs-agent-rules`, never `main`. Repo `github.com:theempp/carwasher.git`.
Vercel project `carwasher`. Public production: https://ctluxurydetails.com
(www 308s here). Alias still live: https://carwasher.vercel.app.
Vertical only, damping k=0.09, `cineEase` in `easing.ts` only. Never hard-code scene %
outside `sceneTimeline.ts`. Media stays behind `<CinematicStage>`. Missing media →
labeled placeholder, never a fake claim. ESTATE tokens; film in full native colour.
**No new dependencies.** No Higgsfield unless the latest user message is a standalone
line `GO`. Never overwrite a media file. Never hand 4K to a phone.

Do not drive the owner's Chrome. Headless on port **9333**, own profile
`/tmp/chrome-cinematic-9333`, against **`http://localhost:3001`** (not `127.0.0.1`).
Dev is already on 3001 if 3000 is taken.
