# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check via `vue-tsc -b` then build for production (both must pass)
- `npm run preview` — serve the production build locally

No test runner or linter is configured. Type checking (`vue-tsc`) is the only automated correctness check and is part of `build`.

## Environment

Requires a TMDB v4 read access token. Copy `.env.example` to `.env.local` and fill in `VITE_TMDB_ACCESS_TOKEN`. `src/shared/config/env.ts` throws at import time if any `VITE_TMDB_*` variable is missing, so the app will fail fast on boot without them.

Google AdSense is optional and toggled via `VITE_ADSENSE_ENABLED` (`"true"`/`"false"`). When enabled, `VITE_ADSENSE_CLIENT_ID` and `VITE_ADSENSE_SLOT_ID` become required (checked lazily, only when the flag is on). When disabled, no AdSense script is injected and `<AdSlot />` renders nothing.

`tsconfig.app.json` sets `"ignoreDeprecations": "6.0"` to keep `baseUrl` (needed for the `@/*` path alias) usable under current TypeScript without the build failing on the deprecation warning.

## Architecture

Vue 3 (`<script setup>` SFCs) + TypeScript + Vite + Pinia + Vue Router + Tailwind CSS v4 (loaded via `@tailwindcss/vite` and `@import 'tailwindcss'` in `src/style.css`). The path alias `@/` maps to `src/`.

### Layering: `features/` vs `shared/`

Code is organized by feature slice, not by file type. Cross-feature primitives live in `src/shared/`; feature-specific code lives in `src/features/<name>/` with subfolders `api/`, `components/`, `composables/`, `pages/`, `store/`, `types/`. Two features exist today: `movies` (browsing, search, detail, cast, trailers, watch providers) and `people` (actor/person detail pages). Follow the same shape when adding new ones.

### TMDB integration boundary

The app talks only to TMDB. The layering is strict:

1. `src/shared/api/http-client.ts` — the only place `fetch` is called. Adds the `Authorization: Bearer` header, serializes query params, throws `HttpError` on non-2xx, and forwards `AbortSignal`.
2. `src/features/movies/api/movies.api.ts` — endpoint methods:
   - `discover` / `search` — paginated movie listing.
   - `searchByActor` — resolves a query against `/search/person` first; if the top match's popularity is below `MIN_ACTOR_POPULARITY` (5), it's discarded and treated as a title search instead (avoids obscure-name false positives, e.g. a search for "batman" matching an unrelated low-popularity person named "Batman"). Otherwise returns that person's full filmography via `/person/{id}/movie_credits`.
   - `getDetail` — fans out five parallel requests (detail, credits, similar, videos, watch/providers) via `Promise.all`. Trailers are always requested with `language: 'en-US'` regardless of UI locale because TMDB rarely has per-locale video catalogs.
3. `src/features/people/api/people.api.ts` — `getPersonDetail`, combining `/person/{id}` with `/person/{id}/movie_credits` for the actor detail page.
4. `src/features/movies/api/movie.mapper.ts` and `src/features/people/api/person.mapper.ts` — convert every snake_case `Tmdb*Dto` into camelCase domain types (`movie.types.ts`, `person.types.ts`). **Never let raw TMDB DTOs escape the `api/` folder** — components and stores consume only the domain types (`Movie`, `MovieDetail`, `Person`, `PaginatedResult<T>`, etc.).

### State: Pinia stores with request cancellation

Stores are defined with the setup-style `defineStore(id, () => { ... })` pattern and expose a `status: 'idle' | 'loading' | 'success' | 'error'` state machine plus derived `computed` flags (e.g. `isInitialLoading`, `isLoadingMore`, `isAtEnd`).

- `movie-list.store.ts` — holds the current query, accumulated `movies[]`, and pagination. On page 1, merges title-search results with actor-filmography results (via `searchByActor`) and exposes `matchedActorName` so the UI can show "Películas con {actor}" instead of a generic results title. Each `loadPage` call aborts the previous in-flight request via an `AbortController` kept in a module-scoped `let`. Watches `localeStore.locale` and refetches from page 1 when the language changes.
- `movie-detail.store.ts` — mirrors the same shape for a single movie and also refetches on locale change (tracks the last-loaded id via a `let currentId`).
- `person-detail.store.ts` — same shape for a single actor/person plus their filmography.

If you add another data-fetching store, keep this pattern: `AbortController` per request, `status` state machine, and a `watch` on `localeStore.locale` for anything the user sees translated.

### i18n (no library)

Locale is a hand-rolled Pinia store (`src/shared/i18n/locale.store.ts`) supporting `'en' | 'es'`, persisted in `localStorage` under `me_lang`. It also maps the locale to TMDB's `language` (`en-US` / `es-ES`) and `watch_region` (`US` / `ES`) codes — API calls pull these via `useLocaleStore().tmdbLanguage()` / `.tmdbWatchRegion()` per request rather than caching at module load, so language changes take effect immediately on the next fetch.

UI strings live in `src/shared/i18n/strings.ts` (`useStrings(locale)`) and genre-id → name mapping in `src/shared/i18n/genres.ts`. Add new user-facing text to both `en` and `es` blocks in `strings.ts`.

### Routing

Three routes in `src/router/index.ts`: `/` → `MovieListPage`, `/movies/:id` → `MovieDetailPage`, `/person/:id` → `PersonDetailPage` (all with `props: true`). Page components are lazy-loaded via dynamic `import()`. A `scrollBehavior` restores the saved position on back/forward navigation and otherwise scrolls to the top on every new navigation — without it, opening a movie/person from a scrolled-down list would land mid-page instead of at the top.

### Cast carousel

`MovieCastList.vue` renders a horizontally-scrolling cast row with no visible scrollbar, prev/next arrow buttons (step of 6 cards via `scrollBy({ behavior: 'smooth' })`), and click-and-drag scrolling. Drag is implemented with `pointerdown` on the track adding `pointermove`/`pointerup` listeners on `window` (not the element) — do **not** reintroduce `setPointerCapture` on the track, since it retargets the native `click` event to the track itself and silently breaks navigation to `PersonDetailPage` on a plain click.

### Ads

`src/shared/components/AdSlot.vue` is a reusable `<ins class="adsbygoogle">` unit; it renders nothing and never injects the AdSense script when `VITE_ADSENSE_ENABLED` is false. `src/shared/lib/load-adsense-script.ts` injects the script at most once (module-scoped `loaded` flag). Ad slots are currently placed on `MovieListPage` (above the results grid) and `MovieDetailPage` (top of `.detail-body`).

### Styling

Tailwind v4 is available but most components use scoped `<style>` blocks with BEM-ish class names (e.g. `movie-list-page__section-title`). CSS custom properties `--accent`, `--bg`, `--fg` are defined in `src/style.css` and used across components. Fonts referenced (`Archivo`, `Archivo Expanded`, `Space Mono`) are not self-hosted — they rely on system fallbacks.
