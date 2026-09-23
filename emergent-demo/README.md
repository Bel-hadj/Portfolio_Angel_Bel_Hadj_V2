# Emergent

**Discover the next sound.**

Emergent is a frontend concept for a music discovery platform focused on independent and emerging artists.

## Problem

Mainstream streaming platforms are optimized around popularity: the artists who already have the most listens get the most exposure. Independent and emerging artists struggle to be discovered, regardless of the quality of their work.

## Solution

Emergent proposes a fairer discovery experience: a curated catalog where emerging artists are the default, not an afterthought. Visitors can search, filter by genre, browse artist profiles, and listen instantly through embedded Spotify players — no account required.

## Key Features

- Emerging artist discovery with search, genre filters and sorting
- Direct Spotify listening via embeds (tracks and curated playlists)
- Individual artist profiles with bio and track list
- Random "Surprise me" discovery
- Favorites, persisted locally across sessions
- Music submission demo — stores new entries in the browser and surfaces them in the catalog
- Responsive layout (desktop, tablet, mobile)
- Dark / light theme, saved per visitor
- FR / EN / BG interface

## Technologies

Vanilla HTML, CSS and JavaScript — no framework, no build step, no backend.

- `data.js` — the artist/track/playlist catalog and submission storage
- `shared.js` — theme, language, favorites, artist photos/cover art, toasts, mobile navigation (shared by every page)
- `style.css` — the design system (tokens, layout, components)
- `app.js`, `artists.js`, `artist.js`, `submit.js` — per-page logic

## UX/UI approach

A dark-first interface built around a small palette (violet, cyan, a neutral surface scale) instead of layered gradients, so accent colors are used to guide attention rather than decorate every element. Spotify green is reserved exclusively for Spotify-related actions. Layout, spacing and card patterns are kept consistent across the homepage, the artist directory, artist profiles and the submission form.

## What's real vs. simulated

This is a frontend-only project — there is no server, database or authentication.

- **Spotify integration** uses real, public track/playlist embeds and links.
- **Artist photos** are real stock photography (Unsplash), used as an illustrative visual per artist rather than a claimed likeness — several tracks in this demo link to real, identifiable musicians on Spotify, so no photo is presented as "this is what they look like." Each artist keeps the same photo everywhere they appear. If a photo fails to load, it falls back to generated cover art (gradient + shapes), never a broken image icon.
- **Track/playlist covers** are generated on the fly (deterministic gradient + shapes, seeded per artist/track) rather than sourced externally — nothing to hotlink, nothing that can break.
- **Music submission** is a genuine frontend flow (validation, error states, persistence), but storage is `localStorage`: submissions live in the visitor's own browser, not a shared database. This is stated clearly on the submission page.
- **Favorites and theme/language preference** are also persisted via `localStorage`.

## Running locally

No build step is required.

1. Open the project folder.
2. Serve it with any static file server (for example the VS Code "Live Server" extension, already configured in `.vscode/settings.json`), or open `index.html` directly in a browser.
3. Navigate via the header: Discover → Artists → an artist profile → Submit Music.

## Project context

Built as part of an Erasmus exchange at Varna University of Management, 2026.
