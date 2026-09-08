# Luxury Automotive Detailing — Master Claude Code Build Plan

> Master implementation brief for Claude Code. This document preserves the full technical direction, workflow, architecture, performance rules, tooling, and implementation philosophy from the original 3D website build plan, adapted to the detailing-business experience defined in this project.

---

# 1. Purpose

Build a **premium, cinematic, scroll-driven 3D automotive detailing website**.

This is not a conventional marketing website and must not feel like a SaaS landing page, dashboard, template, or generic service-business site.

The user should feel like they are controlling an **interactive detailing film**.

The core idea:

`DIRTY CAR → EXTERIOR WASH → INTERIOR DETAIL → CLEAN REVEAL → DRIVE AWAY → CLOUD/SKY TRANSITION → BOOK`

The **car is the visual anchor**. The detailing process itself is the navigation.

The user's scrolling should control the story, camera, car movement, cleaning actions, environment, typography, and transitions as one continuous cinematic system.

The user should not think:

> "I'm scrolling through website sections."

They should think:

> **"I'm moving through the detailing process."**

---

# 2. Core Experience

The website uses **horizontal/sideways visual progression**.

The user scrolls normally with a mouse wheel, trackpad, or touch gesture, but the visual experience moves **laterally through the scene** rather than behaving like a normal vertically stacked website.

Conceptually:

```text
USER SCROLL
     |
     v
SCROLL PROGRESS
     |
     +----------------------+
     |                      |
     v                      v
HTML STORY             3D EXPERIENCE
     |                      |
     v                      v
TEXT / LABELS        CAR / CAMERA / WASH
     |                      |
     +----------+-----------+
                |
                v
       ONE CINEMATIC EXPERIENCE
```

Scroll should behave like a **timeline scrubber**.

The user is effectively scrubbing through a pre-designed cinematic sequence.

The animation must feel continuous rather than like separate webpage sections.

---

# 3. Primary Visual Reference

Use the supplied car-wash reference image as the primary visual/art-direction reference.

## Main Camera

The website should **open on a side/front three-quarter view matching the supplied reference**.

This is the main camera composition and visual anchor.

Important:

- Keep this camera angle stable through most of the exterior process.
- Do not constantly orbit the car.
- The exterior cleaning should happen *to the car* while the primary camera composition remains strong.
- Camera movement becomes more important when transitioning into the interior.
- Return to the front-facing reveal after the interior is complete.
- Only then swing around to the rear for the departure.

The reference establishes:

- dramatic dark wash environment
- wet reflective floor
- controlled automotive lighting
- visible water/mist
- realistic vehicle proportions
- premium automotive-commercial atmosphere
- strong side/front three-quarter composition

The result should feel realistic and cinematic, never game-like.

---

# 4. Visual Direction

The design language is:

```text
AUTOMOTIVE
+
LUXURY
+
FASHION
+
EDITORIAL
+
3D
+
CINEMA
```

Not:

```text
STARTUP
+
SAAS
+
DASHBOARD
+
GENERIC DETAILING TEMPLATE
```

## Foundation

- Black
- White
- Soft gray
- Deep navy
- One restrained electric accent

## Typography

Use:

- large display typography
- strong condensed/modern headline treatment where appropriate
- small technical labels
- wide spacing
- minimal body copy
- high contrast
- editorial composition

Typography should feel integrated with the 3D scene.

Do not cover the vehicle with excessive UI.

## UI

Use only what is necessary:

- logo
- small navigation
- progress indicator
- CTA
- minimal labels
- booking controls when the cinematic sequence ends

Avoid:

- excessive cards
- excessive rounded containers
- excessive glassmorphism
- generic SaaS gradients
- UI clutter
- decorative components with no purpose

---

# 5. Detailing Storyboard

## Scene 01 — Hero / Entry

The website opens immediately on the supplied reference-style camera angle.

The car is positioned in the wash environment.

The scene should establish:

- vehicle
- wet floor
- wash infrastructure
- atmospheric mist
- dramatic lighting
- premium composition

The car can begin dirty/wet before the detailing process starts.

The first scroll should begin moving the car through the process.

---

## Scene 02 — Exterior: Wheel/Rim Cleaning

The primary camera remains close to the hero composition.

The wheels become the visual focus through the action itself.

Sequence:

1. Cleaning foam is sprayed onto the rims.
2. Foam visibly coats the wheel.
3. The cleaning action is visible and satisfying.
4. Water/pressure rinses the foam away.
5. The wheel becomes visibly clean.

The animation can be stylized for clarity but should remain believable.

---

## Scene 03 — Exterior: Full Vehicle Wash

Continue the exterior process.

Sequence:

1. Full vehicle receives a spray-down.
2. Foam progressively covers the car.
3. The entire exterior becomes covered in suds.
4. Pressure/water rinse clears the foam.
5. Water runs off the vehicle.
6. Paint becomes visibly clean and reflective.

The primary side/front three-quarter camera remains the dominant composition.

The user should clearly understand that a complete exterior detail has occurred without needing explanatory copy.

---

## Scene 04 — Camera Transition to Interior

Once the exterior is clean:

1. Camera begins moving toward the front of the car.
2. Camera movement becomes more dynamic.
3. All doors swing open.
4. Carpets/mats come out and fly outward dramatically.
5. The camera continues around the vehicle toward the opposite side.

This is the first major camera orbit.

The transition must feel like one continuous shot.

Avoid obvious camera cuts.

---

# 6. Interior Detailing Sequence

The interior process should feel like a **fast, precise, imaginary cinematic sequence**.

Nobody should be visibly performing the work.

Tools, cleaning actions, vacuum effects, wipes, water, or other mechanisms may appear to operate automatically.

The objective is to make the cleaning process visually satisfying rather than mechanically literal.

Show:

1. Floors being vacuumed.
2. Door panels being wiped/cleaned.
3. Seats being wiped/cleaned.
4. Dashboard being wiped/cleaned.
5. Other visible interior surfaces being restored as appropriate.
6. Carpets/mats returning.
7. Interior components reassembling.

The sequence should feel:

- fast
- precise
- satisfying
- premium
- cinematic
- slightly exaggerated
- visually understandable

Do not make it cartoonish.

Do not show a human detailer unless a later project decision explicitly requires one.

---

# 7. Interior Completion / Front Reveal

This timing is important.

As the interior process finishes:

- interior components return to their final positions
- doors close/reassemble as appropriate
- the camera moves into the front position
- **the camera must be in front of the car at the exact moment the interior cleaning process completes**

This should create a synchronized reveal:

`INTERIOR FINISHES = FRONT CAMERA ARRIVES`

Then hold the clean vehicle long enough for the result to register.

This is the main "before → after" payoff.

---

# 8. Rear Departure

After the front clean-car reveal, the user keeps scrolling.

The camera then swings around the vehicle toward the rear.

The vehicle begins driving away.

The camera follows the car enough to communicate movement while preserving cinematic framing.

The car should feel like it is leaving the detailing environment.

---

# 9. Cloud / Sky Transition

Do **not** use a literal sci-fi portal.

Do not make the transition look like:

- Minecraft
- a game
- a glowing fantasy doorway
- a generic sci-fi wormhole

Instead, create a realistic cinematic opening/window into:

- bright sky
- soft clouds
- atmospheric light
- subtle horizon
- natural brightness

The car drives toward and through this bright environment.

The visual language should feel like a luxury automotive commercial or dream sequence.

As the car disappears into the bright cloud/sky environment, transition naturally into the booking experience.

---

# 10. Booking CTA

The final CTA should feel like the conclusion of the cinematic experience.

Example:

**READY FOR YOUR CAR TO LEAVE LIKE THIS?**

`BOOK YOUR DETAIL`

The booking UI should remain clean, premium, and conversion-focused.

Do not suddenly switch to a generic form-heavy business website.

The transition from 3D experience → booking should feel intentional.

---

# 11. Scroll Mapping

Use centralized scroll progress.

The exact percentages must remain tunable.

Initial conceptual mapping:

```text
0–15%    Hero / entry
15–35%   Wheel/rim cleaning
35–55%   Full exterior foam + rinse
55–65%   Camera move + interior reveal
65–85%   Interior cleaning
85–90%   Interior reassembly + front reveal
90–97%   Rear camera + departure
97–100%  Cloud/sky transition + booking CTA
```

These are starting values, not rigid requirements.

Adjust timing if the visual pacing is better.

Do not hard-code timing throughout unrelated components.

Create a centralized configuration.

Example:

