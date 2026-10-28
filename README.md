# Cosmic Reels

A separate React project for generating Instagram-ready cosmic videos. The star field is the same idea as the portfolio canvas — random 3D points, a dust lane, a night-flight camera — but every motion is driven by the current video frame so it can be exported as MP4.

This is not a website. It is a [Remotion](https://www.remotion.dev) studio: preview in the browser, then render H.264 files at Instagram sizes.

## Why Remotion instead of recording the portfolio canvas

The portfolio sky is a live WebGL loop (`useFrame` + scroll). That looks right in a browser and is a poor source of video: frame times drift, mouse/scroll change the shot, and `MediaRecorder` cannot scrub or re-render one frame.

[Remotion](https://www.remotion.dev) plus [`@remotion/three`](https://www.remotion.dev/docs/three) keep React Three Fiber, but **animations must use `useCurrentFrame()`**. No `useFrame()`. That is required so Studio can scrub and `npx remotion render` captures the same image every time.

## Stack

| Piece | Why |
| --- | --- |
| Remotion 4 + `@remotion/three` | Frame-accurate MP4 from React |
| Three.js + React Three Fiber | Same renderer as the portfolio sky |
| `@react-three/drei` `Points` / `PointMaterial` | Star and dust clouds |
| `remotion` `random()` | Seeded stars so frames do not flicker |

**Not used (on purpose):**

- `@react-three/postprocessing` — bloom/vignette often tick inside `useFrame`, which Remotion disables while rendering (`frameloop: 'never'`). Glow is faked with point size and additive-looking opacity for now.
- Theatre.js / GSAP — extra timeline tools; Remotion already is the timeline.
- CCapture.js / canvas-record — weaker than Remotion for this workflow.

Later, if you need heavier GPU clouds, look at custom GLSL (simplex nebula, FBO particle ping-pong). Keep those shaders reading `uTime = frame / fps`, never a running clock.

## Instagram format

Every shot is a **Reel** — 1080×1920 (9:16), 15 seconds at 30 fps. Studio shows that size; **Render exports at 2×** (2160×3840) so the file stays sharp after Instagram compression.

Pick a `*Reel` composition in Studio, then render. Example: `M82GlideReel`, `OrionReel`.

Titles sit in the lower safe zone so Reels UI (caption bar, like column) does not cover them.

## Scenes

| Composition | Shot |
| --- | --- |
| `NebulaFlyReel` | N49 — slow push in |
| `N49RevealReel` | N49 — pull back to the star field |
| `SouthernCrabOrbitReel` | Southern Crab — orbit |
| `StarNurseryRiseReel` | Star nursery — vertical rise |
| `Snr0519PunchReel` | SNR 0519 — punch in from the wide field |
| `Snr1006TrackReel` | SN 1006 — pan along the ribbon |
| `M82GlideReel` | Messier 82 — glide along the disk |
| `NightFlightReel` | Portfolio-style star flight |
| `MeteorShowerReel` | Flight + meteor trails |
| `SupernovaReel` | Core flash and expanding shell |
| `BlackHoleReel` | Event horizon and spinning disk |

Plus **42 more stills** from official Hubble / JWST / Cassini files in `src/assets/stills/deep/` — Pillars, Orion, Carina, Whirlpool, Stephan's Quintet, Cartwheel, Cosmic Cliffs, and more. Search Studio for names like `OrionReel`, `WhirlpoolReel`, `StephansQuintetReel`.

Stills live in `src/assets/stills/`. Clips are clean by default: no title, no NASA/Hubble overlay. Turn on `showCredit` in Studio only if you want the agency line. Fill `title` only if you want a name on screen.

Change `title` and `seed` on the procedural clips to make a new variation.

## Commands

```bash
cd cosmic-reels
npm run dev                 # Remotion Studio
npx remotion render NightFlightReel out/night-flight-reel.mp4
npx remotion render MeteorShowerReel out/meteor-shower-reel.mp4
npx remotion render SupernovaReel out/supernova-reel.mp4
npx remotion render BlackHoleReel out/black-hole-reel.mp4
npx remotion render NebulaFlyReel out/nebula-fly-reel.mp4
```

Chrome must use the Angle GL backend (already set in `remotion.config.ts`) or Three.js will not render on the CLI.

## Next clips to add

- Galaxy merger (two disks, slow approach)
- Solar flare along a magnetized loop
- Pulsar beacon (periodic beam)
- Aurora over a dark planet limb

All of those stay in this repo as new `event` values, not a second app.
