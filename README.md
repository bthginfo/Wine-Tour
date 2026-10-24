# Sip Happens

A German, mobile-first companion for guided wine tastings. Svelte 5, SvelteKit 3, TypeScript, Neon Postgres and Vercel. No wine prices, advertising, paywall, analytics, email identity or third-party scripts.

## Use

- Sign in to the host account at `/konto?next=/admin`. `/admin` lists tastings across devices and provides creation, editorial and media tools. Room creation and host commands require the server-checked admin role. Old browser capability cookies no longer grant access.
- Share the generated QR code or six-character room code. Guests enter a display name and start at the host's current step.
- Hosts can open a private preview, browse wines and chapters without advancing guests, and return to the latest active slide from the fixed controls. Only the live “Für alle weiter/zurück” commands broadcast a change.
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

Editorial articles are original German summaries. Research links remain in the data, outside the reading and tasting interface. The four wines are von Winning Secco Rosé, the dry JUWEL Rosé (Spätburgunder), Margarethenhof Ayler Riesling Schieferstein feinherb, and Juan Gil Etiqueta Plata / Silver Label Monastrell 2023 from Jumilla. JUWEL, Schieferstein and Juan Gil are confirmed as 2023; Secco has no vintage. Numerical analyses are not inferred from other vintages.

Entdecken includes 432 curated articles: 223 regions across 31 wine countries, 149 grape/variety-name topics, 39 producers, 14 wine styles and seven knowledge topics. It covers all 222 named regions from the old atlas plus Saar. The legacy grape names resolve to reviewed topics; Malmsey is correctly explained with Madeira wine instead of treated as a distinct botanical variety. Old user records are not migrated. Research remains in article data and is not shown as source links in the reading interface. Edited host background is excluded from public content responses and live events.

The international German catalogue lives in `src/lib/locales/de/atlas/`. Stable slugs and ISO country codes separate identity from translated labels. Country/category filters, accent-tolerant aliases, 36-item pages and remembered return positions keep the larger library usable on mobile. Common background is optional; grape profiles also include a concrete regional example. No numerical taste scores are assigned to unverified wines or grape varieties.

Photography was reused from the existing atlas with original author and licence information. `/entdecken/quellen` and `static/images/ATTRIBUTIONS.md` document provenance. Generic AI illustrations are identified as illustrations. The three confirmed wines use original product photographs from the official winery websites, served from the dedicated public Vercel Blob store. Producer portraits and the von Winning cellar photograph also come from the wineries. `src/lib/winery-media.json` records original asset URLs and attribution, including André Kunz / PFALZWEINFOTO and Peter Bender. Generic SVG artwork remains only for unselected bottles and cellar entries. Fonts are self-hosted under their OFL licences.

## Verification

Playwright covers theme persistence, host role enforcement, content publishing, version conflicts, private host copy, real Blob uploads, host login across devices, separate host and mobile guest contexts, real database persistence, live advancing, independent navigation, following again, notes privacy, registration, cross-device note editing, cellar stock updates, search and responsive overflow. Tests create records prefixed with `test_`; remove only those test records after a run. `TEST_BASE_URL` runs the same flows against an actual deployment.


## Languages

The app currently exposes German only. Static interface copy lives in `src/lib/locales/de/ui.json`, with a typed `t()` lookup in `src/lib/i18n.ts`. Authored German content is separated in `src/lib/locales/de/content.ts` and `src/lib/more-content.ts`. Slugs, wine IDs, commands and stored cellar styles stay stable across languages. To add a language, register its dictionary, add its editorial catalogue with the same stable slugs, then introduce request-scoped locale routing and translate the remaining dynamic copy (validation/API messages, composed labels and state messages). Do not use a shared mutable server-side locale. No inactive language switch is shown to users.

## Editorial tools and appearance

`/admin` supports the home introduction and hero, all 434 articles (participant copy, private host background, image credit, separate desktop/mobile focal positions and full-image/cover display), and all four wine records (metadata, tasting prompt and bottle photograph). An image library accepts JPG, PNG, WebP and AVIF up to 3 MB. Uploads are decoded, bounded to 24 megapixels, resized and re-encoded to WebP before storage; arbitrary SVG/HTML uploads are rejected. The application caps its media library at 50 MB.

Editorial changes use a version precondition. A single Postgres statement stores the current record, immutable revision and `ContentPublished` events for open rooms. A stale editor receives 409 rather than overwriting newer work. Active tasting clients reload their appropriate public/admin content after publishing. No HTML from the editor is executed.

Light/dark uses semantic surfaces, a persistent local preference and the device preference on first visit. An early document script applies the theme before rendering. Native controls follow the selected color scheme. The image editor has an accessible nine-point positioning grid, independent desktop/mobile settings and immediate previews. Wine bottle photos always use `contain` so the label and bottle stay visible.

The existing Neon database is on its `free_v3` plan. The dedicated `sip-happens-media` Blob store uses the account's included allowance; no paid upgrade was selected. Free quotas still apply to database compute, Blob transfer and Vercel functions. No promise of unlimited storage or traffic is made. `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` belong in Vercel environment variables; local development reads ignored `.env` and `.env.blob` files.