```ts
const sceneTimeline = [
  {
    start: 0,
    end: 0.15,
    scene: "hero",
    camera: "hero-three-quarter",
  },
  {
    start: 0.15,
    end: 0.35,
    scene: "wheel-clean",
    camera: "hero-three-quarter",
  },
  {
    start: 0.35,
    end: 0.55,
    scene: "exterior-wash",
    camera: "hero-three-quarter",
  },
  {
    start: 0.55,
    end: 0.65,
    scene: "interior-reveal",
    camera: "front-transition",
  },
  {
    start: 0.65,
    end: 0.85,
    scene: "interior-detail",
    camera: "interior-opposite-side",
  },
  {
    start: 0.85,
    end: 0.9,
    scene: "clean-reveal",
    camera: "front",
  },
  {
    start: 0.9,
    end: 0.97,
    scene: "departure",
    camera: "rear",
  },
  {
    start: 0.97,
    end: 1,
    scene: "sky-transition",
    camera: "rear-wide",
  },
];
```

The exact implementation can change depending on whether the 3D layer uses Spline or React Three Fiber.

---

# 12. Camera Design

The original build plan emphasizes multiple camera states with smooth transitions. Preserve that principle, adapted to the car.

Suggested states:

```text
CAMERA_01
Hero side/front three-quarter

CAMERA_02
Wheel/detail emphasis

CAMERA_03
Front transition

CAMERA_04
Interior opposite-side view

CAMERA_05
Front clean reveal

CAMERA_06
Rear departure

CAMERA_07
Rear wide / cloud transition
```

The hero camera should be the dominant composition.

Camera transitions must:

- ease into movement
- maintain cinematic framing
- avoid nausea-inducing rotation
- keep the vehicle readable
- use depth and perspective
- move with purpose
- avoid unnecessary orbiting
- avoid obvious cuts
- return attention to the car at important moments

The camera is part of the storytelling system.

---

# 13. Recommended Technology Stack

## 3D Creation

### Blender
Optional/custom 3D modeling, cleanup, optimization, materials, environment creation, and asset preparation.

### Mixamo
Originally used for character auto-rigging and motion-capture animations. Preserve as part of the available 3D workflow/tooling knowledge, but the detailing experience does **not** require a visible character.

### Spline
Recommended first implementation route for the 3D scene, camera states, lighting, animation, and scroll-driven interactions.

## Web Application

- Next.js + React — production framework
- TypeScript — type safety
- Tailwind CSS — UI/layout where useful
- GSAP + ScrollTrigger — advanced scroll choreography and HTML/3D synchronization

## Advanced 3D Route

- Three.js
- React Three Fiber
- @react-three/drei

Move toward this route when Spline becomes too limiting and full WebGL control is required.

## Development

- Cursor — primary code editor/IDE
- Claude Code — AI coding agent responsible for implementation, debugging, refactoring, and extension
- Git/GitHub — source control

## Deployment

- Vercel — Next.js hosting/deployment

---

# 14. Important Architecture Decision

Do **not** begin by manually coding a complicated Three.js experience.

Use the fastest reliable prototype route first:

```text
3D CAR / ASSETS
      ↓
BLENDER (if needed)
      ↓
SPLINE
      ↓
NEXT.JS + REACT
      ↓
GSAP + SCROLLTRIGGER
      ↓
CURSOR + CLAUDE CODE
      ↓
VERCEL
```

Once the interaction and art direction are proven, evaluate migrating the 3D layer toward:

```text
React Three Fiber
+
Three.js
+
Drei
+
GSAP ScrollTrigger
```

This gives a fast prototype first and maximum creative/technical control later.

---

# 15. Spline Prototype

Spline is the recommended initial implementation because it can handle scroll-driven transitions without requiring the entire WebGL engine to be built manually.

Use:

- Objects
- States
- Actions
- Camera states
- Animation actions
- Scroll events
- Viewer export

Spline's scroll behavior should be connected to the website's global scroll progression where appropriate.

## Prototype Goal

The first meaningful milestone is:

> **The car and wash sequence respond smoothly to user scrolling, with camera and cleaning states synchronized into one continuous experience.**

Do not build the entire finished website first.

Prove the core interaction before adding advanced effects.

---

# 16. When to Use Three.js / React Three Fiber

Evaluate migration from Spline when the project needs:

