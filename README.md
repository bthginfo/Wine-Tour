# Sip Happens

A German, mobile-first companion for guided wine tastings. Svelte 5, SvelteKit 3, TypeScript, Neon Postgres and Vercel. No wine prices, advertising, paywall, analytics, email identity or third-party scripts.

## Use

- Sign in to the host account at `/konto?next=/admin`. `/admin` lists tastings across devices and provides creation, editorial and media tools. Room creation and host commands require the server-checked admin role. Old browser capability cookies no longer grant access.
- Share the generated QR code or six-character room code. Guests enter a display name and start at the host's current step.
- Guests follow the host by default. Any manual navigation pauses following; “Zum Host” resumes it. Notes are always personal.
- Each wine follows region → producer → grape → wine style → notes. Aroma and closure interludes sit between the wines.
- The fourth wine is deliberately unconfirmed. Host settings have separate fields for region, producer and grape stories, plus a source URL and private host background. The Riesling is confirmed as Ayler Riesling Schieferstein feinherb. Vintages can be added in host settings.
- Participants can register after the tasting with a username and password. Their guest notes are attached to that account. Existing members can edit those notes after logging in on another device, including after a room is closed.
- The cellar supports create, edit, stock increment/decrement, delete, search, storage location, memo and JSON export. Notes can be exported too.

## Develop

```sh
npm ci
cp .env.example .env
# Set DATABASE_URL privately in .env
npm run db:migrate
npm run dev
npm run check
npm run build
npx playwright install chromium
SIP_ADMIN_USERNAME=your-host SIP_ADMIN_PASSWORD=your-password npm test
```

In an HTTP-proxy development environment, set `NODE_USE_ENV_PROXY=1`. Production uses the standard Neon HTTPS endpoint. Secrets belong only in environment variables. Do not print or commit `.env`, cookie jars or credentials.

## Event architecture

Commands are authenticated and validated by `/api/rooms/:code/*`. The write model is Postgres. `sip.events` is an append-only ordered room log; `sip.rooms` is the current projection. A host advancement uses one SQL CTE to update the version-checked projection and append `TastingAdvanced` atomically. A repeated command UUID is idempotent. Stale commands receive 409. Room creation and participant joins append their own domain events; configuration changes append `TastingConfigured`.

`/api/rooms/:code/stream` delivers those committed events over SSE. It reads the durable log with a cursor rather than keeping room state in a server process. Clients use `Last-Event-ID` to reconnect and ignore projection versions older than their current snapshot. Streams rotate after 22 seconds for bounded serverless execution. The current implementation observes the database log every second per connected client; it does not use a separate broker or Postgres logical replication. At larger audience sizes, replace that observer with a shared broker/outbox relay while keeping command and event contracts.

Notes and cellar are private aggregates; their contents never enter the room's public event stream. Notes have debounced server persistence and a local browser draft to survive short network failures. A keepalive write is attempted on navigation. A local draft is not a substitute for a confirmed server save.

The new tables live exclusively in schema `sip`. The existing Wine Atlas schema and catalogue are untouched. Both projects currently share the existing Neon cluster, with separate schemas and application sessions.

## Security and practical limits

Passwords use Node scrypt with a random salt. Random account tokens are stored only as SHA-256 hashes, with a 30-day expiry. Cookies are HttpOnly, SameSite=Lax, and Secure on HTTPS. Mutation routes check Origin. Schema validation bounds input sizes; login, join and room creation are database rate limited. Auth has both an account-specific limit and a larger network limit so guests sharing event Wi-Fi can each create an account. Host and record ownership checks run at the server boundary, including SSE membership. API responses are non-cacheable.

Username-only identity has no email-based password recovery. The admin account controls all tastings. Logging out revokes the session and host actions require a new login. Admin passwords are never embedded in client code. A public room code is an invitation, not an identity check; anyone receiving it can join. Closing a room prevents new joins but preserves existing members' access and notes.

## Content and imagery

Editorial articles are original German summaries. Research links remain in the data, outside the reading and tasting interface. The first three wines are the specified von Winning Secco Rosé, the regular JUWEL Grauburgunder, and the Margarethenhof Ayler Riesling Schieferstein feinherb. No vintage or fourth wine is invented. Numerical wine analyses are omitted until actual bottles are known.

The knowledge section includes all 13 German growing regions plus Saar, producer profiles, grape varieties, wine styles and practical wine knowledge, including temperature/glass and label reading. It intentionally replaces the old sprawling catalogue with a smaller, reviewed selection; it does not migrate all 222 historical regions or existing user records. Edited host-only background is excluded from public content responses and live events. Baseline general educational material is part of the static catalogue.

