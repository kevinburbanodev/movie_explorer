# Movie Explorer

A movie browsing app built with Vue 3, TypeScript, and the TMDB API. Part of a personal portfolio.

## Features

- Trending/discover movie grid with infinite scroll
- Search by title **or** by actor name — searching an actor's name returns their full filmography
- Movie detail page: hero with poster/backdrop, overview, genres, runtime, trailer, cast, similar titles, and "where to watch" (stream/rent/buy providers)
- Dedicated actor/person detail page with bio and filmography, reachable from any cast member
- Cast carousel with arrow navigation and click-and-drag scrolling
- English/Spanish language toggle — switching languages re-fetches data from TMDB in the selected language rather than just swapping static UI strings
- Optional Google AdSense integration, toggleable via an environment variable

## Stack

Vue 3 (`<script setup>`) + TypeScript + Vite + Pinia + Vue Router + Tailwind CSS v4, organized as feature-first / clean architecture (`src/features/<name>/{api,components,composables,pages,store,types}`, shared code in `src/shared/`).

## Getting started

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

- `VITE_TMDB_ACCESS_TOKEN` — a TMDB v4 read access token (required). Get one from your [TMDB account settings](https://www.themoviedb.org/settings/api).
- `VITE_TMDB_API_BASE_URL` / `VITE_TMDB_IMAGE_BASE_URL` — TMDB API/image base URLs, defaults provided in `.env.example`.
- `VITE_ADSENSE_ENABLED` — `"true"` to enable Google AdSense, `"false"` (or unset) to disable it entirely. When disabled, no AdSense script is loaded and the client/slot IDs are optional.
- `VITE_ADSENSE_CLIENT_ID` / `VITE_ADSENSE_SLOT_ID` — your AdSense publisher ID and ad unit slot ID (required only when AdSense is enabled).

Then:

```bash
npm run dev
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`vue-tsc -b`) then build for production; both steps must pass
- `npm run preview` — serve the production build locally

No test runner or linter is configured. Type checking is the only automated correctness check and runs as part of `build`.

## Project structure

```
src/
  features/
    movies/     # browsing, search, detail, cast, trailers, watch providers
    people/     # actor/person detail pages
  shared/       # API client, i18n, config, reusable components/lib
  router/       # route definitions
```

See [CLAUDE.md](CLAUDE.md) for a deeper architectural walkthrough (TMDB integration boundary, state management conventions, i18n, etc.).