- more precise camera mathematics
- custom shaders
- advanced post-processing
- custom lighting systems
- dynamic objects
- complex physics
- custom animation blending
- precise HTML/WebGL synchronization
- advanced performance optimization
- full control over the rendering pipeline

Production architecture:

```text
                    NEXT.JS
                       |
             +---------+---------+
             |                   |
          HTML/UI             WEBGL
             |                   |
          React              R3F / Three
             |                   |
       GSAP timeline      Camera / Scene
             |                   |
             +---------+---------+
                       |
                 Scroll Progress
```

This is the path for maximum creative control.

---

# 17. GSAP + ScrollTrigger

GSAP should control website-level cinematic choreography.

ScrollTrigger is useful for:

- scrubbing animations with scrolling
- pinning sections
- triggering animations
- tracking scroll progress
- coordinating multiple animations
- synchronizing HTML and 3D animation

Conceptual flow:

```text
window scroll
     |
     v
ScrollTrigger
     |
     v
timeline.progress()
     |
     +----------+
     |          |
     v          v
HTML         3D Scene
text         camera
opacity      car movement
position     cleaning
scale        environment
             effects
```

The scroll should feel like a timeline scrubber.

Do not create unrelated animation timelines for every section.

Use a master timeline/configuration with tunable scene states.

---

# 18. Project Structure

Use this as the initial target, adapting names from the original character-oriented structure to the detailing experience:

```text
detailing-3d/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   └── components/
│       ├── navigation/
│       │   └── Navigation.tsx
│       │
│       ├── experience/
│       │   ├── Experience.tsx
│       │   ├── ExperienceCanvas.tsx
│       │   ├── ExperienceOverlay.tsx
│       │   └── LoadingScreen.tsx
│       │
│       ├── sections/
│       │   ├── HeroSection.tsx
│       │   ├── ExteriorSection.tsx
│       │   ├── InteriorSection.tsx
│       │   ├── RevealSection.tsx
│       │   └── BookingSection.tsx
│       │
│       └── ui/
│           ├── Button.tsx
│           ├── Logo.tsx
│           └── SectionLabel.tsx
│
├── components/
│   └── 3d/
│       ├── Car.tsx
│       ├── CameraRig.tsx
│       ├── Environment.tsx
│       ├── Lighting.tsx
│       ├── ExteriorWash.tsx
│       ├── InteriorDetail.tsx
│       └── Scene.tsx
│
├── lib/
│   ├── animation/
│   │   ├── scrollTimeline.ts
│   │   └── easing.ts
│   │
│   ├── scene/
│   │   ├── sceneConfig.ts
│   │   └── cameraConfig.ts
│   │
│   └── utils/
│
├── public/
│   ├── models/
│   │   ├── cars/
│   │   └── environment/
│   │
│   ├── textures/
│   ├── images/
│   ├── videos/
│   └── fonts/
│
├── spline/
│   ├── README.md
│   └── exports/
│
├── docs/
│   ├── EXPERIENCE.md
│   ├── ANIMATION.md
│   ├── 3D_ASSETS.md
│   └── PERFORMANCE.md
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

Keep the 3D layer isolated from the rest of the application.

---

# 19. Initial Software Setup

Install/use:

1. Node.js
2. Git
3. Cursor
4. Claude Code
5. Blender
6. Mixamo access when needed
7. Spline account
8. GitHub account
9. Vercel account

Node.js should satisfy the current Next.js requirement.

Example:

```bash
npx create-next-app@latest detailing-3d
```

Choose:

```text
TypeScript: Yes
ESLint: Yes
Tailwind: Yes
App Router: Yes
src directory: No
Import alias: Yes
```

Then:

```bash
cd detailing-3d
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 20. Animation / 3D Dependencies

For the advanced route:

```bash
npm install three @react-three/fiber @react-three/drei gsap
```

Add other dependencies only when they are actually needed.

Do **not** install a giant collection of animation/3D libraries at the beginning.

Prefer the smallest reliable dependency set.

---

# 21. Git Setup

Initialize source control immediately:

```bash
git init
git add .
git commit -m "Initial detailing 3D experience"
```

Create a private GitHub repository.

Then connect it:

```bash
git remote add origin YOUR_REPOSITORY_URL
git branch -M main
git push -u origin main
```

Do not commit:

```text
.env.local
large raw 3D source files
private credentials
API keys
```

---

# 22. Claude Code Workflow

Claude Code should **not** be told to build the entire finished website in one giant prompt.