Photography was reused from the existing atlas with original author and licence information. `/entdecken/quellen` and `static/images/ATTRIBUTIONS.md` document provenance. Generic AI illustrations are identified as illustrations. The three confirmed wines use original product photographs from the official winery websites, served from the dedicated public Vercel Blob store. Producer portraits and the von Winning cellar photograph also come from the wineries. `src/lib/winery-media.json` records original asset URLs and attribution, including André Kunz / PFALZWEINFOTO and Peter Bender. Generic SVG artwork remains only for unselected bottles and cellar entries. Fonts are self-hosted under their OFL licences.

## Verification

Playwright covers theme persistence, host role enforcement, content publishing, version conflicts, private host copy, real Blob uploads, host login across devices, separate host and mobile guest contexts, real database persistence, live advancing, independent navigation, following again, notes privacy, registration, cross-device note editing, cellar stock updates, search and responsive overflow. Tests create records prefixed with `test_`; remove only those test records after a run. `TEST_BASE_URL` runs the same flows against an actual deployment.


## Languages

The app currently exposes German only. Static interface copy lives in `src/lib/locales/de/ui.json` (271 messages), with a typed `t()` lookup in `src/lib/i18n.ts`. Authored German content is separated in `src/lib/locales/de/content.ts` and `src/lib/more-content.ts`. Slugs, wine IDs, commands and stored cellar styles stay stable across languages. To add a language, register its dictionary, add its editorial catalogue with the same stable slugs, then introduce request-scoped locale routing and translate the remaining dynamic copy (validation/API messages, composed labels and state messages). Do not use a shared mutable server-side locale. No inactive language switch is shown to users.

## Editorial tools and appearance

`/admin` supports the home introduction and hero, all 34 articles (participant copy, private host background, image credit, separate desktop/mobile focal positions and full-image/cover display), and all four wine records (metadata, tasting prompt and bottle photograph). An image library accepts JPG, PNG, WebP and AVIF up to 3 MB. Uploads are decoded, bounded to 24 megapixels, resized and re-encoded to WebP before storage; arbitrary SVG/HTML uploads are rejected. The application caps its media library at 50 MB.

Editorial changes use a version precondition. A single Postgres statement stores the current record, immutable revision and `ContentPublished` events for open rooms. A stale editor receives 409 rather than overwriting newer work. Active tasting clients reload their appropriate public/admin content after publishing. No HTML from the editor is executed.

Light/dark uses semantic surfaces, a persistent local preference and the device preference on first visit. An early document script applies the theme before rendering. Native controls follow the selected color scheme. The image editor has an accessible nine-point positioning grid, independent desktop/mobile settings and immediate previews. Wine bottle photos always use `contain` so the label and bottle stay visible.

The existing Neon database is on its `free_v3` plan. The dedicated `sip-happens-media` Blob store uses the account's included allowance; no paid upgrade was selected. Free quotas still apply to database compute, Blob transfer and Vercel functions. No promise of unlimited storage or traffic is made. `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` belong in Vercel environment variables; local development reads ignored `.env` and `.env.blob` files.

## Content depth and motion

All 34 articles now have three titled explanatory sections and at least 200 words of reader copy in the default catalogue. The 18 tasting and core knowledge topics have expanded host background. Guided tasting keeps those sections in an optional disclosure; the knowledge pages show them in full. Both render through `ArticleBody`. Paragraphs, sections, visual selection and host copy remain editable from `/admin`.

`learning/` contains native SVG/CSS explanations for skin contact, pressure, Pinot colours, aromas, sugar/acidity, fermentation, closures, temperature, label reading and storage. Region locators use a Natural Earth 1:50m Germany outline and place coordinates looked up through OpenStreetMap Nominatim. These are point locators, not invented wine-region boundaries. Three verified grape photographs replace generic illustrations for Pinot Noir, Pinot Gris and Riesling. Original URLs, creators and licences are recorded in `educational-media.json`. Bottle images can be opened at a readable size without leaving notes.

Motion uses short state transitions and brief, in-view SVG animation. There are no perpetual background animations, canvas/WebGL renders or animation libraries. All added motion respects `prefers-reduced-motion`. Editing a note pauses live following; the participant explicitly resumes with “Zum Host”. Offline drafts retry and are saved when connectivity returns.

The expanded Playwright flow covers every article at mobile and desktop widths, image loading, educational controls by keyboard, reduced motion, offline recovery, note editing during a host advance, bottle zoom/focus return, tasting completion, signup/export and cellar editing/deletion.