## Content depth and motion

The 34 original tasting/core articles retain their expanded reader copy. All 434 articles have three explanatory sections, with visual profiles, name explanations and regional context in the international catalogue. The 18 tasting and core knowledge topics have expanded host background. Guided tasting keeps those sections in an optional disclosure; the knowledge pages show them in full. Both render through `ArticleBody`. Paragraphs, sections, visual selection and host copy remain editable from `/admin`.

`learning/` contains native SVG/CSS explanations for skin contact, pressure, Pinot colours, aromas, sugar/acidity, fermentation, closures, temperature, label reading and storage. Region locators use a Natural Earth 1:50m Germany outline and place coordinates looked up through OpenStreetMap Nominatim. These are point locators, not invented wine-region boundaries. Three verified grape photographs replace generic illustrations for Pinot Noir, Pinot Gris and Riesling. Original URLs, creators and licences are recorded in `educational-media.json`. Bottle images can be opened at a readable size without leaving notes.

Motion uses short state transitions and brief, in-view SVG animation. There are no perpetual background animations, canvas/WebGL renders or animation libraries. All added motion respects `prefers-reduced-motion`. Editing a note pauses live following; the participant explicitly resumes with “Zum Host”. Offline drafts retry and are saved when connectivity returns.

Pending notes belong to the browser identity and are handled by a shared save queue. They remain visible under “Meine Notizen” after leaving the editor; the application retries on reconnection, focus and a 30-second interval. Requests are serialized so a later edit cannot be overwritten by an earlier request from the same app instance. A 10-second request timeout preserves the draft for a later retry. Timeouts use AbortController for compatibility with earlier Safari versions. Note inputs stay disabled until the browser identity is known, with a retry action if the initial request fails. Switching accounts or losing the account session rotates an account-linked guest identity, so its longer-lived cookie cannot expose a previous account's notes. The regression flow covers direct account switching, a mismatched guest/session pair and an expired session.

A participant who is still reading or writing when the host ends the tasting receives a completion/PDF action while keeping their current page and draft. On narrow screens, the pressure comparison uses stacked illustrated rows instead of narrow text columns. Knowledge search and category selection remain in place during article round trips; a visible reset returns to all articles. Search in knowledge, notes and cellar ignores accents and folds ß to ss. Rosé and Rotwein link directly to each other for comparison.

The completion screen hides the wine navigation and sidebar, and replaces the disabled forward action with a useful destination. Hosts can close the tasting from the fixed controls. Room-specific wine names and label details use a shared resolver in the tasting, note list/search and PDF. Native dialogs have explicit accessible names, active navigation exposes `aria-current`, and the theme toggle also works when persistent browser storage is blocked.

The expanded Playwright flow validates the structure, editorial schema and related links of all 434 articles, and checks all 34 original articles plus 12 international examples at mobile and desktop widths, including image loading, educational controls by keyboard, reduced motion, offline recovery, note editing during a host advance, bottle zoom/focus return, tasting completion, signup/export and cellar editing/deletion.

## Personal tasting PDF

The final tasting screen offers a PDF download before optional registration. The A4 booklet includes a personal cover, clickable wine overview, the full public tasting articles and illustrations in tasting order, room-specific red wine details/vintages, and each participant's own notes, aromas, rating and perception scales. It includes expanded article sections even when a reading disclosure was closed. Private host copy and notes from other participants or tastings are excluded.

PDF creation runs in the browser, with `pdf-lib` and its font engine loaded on demand. No personal PDF is uploaded to Blob or stored on the server. It fetches current owned notes and merges pending drafts belonging to the same browser identity, including edits made while an earlier save is still in flight. Font instances use the existing OFL-licensed site fonts; the committed TTF files can be regenerated with `scripts/prepare-pdf-fonts.py`. Photography is embedded with credits; unavailable images receive a clean diagram fallback and a visible download notice. Long notes continue onto additional pages without truncation. Unsupported font glyphs, including emoji, use inline image glyphs.

PDF verification downloads the actual document as an anonymous mobile participant and again after registration, parses it to check full notes and privacy, and exercises offline drafts, long notes, updated tasting settings, image failure and recoverable font-loading errors.

Nach dem PDF-Abschluss führt „Zurück zur Probe“ für Gäste zum zuletzt gelesenen Abschnitt. Die Host-Steuerung bleibt chronologisch.


## International atlas and navigation

The 214 licensed regional photographs are served locally as WebP, with smaller card thumbnails. Per-image provenance is preserved in `src/lib/locales/de/atlas/photos.json`; no regional photograph is presented as an estate portrait. New regional locators use the public-domain Natural Earth 1:110m land outline, shared through one SVG asset rather than repeated inline geometry. They show approximate geographic locations, not wine-region boundaries. New winery profiles use location/fact diagrams where no verified estate image is provided.

Desktop and tablet navigation has a collapsible icon rail. The browser remembers that choice; keyboard focus and hover reveal link labels. Mobile keeps its bottom navigation. The fixed tasting controls move with the rail. The new wine-style diagrams explain the different production paths with short keyboard-operable steps and bounded animation, including reduced-motion support.