Use milestones.

This makes the AI easier to control and reduces wasted tokens.

## Milestone 01
Create the Next.js foundation.

## Milestone 02
Create the horizontal/cinematic scroll structure.

## Milestone 03
Create the 3D scene placeholder / Spline integration boundary.

## Milestone 04
Synchronize scroll and camera.

## Milestone 05
Implement the car/exterior wash sequence.

## Milestone 06
Implement the interior reveal and cleaning sequence.

## Milestone 07
Implement the clean front reveal, rear departure, and cloud transition.

## Milestone 08
Add typography and editorial content.

## Milestone 09
Add transitions and cinematic polish.

## Milestone 10
Optimize desktop.

## Milestone 11
Optimize mobile.

## Milestone 12
Add loading experience.

## Milestone 13
Add SEO, accessibility, metadata, error handling, and analytics if needed.

## Milestone 14
Production build and Vercel deployment.

Do not move ahead to unrelated features before the current milestone works.

---

# 23. Claude Code Operating Rules

Claude Code is the primary implementation agent.

### Personality / Decision Making

**Be confident, decisive, and proactive.**

Do not repeatedly ask for permission to make reasonable design or engineering decisions.

When the intended direction is clear:

- implement it
- choose the cleanest reasonable solution
- keep moving
- explain important decisions briefly

Only stop and ask a question when ambiguity is genuinely blocking implementation or would materially change the product.

Do not use uncertainty as an excuse to avoid making normal implementation decisions.

### Engineering Rules

1. Inspect existing files before modifying them.
2. Do not rewrite unrelated components.
3. Do not introduce dependencies without explaining why.
4. Keep 3D logic isolated.
5. Keep animation configuration centralized.
6. Keep responsive behavior intentional.
7. Test after major changes.
8. Fix TypeScript errors immediately.
9. Never invent asset paths.
10. Never pretend a 3D asset exists when it has not been provided.
11. Build incrementally.
12. Optimize only after measuring the actual bottleneck.
13. Prefer simple architecture over clever architecture.
14. Preserve the cinematic visual direction.
15. Never turn the experience into a generic SaaS landing page.
16. Do not add extra features until the core experience works.
17. Do not scatter Spline-specific APIs throughout the application.
18. Keep a clean abstraction between the website and the 3D engine.
19. Do not fake advanced 3D behavior when the current asset/engine cannot support it.
20. If an asset is missing, create a clearly labeled placeholder and continue with the surrounding architecture.
21. Never silently replace the intended art direction with a generic implementation.
22. Keep code modular and easy to extend.
23. Prefer deterministic, tunable animation configuration.
24. Validate the actual result rather than assuming it works.

---

# 24. First Claude Code Prompt

After the Next.js project exists:

```text
You are the lead frontend engineer for a premium cinematic automotive detailing website.

Read the project structure before making changes.

We are building an interactive 3D detailing experience controlled primarily by horizontal/sideways scroll.

CORE EXPERIENCE:
The user scrolls through one continuous cinematic sequence:
dirty car → exterior wash → interior detail → clean reveal → drive away → bright cloud/sky transition → booking CTA.

The car is the visual anchor.

The website must NOT look like:
- a SaaS dashboard
- a generic startup landing page
- a template
- a conventional detailing-business website

The target experience is an interactive automotive film.

VISUAL DIRECTION:
- Use the supplied car-wash reference as the primary visual reference.
- Open on a side/front three-quarter vehicle camera matching the reference.
- Keep this camera stable through most of the exterior wash.
- Dramatic dark wash environment.
- Wet reflective floor.
- Realistic water, foam, mist, and automotive lighting.
- Premium automotive-commercial quality.
- Black/white/soft-gray/deep-navy foundation.
- One restrained electric accent.
- Oversized editorial typography.
- Minimal UI.
- No excessive cards.
- No excessive glassmorphism.
- No generic SaaS gradients.
- No clutter.
- No game-like visual language.

SEQUENCE:
1. Hero/entry.
2. Rim cleaning: foam → coverage → rinse.
3. Full exterior: spray → full foam → pressure rinse → clean reflective paint.
4. Camera moves to front.
5. Doors open.
6. Carpets/mats fly out.
7. Camera moves around to opposite side.
8. Fast imaginary interior cleaning with nobody visible:
   - floors vacuumed
   - doors wiped
   - seats wiped
   - dashboard wiped
9. Interior reassembles.
10. Camera arrives at the front exactly as the interior process finishes.
11. Hold clean reveal.
12. Camera swings to rear.
13. Car drives away.
14. Car approaches a realistic bright opening into sky/clouds.
15. Car disappears into the light.
16. Transition to premium booking CTA.

IMPORTANT:
Do not use a literal sci-fi portal.
Do not make it Minecraft-like or game-like.

ARCHITECTURE:
Use:
- Next.js
- React
- TypeScript
- Tailwind where appropriate
- GSAP + ScrollTrigger
- Spline initially for 3D

Keep the architecture ready for React Three Fiber / Three.js / Drei later.

Create:
- Navigation
- Cinematic scroll container
- Hero
- Exterior sequence structure
- Interior sequence structure
- Clean reveal
- Departure
- Cloud transition
- Booking section
- 3D experience boundary
- Scroll progress state
- Centralized master timeline
- Responsive layout
- Loading state

Do NOT invent finished 3D assets.

If an asset is not provided, use a clearly labeled placeholder.

FIRST TASK:
Build the application architecture and scroll system first.
Do not attempt the entire final 3D implementation in one step.

After changes:
1. Run the project.
2. Check TypeScript.
3. Check lint.
4. Check responsive behavior.
5. Explain files created/changed.
6. Do not proceed to unrelated features.

Be confident and decisive. Make reasonable implementation decisions without repeatedly asking for permission.
```

