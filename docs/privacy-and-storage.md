# Privacy and storage

Guest plans remain in browser memory by default. Opting into device saving writes a validated plan to this browser profile's localStorage. Disabling saving removes the stored plan but preserves the current session. Clearing the guest plan removes the session and browser copies; explicitly synced account copies are managed separately.

Account sync writes a plan payload, answers, notes, timestamps, and guide version to D1 under the authenticated owner's ID. Bookmarks, display-name preferences, and check-ins are similarly scoped. The app uses parameterized queries and checks ownership before overwriting a saved plan. Every write requires an authenticated identity, same-origin request and application request header. Writes are bounded to 64 KB and thirty requests per account per minute.

The app does not encrypt plan fields end-to-end. Access is controlled by application queries and the hosting platform. The service operator can administer the database. The platform handles transport and infrastructure storage; this project makes no independently verified encryption-at-rest or compliance claim. Never store credentials, identity documents, or abusive imagery in notes.

Account export includes plans, reminders and bookmarks. Deleting private account data removes those records and the display-name preference. Community contributions, reports, rate-limit buckets, and audit records have separate purposes and are not deleted by this control. Operational retention and public-content removal procedures must be completed before launch.

Public guide caching is opt-in. The service worker excludes API, account, community, recovery and reminder pages. Browser-saved plans are independent of this cache. Standard infrastructure may process request logs. Application errors log an error type, not incident narratives. There is no advertising analytics, session replay, external AI transfer, hidden evidence upload, or device/account monitoring.

Calendar files use a generic title in the UI. Importing shares that generic event with the user's chosen calendar, which owns notifications. Removing a saved check-in does not delete a separately imported event.
