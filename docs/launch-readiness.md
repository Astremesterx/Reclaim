# Launch readiness — October 1, 2026

This is a working build for an owner-private preview. This report records local validation; deployment status is confirmed separately through Sites. Application workflows operate, but the collection is not independently reviewed or certified. Keep the private audience until the editorial, moderation, and operational requirements below are resolved.

## Working and verified

- 28 original guides, 30 source records, step-level references, official destination domains, and visible specialist-review status.
- A 4–7 question triage flow distinguishing link-only exposure, passwords/codes, installed software, connected apps, financial loss, missing devices, account access, abuse concerns, and recurring activity.
- Guest plans with blocked/waiting/skipped states, checks, alternatives, private notes, previous/next navigation, printable full checklists, and text export. Device saving is off by default. Account saving is explicit.
- Account-scoped plans, bookmarks, check-ins, export and deletion, using the hosting platform's authentication.
- Weekly/monthly calendar exports with IANA timezone transitions for seven years; identical exports reuse an event UID. The calendar app owns delivery and notification consent. Account check-ins deduplicate identical saves and can be paused or removed.
- Community questions, privacy review, threaded replies, unique votes, bookmarks, author-selected accepted answers, resolution, reporting, muting, and protected moderation queues. Community text is plain text. External URLs and solicitation patterns require review.
- Three themes, compact phone navigation, search filters, empty/loading/error states, glossary, contextual safety guidance, regional fraud resources, and opt-in public guide caching.
- Protected manual source availability checks using approved HTTPS publishers and bounded redirects. Checks do not publish or verify instructions.

## Validation

Twelve automated behavioral tests pass, along with TypeScript checking, migration integrity checking, and a production build. Route tests exercise actual validation, authorization, and parameterized SQL against isolated SQLite. This does not substitute for a deployed identity/proxy or D1 audit.

The complete npm dependency audit, including development tools, reports zero known advisories on October 1, 2026. Next, React server components, and Vite were patched; scoped transitive overrides patch image metadata parsing, local networking, and WebSocket tooling. Esbuild is deduplicated to its patched release. The database-tool check and production build validate these overrides. This is a dated registry check, not a security certification; rerun it when dependencies change.

Browser verification on the local Worker preview includes symptom search with a common typo, combined platform filters, a no-result state, seven-question locked-out Google triage, recording a blocked step, explicit device-saving consent, sign-in reload and account save, and a question/reply/vote/accepted-answer journey. A check-in was saved twice without duplication and paused successfully. WebMCP search and guide navigation work; an unknown guide ID is rejected, and navigation retains the active plan. Layouts were inspected at 390 × 844 and 1440 × 1000 with no horizontal overflow. Local sign-in is a mock account; production sign-in must be reviewed by the owner after deployment.

The core printed checklist uses print CSS, but physical printer output and individual calendar applications are not verified. Calendar format is verified in automated tests; the browser automation did not confirm receipt of a downloaded calendar file. Notification delivery is unavailable. Offline caching is opt-in and excludes private routes; offline behavior needs device-specific testing on the deployed app. WCAG 2.2 AA and Core Web Vitals are targets, not achieved certifications or fabricated scores.

## Required before public launch

1. Qualified review for financial, stalking, image-abuse, malware, and other sensitive recovery instructions. Test provider workflows with suitable test accounts and document the platform/version and date.
2. Configure administrator identities, staffing, community escalation, appeals, removal/restore policy, and response expectations. The administrator allowlist is deliberately empty until the operator configures it.
3. Complete precise source retrieval/version metadata, permitted-use records, a robots-aware extraction pipeline, content-change review, rollback, configurable freshness intervals, and scheduled source rechecks. This release uses researched original summaries and manual link checks; it has not crawled the internet exhaustively.
4. Expand platform-specific, bank/carrier, gaming, router, developer, and regional coverage. Validate eligibility and jurisdiction-specific reporting details continually.
5. Finalize retention, backup/restore testing, operator access, public-content deletion, abuse-rate policy, and incident response. Review hosted identity and reverse-proxy boundaries.
6. Add reviewed translations and independent account recovery methods if needed. English and hosting-platform sign-in are the configured options.
7. Connect email/push delivery only after opt-in, unsubscribe, retries, idempotency, timezone, and privacy testing. Saved check-ins currently record preferences; imported calendar events deliver reminders.
8. Build the expanded editorial CMS, guide versions/rollback, contributor edit history, expert verification, attachment moderation, and consent audit if those features are enabled. Direct messages and attachments are currently disabled.

AI is optional and unconfigured. Existing guide and recovery functionality works without it. No automated malware scanning, device tracking, account recovery, refund, or safety guarantee is claimed.