---

# 25. Spline Integration Prompt

After the first milestone works:

```text
Now integrate the Spline 3D experience.

I will provide the Spline scene/export.

Requirements:
- Keep the 3D experience persistent while the user scrolls.
- Connect webpage scroll progression to the 3D timeline.
- Keep Spline isolated inside the Experience layer.
- Do not scatter Spline-specific code throughout the application.
- Create a clean abstraction so the rest of the website does not depend directly on Spline APIs.
- Do not recreate the 3D scene in HTML.
- Do not invent Spline objects, states, or asset paths.

Camera intent:
- Hero: side/front three-quarter reference angle.
- Exterior: primarily stable hero angle.
- Interior transition: move toward front.
- Interior: move around to opposite side.
- Completion: arrive at front.
- Departure: move toward rear.
- Final: rear/wide transition toward sky/cloud environment.

Do not add fake camera movements if the Spline scene does not expose the required states.

First inspect the Spline integration and determine the correct implementation.
Then implement the smallest reliable version.

Test desktop scrolling before adding advanced effects.
```

---

# 26. Cinematic Polish Prompt

Once the 3D interaction works:

```text
Now polish the experience into a premium cinematic automotive detailing website.

Prioritize:
1. Camera movement
2. Scroll synchronization
3. Car movement
4. Cleaning animation timing
5. Typography timing
6. Vehicle readability
7. Lighting
8. Composition
9. Performance
10. Mobile behavior

HTML and 3D should feel like one continuous experience.

Text should not simply appear as normal webpage sections.

Use:
- fade
- translate
- scale
- clip/reveal
- overlap
- exit
- re-enter

Use restrained motion.

Avoid:
- excessive bounce
- generic fade-ins everywhere
- random parallax
- unnecessary animations
- UI clutter
- fake effects
- game-like presentation

The experience should feel like a luxury automotive campaign or fashion film.

Keep the design minimal.
```

---

# 27. Performance Rules

3D websites can become extremely heavy.

Performance is a first-class requirement.

## Car / Geometry

Prefer:

- optimized geometry
- compressed textures
- limited material count
- reasonable polygon count
- reusable materials where appropriate

## Textures

Avoid enormous textures.

Use appropriate resolution for the actual visual size.

## Environment

Prefer:

- baked lighting where possible
- optimized geometry
- compressed assets
- limited real-time lights

## Effects

Do not add expensive post-processing simply because it is available.

Measure actual bottlenecks before optimizing.

## Mobile

Mobile should not attempt to render the exact same scene at desktop quality.

Strategy:

```text
Desktop:
Full cinematic 3D experience

Tablet:
Reduced effects

Mobile:
Optimized 3D experience
or simplified cinematic version
```

If performance becomes poor:

**prioritize storytelling and smooth interaction over visual complexity.**

---

# 28. Loading Experience

The 3D scene may take time to load.

