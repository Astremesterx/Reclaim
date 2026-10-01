# GitHub Pages edition

The public edition runs entirely in the visitor's browser. The repository also retains the full server application and its database routes.

## What works

- 28 original guides with official and specialist source links, search, category tabs, platform/device/effort/difficulty filters, and sorting.
- Adaptive triage, recovery checklists, blocked-step alternatives, progress, private notes, text exports, and printing.
- Session-only plans by default, with explicit browser saving and deletion controls. Theme and region preferences save separately.
- Midnight, Daylight, and High contrast themes; responsive layouts and keyboard navigation.
- Weekly, monthly, or one-time calendar exports generated locally. The user imports the file and configures notifications in their calendar.
- Sources, glossary, storage preferences, and edition-specific privacy information.

GitHub Pages cannot execute the application's server routes. This edition has no sign-in, account sync, account bookmarks, shared discussions, voting, moderation queues, crawling, or email/push delivery. Community and editorial pages explain this instead of offering broken controls. General guide corrections link to public GitHub issues; private incident information must stay out of those issues.

The guides have not received independent specialist review. No exhaustive coverage or recovery outcome is promised. GitHub Pages logs visitor IP addresses for security purposes; see [GitHub's hosting documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Build and preview

```sh
npm ci
npm run typecheck
npm test
npm run build:pages
npm run preview:pages
```

The default preview is `http://127.0.0.1:5174/Reclaim/`. Native build dependencies on this Windows ARM checkout use the local x64 Node runtime described in the README. CI uses Linux with Node 26 for the SQLite behavior tests.

`vite.pages.config.ts` uses the GitHub project base path `/Reclaim/`. `PAGES_BASE_PATH` can override it, and an empty string builds for a custom domain root. Only `.github-pages-dist/` is uploaded. The output contains public HTML, JavaScript, CSS, the favicon, and the manifest. It excludes database files, server bundles, runtime configuration, and credentials.

Routes use hashes: `https://astremesterx.github.io/Reclaim/#/guides/google-account`. Refreshing or opening a shared guide URL requests the project homepage, avoiding server rewrite requirements. In-page accessibility anchors preserve the current application route.

## Deployment

In the repository's **Settings → Pages**, set **Source → GitHub Actions**. `.github/workflows/github-pages.yml` checks types and behavior, builds the static edition, uploads its public artifact, and deploys it. Every push to `main` runs this workflow; it can also be started manually in Actions. The deploy step reports the current site URL.

No extra deployment token is needed. The deploy job uses GitHub's short-lived workflow identity and the `github-pages` environment. Check the latest workflow's result before assuming a pushed change is live.

Changes to the full server application require a separate server-capable deployment. The Pages workflow never deploys server routes or changes the existing Site's audience.

## Storage and connectivity

Plans remain in React memory unless a user enables device saving. Saved plans use `reclaim-pages-*` local-storage keys, separate from the full app's keys. Local storage is not encrypted by RECLAIM. Turning saving off removes the stored copy; clearing a plan removes both the active session and the stored copy. Exported and printed files are controlled by the user.

There is no offline service worker in this edition. An already open plan can remain usable without a connection, but the first visit, reloads, and provider source links require connectivity. Export a checklist before going offline.
