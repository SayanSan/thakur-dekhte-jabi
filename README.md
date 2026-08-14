# THAKUR DEKHTE JABI?

A digital Pujo experience. Not a website — an entryway: an offbeat CCU
parking lot at night, a cinematic push into a pandal, Maa Durga, a live
count of everyone else in the room, and the Pujo playlist as the
soundtrack.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
  layout.tsx          fonts (Space Grotesk + Noto Serif Bengali), metadata
  page.tsx             scene state machine: arrival -> transitioning -> pandal
  globals.css          grain, vignette, flicker, smoke, toast keyframes
components/
  scenes/
    ArrivalScene.tsx           Scene 01 — CCU parking, title, Enter Pandal CTA
    EnterPandalTransition.tsx  cinematic push-in + flash overlay (GSAP)
    PandalScene.tsx            Scene 02 — idol, canopy, string lights, smoke, parallax
  DurgaIdol.tsx          stylized SVG idol
  PandalPeople.tsx        chair rows + seated silhouettes with idle sway/stand
  ForegroundCrowd.tsx     near-camera occlusion silhouettes (first-person framing)
  VisitorCounter.tsx      animated live count display
  MusicPlayer.tsx         custom docked player (see "The playlist" below)
  SoundController.tsx     persistent sound on/off toggle
  AmbientLayer.tsx        invisible audio orchestrator (traffic -> dhaak -> pandal)
  MilestoneNotification.tsx  transient toasts (milestones, join/leave flavor text)
lib/
  supabaseClient.ts    Supabase client (no-op if env vars are unset)
  usePresence.ts       live visitor count via Supabase Realtime Presence,
                       with a local simulated fallback when unconfigured
  useAmbientAudio.ts   layered ambience fades, missing files fail silently
  useYouTubePlayer.ts  hidden-YouTube-player playback engine for the custom player
  pujoPlaylist.ts       the actual track list the player plays — edit this
  gsapConfig.ts        global GSAP ticker config
public/audio/          drop your own ambience files here (see README.md inside)
```

## Live visitor count (optional backend)

The pandal shows how many people are in it right now, using Supabase
Realtime Presence — no login, no accounts, no personal data, just an
anonymous per-tab session id.

1. Create a free project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in the two values from
   Project Settings → API.
3. Restart the dev server.

No database schema, tables, or auth setup are required — this only opens a
Realtime Presence channel. **Without these env vars, the site still works**:
the counter falls back to a locally simulated, gently wandering number so
the experience is never blocked on a backend.

## Audio

No audio ships by default. Drop your own royalty-cleared recordings into
`public/audio/` — see [public/audio/README.md](public/audio/README.md) for
the exact filenames each ambient layer expects (traffic, dhaak, pandal
ambience, crowd talk, transition flash, conch). Anything missing just stays
silent; nothing breaks. Playback only ever starts after the visitor clicks
**Enter Pandal**, in line with browser autoplay policy and the brief.

## The playlist

The docked player at the bottom is a fully custom UI (thumbnail, title,
artist, scrub bar, transport controls) backed by a **hidden YouTube
player** — this is what gets real, full-length, no-login, no-Premium
playback with genuine autoplay after the first click, the same way
saloon.wtf's own player works. Spotify's official embed can only ever
offer 30-second previews to a visitor who isn't logged in with Premium
inside that iframe — that's a Spotify platform rule, not something the
embed can be configured around — so it's kept as a secondary "Spotify ↗"
link instead of the primary playback source.

**[lib/pujoPlaylist.ts](lib/pujoPlaylist.ts) currently holds one placeholder
track** — replace `PUJO_PLAYLIST` with the real tracklist: a public YouTube
video id, title, and artist per song. Thumbnails come straight from
YouTube's public thumbnail CDN off the video id, nothing else to configure.
`PLAYLIST_URL` in the same file is what the "Spotify ↗" link points to.

## Notes

- Reduced motion (`prefers-reduced-motion: reduce`) disables grain, flicker,
  smoke, and per-seat idle animation.
- Mobile gets a lighter build automatically: cursor parallax is skipped
  under 768px, and a brief "Turn your sound on" hint appears once on entry.
- The exit prompt ("পুজো শেষ?") surfaces after ~100s of no interaction inside
  the pandal; adjust `IDLE_EXIT_MS` in `app/page.tsx`.