Create a minimal loading state that feels like part of the brand.

Do not use a generic spinner if avoidable.

Concept:

```text
[BRAND]

PREPARING YOUR DETAIL...

[ loading progress ]
```

Once the scene is ready:

```text
ENTER
```

or automatically transition into the experience.

The loading experience should feel like the beginning of the film.

---

# 29. Mobile Strategy

Desktop is the primary cinematic version.

Mobile needs deliberate adaptation.

Desktop:

```text
Full camera choreography
+
Car
+
Environment
+
Cleaning effects
+
Full atmosphere
```

Mobile:

```text
Car
+
Simplified camera movement
+
Reduced environment
+
Reduced post-processing
```

Touch scrolling should still drive the story.

Do not require the user to manually drag the 3D scene.

The primary interaction remains **scrolling**.

If exact horizontal behavior is technically awkward on a particular device, preserve the visual lateral progression while mapping native touch scroll into the master timeline.

---

# 30. Visual Motion Rules

The original design philosophy is that every animation should earn its place.

Use cinematic restraint.

Avoid:

- excessive bounce
- random parallax
- generic scroll reveal animations
- unnecessary camera shake
- constant rotation
- excessive particles
- excessive glow
- decorative motion with no narrative purpose

The goal is:

**cinematic, not maximum effects.**

---

# 31. Asset Organization

Use:

```text
public/models/cars/
public/models/environment/
public/textures/
public/images/
public/videos/
public/fonts/
```

Name files clearly.

Examples:

```text
car_main.glb
car_exterior.glb
car_interior.glb
wheel_cleaning.glb
wash_environment.glb
cloud_transition.glb
```

Do not use names like:

```text
final_final_2.glb
newnew.glb
test123.glb
```

Never invent an asset path.

Never pretend an asset exists.

---

# 32. Advanced Effects — Later Only

Do not build these into the first prototype unless they are necessary.

Potential future effects:

- depth of field
- film grain
- volumetric fog
- custom shaders
- chromatic aberration
- motion blur
- particles
- dust
- water particles
- headlight beams
- dynamic shadows
- environment transitions
- animated cars
- moving lights
- reflections
- procedural materials
- camera shake at specific moments
- speed ramping
- animation blending
- dynamic weather
- day/night transitions

Every effect must earn its place.

The goal is **cinematic**, not "maximum effects."

---

# 33. Recommended Build Order

Follow this sequence.

## Phase 01 — Foundation

- [ ] Create Next.js app
- [ ] Install dependencies
- [ ] Initialize Git
- [ ] Create project structure
- [ ] Create navigation
- [ ] Create scroll sections

## Phase 02 — Scroll System

- [ ] Add GSAP
- [ ] Add ScrollTrigger
- [ ] Create master scroll timeline
- [ ] Create section progress
- [ ] Test scrub behavior
- [ ] Add text transitions

## Phase 03 — Vehicle / Assets

- [ ] Choose/create vehicle asset
- [ ] Optimize vehicle
- [ ] Prepare exterior/interior geometry if needed
- [ ] Prepare wash environment
- [ ] Prepare cleaning-related assets/effects
- [ ] Import into Spline

## Phase 04 — 3D Scene

- [ ] Build environment
- [ ] Add lighting
- [ ] Add car
- [ ] Add camera
- [ ] Create camera states
- [ ] Create exterior wash states
- [ ] Create interior states
- [ ] Test animation

## Phase 05 — Scroll + 3D

- [ ] Connect webpage scroll
- [ ] Connect car progression
- [ ] Connect camera progression
- [ ] Connect cleaning states
- [ ] Synchronize HTML and 3D
- [ ] Tune easing
- [ ] Tune camera distance
- [ ] Tune section timing

## Phase 06 — Art Direction

- [ ] Typography
- [ ] Color system
- [ ] Editorial composition
- [ ] Automotive visuals
- [ ] Lighting
- [ ] Atmosphere

## Phase 07 — Performance

- [ ] Optimize models
- [ ] Compress textures
- [ ] Test mobile
- [ ] Test low-power devices
- [ ] Add fallback strategy
- [ ] Add loading state

## Phase 08 — Production

- [ ] SEO
- [ ] Metadata
- [ ] Accessibility
- [ ] Analytics if needed
- [ ] Error handling
- [ ] Production build
- [ ] Vercel deployment

