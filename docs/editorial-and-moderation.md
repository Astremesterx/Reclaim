# Editorial and moderation

Guide summaries live in `lib/catalog.ts`. Recovery routing lives separately in `lib/recovery.ts`. Every step links to a registered primary or specialist source. Check new claims against the actual linked instructions, scope them by provider and region, and review them before publication. Increment a guide version when instructions change. The current model records a version number; it does not yet preserve complete past guide bodies or offer rollback.

The `/editorial` console requires an exact authenticated user ID in the Worker's `RECLAIM_ADMIN_IDS` allowlist. Authentication is delegated to the hosting platform. Do not grant roles from names, cookies, popularity, or the first account created. The hosted deployment starts with no application administrator configured.

Moderation queues contain questions/replies with links or potential recovery solicitations, plus user reports and guide corrections. Pending contributions are visible to their author and authorized moderators. Check links and advice before approval. Remove unsafe contributions and record the action. Report closure records an audit event; it does not guarantee that the issue was fixed.

Community content is plain text; arbitrary HTML is never interpreted as markup. Sensitive-pattern checks reject common email addresses, long account numbers, secret assignments and keys. Checks cannot detect every private detail, so the UI includes a preview. Replies are bounded to four visible nesting levels. Accepted answers express the author’s experience and never award expert status.

Manual source checks use HEAD requests, an approved publisher registry, HTTPS, no embedded credentials, a timeout, and at most three requests. Every redirect is validated before fetching. The API takes a registered source ID; it cannot fetch a user-supplied suspicious URL. HTTP success or an ETag indicates availability, not content retrieval, expert review, or workflow testing. DNS and hosting controls remain part of deployment security review.

Future ingestion should follow Discover → Fetch → Extract → Deduplicate → Classify → Draft → Review → Publish → Recheck. Use publisher permissions, robots/terms checks, response limits and per-domain backoff. Treat fetched text as data and isolate it from private records and secrets. Do not automatically publish sensitive instructions from generated drafts.

Before wider launch, add contributor revision history, appeals, expert verification, full guide/version management, source diffs and rollback, moderation staffing and operational retention rules. These are not presented as completed capabilities in the current interface.
