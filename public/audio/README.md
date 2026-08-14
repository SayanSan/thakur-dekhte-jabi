# Audio assets

No audio ships with this repo by default — the experience runs silently
(gracefully) until you add your own royalty-cleared recordings here. Drop in
files with these exact names and the ambient layers will pick them up
automatically:

| File | Used for | Loop |
|---|---|---|
| `traffic.mp3` | Scene 01 — Kolkata street/parking ambience (horns, traffic, footsteps, distant chatter) | yes |
| `dhaak.mp3` | Dhaak drum, rises through the Enter Pandal transition and continues low inside the pandal | yes |
| `pandal-ambience.mp3` | Bells, crowd murmur, room reverb inside the pandal | yes |
| `crowd-talk.mp3` | Bengali crowd conversation layer, mixed low under the pandal ambience | yes |
| `transition-flash.mp3` | Short whoosh/impact for the white-flash moment of the transition | no |
| `conch.mp3` | Shankha (conch) one-shot, played occasionally inside the pandal | no |

Keep files short (parking/pandal loops under ~1MB where possible, one-shots
under ~150KB) and encode as compressed MP3/AAC so the site stays fast on
mobile. If a file is missing, that layer simply stays silent — nothing
breaks.