The editor can search the complete catalogue and edit the short factual profiles as well as text and imagery. Articles with an illustration and no photograph can be saved without an artificial image source. Plain research links remain metadata; image credits remain available under Bildnachweise.

Knowledge navigation refreshes published editorial records, so returning to an article does not keep an older text revision in the app. A small optional glossary explains Ausbau and Cuvée where those words occur, before the longer reading sections.

The second tasting slot uses JUWEL Rosé (Spätburgunder, dry); its stable `juwel` note ID and the 23-step sequence are preserved. A comparison of the two rosés connects carbonation, colour and sweetness. Host background includes 18 spoken guides and 81 deeper topics. Each guide starts with a self-contained explanation of the basics, followed by history, production and anecdotes. Host-only narration uses prepared German multilingual neural voices (Florian and Seraphina). Each guide is synthesized continuously; headings remain navigation markers instead of being read out. Playback starts explicitly and offers pause/resume, stop, ±10 seconds, an exact audio timeline, topic navigation, speed and volume. It stops on slide/navigation changes. Authored text is matched by SHA-256; editing any host paragraph immediately invalidates an old recording and selects the device voice for the new text, with clearly approximate timing. No live TTS service, API key or paid subscription is provisioned.


## Narration and editorial polish

`host-audio.json` maps each authored host text fingerprint to both recordings and measured chapter timestamps. MP3 assets are prepared before deployment with the public `edge-tts` client and stored in the existing Blob store. Runtime playback contacts Blob only; CMS text and personal notes are never sent to that generation service. The player identifies synthetic speech in its voice settings. Voice, tempo and volume persist between slides. Device fallback includes a pronunciation layer for Rhein compounds and highlighted acronym spelling; those changes do not alter display copy.

To regenerate authored recordings, install `edge-tts==7.3.1` into a separate Python environment and use `scripts/host-audio-source.cjs` and `scripts/generate-host-audio.py` as documented in the script. FFmpeg preserves the original encoded stream and reads its duration. Exact chapter positions come from word boundaries in that same continuous synthesis. Complete recordings are cached by text and voice configuration. `scripts/publish-host-audio.mjs` validates that both voices cover every current guide, uploads immutable MP3s to the existing Blob store and atomically updates the manifest. Generation is deliberately outside the production build.

The player shows its active voice and upgrades old defaults once. New explicit voice choices, tempo and volume persist. A network failure keeps the selected recording available for retry; it does not silently downgrade to a device voice. Device narration remains an explicit option and the fallback for custom CMS text without a matching prepared recording. The host knowledge download contains the guide once, with titled deeper topics; the participant PDF continues to exclude all private host text.

The guided reading copy and 64 host topics use direct German explanations without research commentary or presentation instructions. Additional estate photographs, three short winery timelines and three native landscape/soil diagrams add context. The Saar now uses a credited photograph of the Ayler Kupp as regional scenery. New photographs preserve the full subject on narrow screens. Participant PDF generation shares the public companion/landscape data, includes their captions and credits, and excludes the audio manifest and private host copy.

The eight region/estate articles in this tasting now have editable `atlas.facts` profiles. Their defaults live in `src/lib/locales/de/tasting-profiles.json`; the reading/tasting view and participant PDF both use the article's current profile, including published admin edits. Regional vineyard areas use 2025 statistics for Pfalz/Rheinhessen and an explicitly rounded area for Saar. The von Winning figure describes its own vineyard holdings. Foundation dates distinguish the historic estate, JUWEL's launch in 2013 and the Weber family's start in 1986.

The Juliane Eller story covers the original III Freunde collaboration, its first release in 2017 and her exit in 2023. Nicolas Weber's South African experience is identified as a practical placement, separate from his Geisenheim studies. Each of the 18 tasting fact boxes adds a different fact from the explanatory text; they also appear once in the host knowledge download and in the participant PDF. Research provenance remains in metadata.

## Juan Gil red wine finale

The fourth wine keeps the stable `rot` note ID and the existing 23-step sequence. Its three placeholder steps now contain Jumilla, Juan Gil and Monastrell stories, followed by the red-wine chapter. Monastrell reuses the existing `mourvedre-monastrell` slug so international links remain valid and discovery has one article for the variety. `/entdecken/monastrell` redirects to that article. The new material is editable through the existing CMS and shared with the host guide, prepared narration and participant PDF. Sources remain hidden metadata; image credits are retained.

Jumilla uses rounded 2025 regional statistics and current DOP geography (350–980 m). The estate area describes Juan Gil holdings in Jumilla, not all Gil Family estates. The red wine is described as aged about twelve months in oak; no unverified barrel proportions or analysis figures are added. Official bottle imagery preserves transparency; landscape photographs show the full subject on mobile and desktop. An Iberian map derived from public-domain Natural Earth coordinates is reused in the app and PDF.

Repeated content notifications are batched before reloading editorial data. Host narration depends on the actual paragraph text, so an unchanged refresh or an edit to another article cannot interrupt playback. Editing the current host text still stops and invalidates its old recording.
