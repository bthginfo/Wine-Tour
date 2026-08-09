# Vine Atlas

Vine Atlas is a mobile-first wine knowledge graph and tasting companion. It connects places, grapes, producers, wines, aromas, learning notes and personal memories in one routeable React application.

The current editorial catalogue contains 222 wine regions, 111 grape varieties, 203 producers, 409 wines, 77 aroma references and 11 fully authored interactive masterclasses. The public curriculum exposes only modules that pass the four-language depth, source and similarity audit; unfinished curriculum drafts are not counted as published lessons.

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run typecheck
npm run build
```

The build includes `validate:learning`. It fails when a visible masterclass misses the minimum depth in any locale, repeats another module too closely, lacks directly relevant sources or breaks curriculum relationships.

The Vite development server prints the local URL, normally `http://localhost:5173`. Nested routes work on Vercel through the SPA rewrite in `vercel.json`.

## Accounts and access

Accounts use a deliberately simple username-and-password interface backed by Neon. Passwords are derived server-side with Node's `scrypt` and individual random salts; sessions use random opaque tokens whose SHA-256 digests are stored in Postgres. The browser receives only an `HttpOnly`, `SameSite=Lax` session cookie. Registration, login, state writes, role changes and media uploads are rate-limited, mutation requests are origin-checked, and role checks are repeated at each server boundary.

Every account starts as a member. An administrator can grant host, winery, merchant or administrator roles and the matching isolated workspace. The bootstrap administrator password is distributed separately and is never stored in source, documentation, UI copy, fixtures or build artifacts. Password recovery, email verification and payment identity are intentionally deferred until the corresponding product flows are introduced.

## Hosted data foundation

The Vercel project is connected to a Neon Postgres resource in Frankfurt for development, preview and production. Drizzle owns the versioned schema in `db/schema.ts`; migrations create the editorial graph, accounts, workspaces, events, cellar records, notes, ratings, audit records, rate limits and media metadata.

Database commands require Vercel-injected environment variables and do not need a checked-in `.env` file:

```bash
npm run db:generate
vercel env run -e production -- npm run db:migrate
vercel env run -e production -- npm run db:seed
```

The seed validates catalogue, business graph and curriculum before synchronising curated entities, relations and a versioned snapshot. `/api/health` reports database and catalogue status; `/api/catalog` provides a paginated read-only catalogue boundary. Authenticated writes pass through `/api/state`, which separates personal records from shared publication data and enforces workspace ownership and role-specific permissions.

Bottle photos are resized in the browser, then uploaded through the authenticated, size-, rate- and signature-restricted `/api/media/upload` function to the `wine-tour-media` Vercel Blob store. Cellar records keep the returned media identifier and URL. Media uploads are currently limited to prepared WebP bottle photographs; partner and editorial media require dedicated moderation flows before they are opened.

## Architecture

- `src/data/catalog.ts` — typed curated catalogue and startup validation
- `src/learningCurriculum.ts` — authored interactive curriculum and hard validation
- `src/LearningSystem.tsx` — learning hub, portable blocks and lesson runtime
- `src/data/repository.ts` — optimistic browser cache plus authenticated server synchronisation
- `src/data/business.ts` — workspace, event, offer, placement and approval domain definitions
- `src/auth.tsx` — account and session context
- `src/i18n.tsx` — locale registry and English, German, French and Spanish UI dictionaries
- `src/App.tsx` — routed product workflows and reusable interface components
- `src/BusinessPlatform.tsx` — host, winery, merchant, marketplace and studio experiences
- `src/CellarExperience.tsx` — bottle records, photo preparation, metadata and structured tasting notes
- `src/LearningDepth.tsx` — regional field guides, ampelography and lesson extensions
- `src/styles.css` — responsive editorial design system
- `src/enhancements.css` — focused late-stage component refinements
- `src/assets/ATTRIBUTIONS.md` — image provenance
- `db/schema.ts` / `db/migrations/` — Drizzle schema and reviewed SQL migrations
- `server/auth.ts` / `server/security.ts` — password, session, role, CSRF, rate-limit and payload boundaries
- `server/db.ts` / `api/` — pooled server database boundary, scoped writes, read APIs and restricted bottle-media upload
- `scripts/seed-database.ts` — validated Neon catalogue synchronisation

Curated source data is never mutated by personal cellar, rating, tasting or admin records. That separation makes a future hosted repository replacement straightforward.
