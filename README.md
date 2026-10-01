# RECLAIM

A private working preview of a cybersecurity recovery app: symptom search, source-backed guides, adaptive triage, personal checklists, recurring calendar check-ins, and community discussions.

The initial collection contains 28 original guide summaries. All specialist review remains pending. See [launch readiness](docs/launch-readiness.md) before changing the audience or inviting people to rely on sensitive guidance.

## Run locally

Use Node.js 22.13 or newer and install with `npm ci`. Run `npm run dev`; the portable preview uses `http://127.0.0.1:5173`. Its sign-in route supplies a clearly local mock account; it never asks for real provider credentials. Hosted authentication is supplied by Sites.

Cloudflare's local Worker runtime currently requires an x64 Node process on Windows. On the Windows ARM machine used to build this project, the ignored `.sites-runtime/node-x64/node.exe` runtime is available. Put that directory first on PATH before `npm run dev`, `npm run build`, or Drizzle/Wrangler commands. Pure TypeScript checks and the Node SQLite tests can use the native Node 26 runtime.

Run `npm run build` before the first local database migration. Apply the SQL files in `drizzle/` in filename order using:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_blushing_captain_stacy.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_nostalgic_albert_cleary.sql
```

Only execute unapplied migration files. Migrations contain schema changes, not demonstration community data. Sites applies packaged migrations to its hosted database.

## Verify

`npm run typecheck` checks the application. `npm test` runs twelve behavioral tests using the actual TypeScript route logic and SQL against an isolated in-memory SQLite database. The tests require Node 26 or a Node release with `node:sqlite`. They cover triage distinctions, filtering, private-record ownership, CSRF, bounded writes, input validation, moderation, source redirects, timezone exports, and reminder uniqueness.

Browser checks use the real local app and database. Test posts are clearly labeled and stay in the ignored local database; they are not shipped as seed content. See [launch readiness](docs/launch-readiness.md) for the recorded journeys and remaining verification.

## Configuration and architecture

The project uses TypeScript, React, Vinext, Tailwind, the supplied component library, and Cloudflare D1. `app/` contains views and APIs; `lib/` contains original content, deterministic recovery rules, calendar exports, validation, and source-link policy. `db/schema.ts` and `drizzle/` define persistent records.

`.openai/hosting.json` retains the registered Site ID and logical DB binding. Manage deployed runtime values through Sites. `RECLAIM_ADMIN_IDS` is a comma-separated allowlist of authenticated user IDs. Obtain an ID from the authenticated `/api/me` response; do not infer it from an email or trust a community nickname. See [.env.example](.env.example). No first visitor is automatically promoted. Application roles do not override the Site's audience controls.

Guest answers and plans live in React memory. Browser saving is a separate opt-in. Account sync is explicit. Public guide caching is opt-in; APIs and private routes are excluded. No advertising analytics, session replay, AI service, email sender, or push subscription is configured.

Documentation: [source coverage](docs/source-coverage.md), [editorial and moderation](docs/editorial-and-moderation.md), [privacy and storage](docs/privacy-and-storage.md), [launch readiness](docs/launch-readiness.md).
