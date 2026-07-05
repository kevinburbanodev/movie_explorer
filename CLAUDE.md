# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check via `vue-tsc -b` then build for production (both must pass)
- `npm run preview` — serve the production build locally

No test runner or linter is configured. Type checking (`vue-tsc`) is the only automated correctness check and is part of `build`.

## Environment

Requires a TMDB v4 read access token. Copy `.env.example` to `.env.local` and fill in `VITE_TMDB_ACCESS_TOKEN`. `src/shared/config/env.ts` throws at import time if any `VITE_TMDB_*` variable is missing, so the app will fail fast on boot without them.

## Architecture

Vue 3 (`<script setup>` SFCs) + TypeScript + Vite + Pinia + Vue Router + Tailwind CSS v4 (loaded via `@tailwindcss/vite` and `@import 'tailwindcss'` in `src/style.css`). The path alias `@/` maps to `src/`.

### Layering: `features/` vs `shared/`

Code is organized by feature slice, not by file type. Cross-feature primitives live in `src/shared/`; feature-specific code lives in `src/features/<name>/` with subfolders `api/`, `components/`, `composables/`, `pages/`, `store/`, `types/`. Only one feature (`movies`) exists today — follow the same shape when adding new ones.

### TMDB integration boundary

The app talks only to TMDB. The layering is strict:

1. `src/shared/api/http-client.ts` — the only place `fetch` is called. Adds the `Authorization: Bearer` header, serializes query params, throws `HttpError` on non-2xx, and forwards `AbortSignal`.
2. `src/features/movies/api/movies.api.ts` — endpoint methods (`discover`, `search`, `getDetail`). `getDetail` fans out five parallel requests (detail, credits, similar, videos, watch/providers) via `Promise.all`. Trailers are always requested with `language: 'en-US'` regardless of UI locale because TMDB rarely has per-locale video catalogs.
3. `src/features/movies/api/movie.mapper.ts` — converts every snake_case `Tmdb*Dto` into the camelCase domain types in `movie.types.ts`. **Never let raw TMDB DTOs escape the `api/` folder** — components and stores consume only the domain types (`Movie`, `MovieDetail`, `PaginatedResult<T>`, etc.).

### State: Pinia stores with request cancellation

Stores are defined with the setup-style `defineStore(id, () => { ... })` pattern and expose a `status: 'idle' | 'loading' | 'success' | 'error'` state machine plus derived `computed` flags (e.g. `isInitialLoading`, `isLoadingMore`, `isAtEnd`).

- `movie-list.store.ts` — holds the current query, accumulated `movies[]`, and pagination. Each `loadPage` call aborts the previous in-flight request via an `AbortController` kept in a module-scoped `let`. Watches `localeStore.locale` and refetches from page 1 when the language changes.
- `movie-detail.store.ts` — mirrors the same shape for a single movie and also refetches on locale change (tracks the last-loaded id via a `let currentId`).

If you add another data-fetching store, keep this pattern: `AbortController` per request, `status` state machine, and a `watch` on `localeStore.locale` for anything the user sees translated.

### i18n (no library)

Locale is a hand-rolled Pinia store (`src/shared/i18n/locale.store.ts`) supporting `'en' | 'es'`, persisted in `localStorage` under `me_lang`. It also maps the locale to TMDB's `language` (`en-US` / `es-ES`) and `watch_region` (`US` / `ES`) codes — API calls pull these via `useLocaleStore().tmdbLanguage()` / `.tmdbWatchRegion()` per request rather than caching at module load, so language changes take effect immediately on the next fetch.

UI strings live in `src/shared/i18n/strings.ts` (`useStrings(locale)`) and genre-id → name mapping in `src/shared/i18n/genres.ts`. Add new user-facing text to both `en` and `es` blocks in `strings.ts`.

### Routing

Two routes in `src/router/index.ts`: `/` → `MovieListPage`, `/movies/:id` → `MovieDetailPage` (with `props: true`). Both page components are lazy-loaded via dynamic `import()`.

### Styling

Tailwind v4 is available but most components use scoped `<style>` blocks with BEM-ish class names (e.g. `movie-list-page__section-title`). CSS custom properties `--accent`, `--bg`, `--fg` are defined in `src/style.css` and used across components. Fonts referenced (`Archivo`, `Archivo Expanded`, `Space Mono`) are not self-hosted — they rely on system fallbacks.