---

# 34. Future Advanced Version

Once the Spline prototype is successful, evaluate moving the 3D layer to:

```text
React Three Fiber
+
Three.js
+
Drei
+
GSAP ScrollTrigger
```

Production architecture:

```text
                    NEXT.JS
                       |
             +---------+---------+
             |                   |
          HTML/UI             WEBGL
             |                   |
          React              R3F / Three
             |                   |
       GSAP timeline      Camera / Scene
             |                   |
             +---------+---------+
                       |
                 Scroll Progress
```

This is the path for maximum creative control.

---

# 35. Definition of Done — Prototype 01

Prototype 01 is successful when:

1. The page loads.
2. The main vehicle is visible.
3. The vehicle remains readable.
4. The user can scroll normally.
5. Scroll controls the cinematic timeline.
6. The visual experience progresses laterally.
7. The hero camera matches the supplied reference direction.
8. The exterior sequence visibly communicates wheel cleaning.
9. The exterior sequence visibly communicates full foam + rinse.
10. The camera smoothly transitions into the interior sequence.
11. Doors open.
12. Carpets/mats exit.
13. Interior cleaning actions are visible.
14. Interior reassembles.
15. The camera reaches the front exactly as the interior sequence completes.
16. The clean vehicle reveal is clear.
17. The camera transitions toward the rear.
18. The vehicle drives away.
19. The vehicle transitions into the realistic cloud/sky opening.
20. The experience transitions naturally into the booking CTA.
21. There are no obvious section cuts.
22. Desktop performs smoothly.
23. Mobile has a usable optimized fallback.
24. The architecture is clean enough to replace Spline with R3F later.
25. No invented assets or fake implementation claims exist.

Do not add extra features until these requirements are working.

---

# 36. Token Optimization Rules for Claude Code

This project should be developed with **token efficiency as a first-class concern**, especially when using Claude Opus.

Claude Code should:

1. Read only the files relevant to the current task.
2. Avoid repeatedly restating the full project brief.
3. Keep shared configuration centralized.
4. Prefer small, targeted edits.
5. Avoid rewriting large files when a focused change is enough.
6. Avoid generating unnecessary documentation.
7. Avoid duplicate utility functions.
8. Reuse existing components.
9. Reuse existing animation configuration.
10. Do not introduce abstractions before they are useful.
11. Keep prompts milestone-specific.
12. Report changes concisely.
13. Do not dump entire files into explanations unless necessary.
14. Do not repeatedly explain already-established decisions.
15. Preserve existing working architecture.
16. When a task is clear, execute it rather than asking multiple confirmation questions.
17. Use the simplest reliable implementation first.
18. Defer advanced effects until the core interaction is proven.

**Important:** Token optimization must never mean removing required functionality or silently simplifying the intended visual experience.

Optimize communication and implementation overhead, not the product vision.

---

# 37. Original Tooling / Reference Knowledge

Use official documentation when implementing the stack.

- Next.js: https://nextjs.org/docs
- Spline: https://docs.spline.design/
- Spline Scroll Event: https://docs.spline.design/interaction-states-events-and-actions/events/scroll-event
- Spline Viewer: https://docs.spline.design/exporting-your-scene/web/exporting-as-spline-viewer
- Spline Code Export: https://docs.spline.design/exporting-as-code
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- React Three Fiber: https://r3f.docs.pmnd.rs/
- Three.js: https://threejs.org/docs/
- Mixamo: https://www.mixamo.com/
- Blender: https://www.blender.org/
- Cursor: https://cursor.com/
- Claude Code: https://docs.anthropic.com/en/docs/claude-code
- Vercel: https://vercel.com/

Prefer official documentation when implementation details are uncertain.

---

# 38. Final Direction

The most important principle from the original 3D build plan remains:

**Do not build a normal website with a 3D object added to it.**

Build a:

> **3D detailing experience that happens to be a website.**

The:

- car
- camera
- wash
- water
- foam
- interior
- typography
- lighting
- environment
- scroll
- transitions
- booking CTA

should feel like parts of the same cinematic system.

The user should not feel like they are moving between sections.

They should feel like they are physically moving through the detailing process.

The detailing process is the navigation.

The car is the character.

The scroll is the timeline.

The camera is the storyteller.

The final clean reveal is the payoff.

The booking CTA is the conclusion.

**That is the target experience.**
