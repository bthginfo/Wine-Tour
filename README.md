# Sip Happens

A German, mobile-first companion for guided wine tastings. Svelte 5, SvelteKit 3, TypeScript, Neon Postgres and Vercel. No wine prices, advertising, paywall, analytics, email identity or third-party scripts.

## Use

- Create a tasting from the home screen. The browser receives an unguessable, HttpOnly host capability cookie. Keep that browser; a participant link never grants host access.
- Share the generated QR code or six-character room code. Guests enter a display name and start at the host's current step.
- Guests follow the host by default. Any manual navigation pauses following; “Zum Host” resumes it. Notes are always personal.
- Each wine follows region → producer → grape → wine style → notes. Aroma and closure interludes sit between the wines.
- The fourth wine is deliberately unconfirmed. Host settings have separate fields for region, producer and grape stories, plus a source URL and private host background. The Riesling's exact bottling and all vintages can also be added here.
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
npm test
```

In an HTTP-proxy development environment, set `NODE_USE_ENV_PROXY=1`. Production uses the standard Neon HTTPS endpoint. Secrets belong only in environment variables. Do not print or commit `.env`, cookie jars or credentials.

## Event architecture

Commands are authenticated and validated by `/api/rooms/:code/*`. The write model is Postgres. `sip.events` is an append-only ordered room log; `sip.rooms` is the current projection. A host advancement uses one SQL CTE to update the version-checked projection and append `TastingAdvanced` atomically. A repeated command UUID is idempotent. Stale commands receive 409. Room creation and participant joins append their own domain events; configuration changes append `TastingConfigured`.

`/api/rooms/:code/stream` delivers those committed events over SSE. It reads the durable log with a cursor rather than keeping room state in a server process. Clients use `Last-Event-ID` to reconnect and ignore projection versions older than their current snapshot. Streams rotate after 22 seconds for bounded serverless execution. The current implementation observes the database log every second per connected client; it does not use a separate broker or Postgres logical replication. At larger audience sizes, replace that observer with a shared broker/outbox relay while keeping command and event contracts.

Notes and cellar are private aggregates; their contents never enter the room's public event stream. Notes have debounced server persistence and a local browser draft to survive short network failures. A keepalive write is attempted on navigation. A local draft is not a substitute for a confirmed server save.

The new tables live exclusively in schema `sip`. The existing Wine Atlas schema and catalogue are untouched. Both projects currently share the existing Neon cluster, with separate schemas and application sessions.

## Security and practical limits

Passwords use Node scrypt with a random salt. Random account tokens are stored only as SHA-256 hashes, with a 30-day expiry. Cookies are HttpOnly, SameSite=Lax, and Secure on HTTPS. Mutation routes check Origin. Schema validation bounds input sizes; login, join and room creation are database rate limited. Host and record ownership checks run at the server boundary, including SSE membership. API responses are non-cacheable.

Username-only identity has no email-based password recovery. Host capability is tied to the creating browser. Do not clear that browser's cookies before the event. A public room code is an invitation, not an identity check; anyone receiving it can join. Closing a room prevents new joins but preserves existing members' access and notes.

## Content and imagery

Editorial articles are original German summaries with direct source links and a review date. The first three wines are the specified von Winning Secco Rosé, the regular JUWEL Grauburgunder, and a Margarethenhof Riesling feinherb. No vintage, precise Riesling bottling or fourth wine is invented. Numerical wine analyses are omitted until actual bottles are known.

The knowledge section includes all 13 German growing regions plus Saar, producer profiles, grape varieties, wine styles and practical wine knowledge. It intentionally replaces the old sprawling catalogue with a smaller, reviewed selection; it does not migrate all 222 historical regions or existing user records. Host-only background is rendered only in the host view; it is general editorial material, not confidential data.

Photography was reused from the existing atlas with original author and licence information. `/entdecken/quellen` and `static/images/ATTRIBUTIONS.md` document provenance. Generic AI illustrations are identified as illustrations. The bottles are original SVG interface artwork, not product photographs or original labels. Fonts are self-hosted under their OFL licences.

## Verification

Playwright covers separate host and mobile guest contexts, real database persistence, live advancing, independent navigation, following again, notes privacy, registration, cross-device note editing, cellar stock updates, search and responsive overflow. Tests create records prefixed with `test_`; remove only those test records after a run. `TEST_BASE_URL` runs the same flows against an actual deployment.


## Languages

The app currently exposes German only. Static interface copy lives in `src/lib/locales/de/ui.json` (269 messages), with a typed `t()` lookup in `src/lib/i18n.ts`. Authored German content is separated in `src/lib/locales/de/content.ts` and `src/lib/more-content.ts`. Slugs, wine IDs, commands and stored cellar styles stay stable across languages. To add a language, register its dictionary, add its editorial catalogue with the same stable slugs, then introduce request-scoped locale routing and translate the remaining dynamic copy (validation/API messages, composed labels and state messages). Do not use a shared mutable server-side locale. No inactive language switch is shown to users.
