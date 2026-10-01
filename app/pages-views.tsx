"use client";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { regions } from "@/lib/catalog";
import { SOURCE_REPOSITORY } from "@/lib/deployment";
import { useApp } from "./provider";
import { PageHeading, Notice, Pick, download } from "./ui";
import { planText } from "./recovery-views";

export function PagesServerFeature({ editorial = false }: { editorial?: boolean }) {
  return <main id="main" className="container page-content prose-page">
    <PageHeading eyebrow="GITHUB PAGES EDITION"
      title={editorial ? "Editorial tools need a server." : "Community discussions need a server."}
      description="This edition brings recovery guides and personal checklists to GitHub Pages." />
    <section className="panel">
      <h2>{editorial ? "Review queues are unavailable here." : "Keep moving with a clear next step."}</h2>
      <p>Accounts, shared discussions, replies, votes, and moderation require a database and a running server. They are not connected on this site. Your recovery plan works in your browser without signing in.</p>
      <div className="action-row">
        <Link className="btn primary" href="/help">Find my next step</Link>
        <Link className="btn secondary" href="/guides">Browse guides</Link>
        <Link className="text-link" href="/recovery">My recovery plan</Link>
      </div>
    </section>
    <section className="panel">
      <h2>Help improve the guidance</h2>
      <p>The full application source includes the server and community features. You can suggest a general guide correction or report a website bug in the GitHub repository.</p>
      <Notice>GitHub issues are public. Share the guide title and the inaccurate step; keep account details, private incident notes, passwords, and codes out.</Notice>
      <a className="btn secondary spaced" href={`${SOURCE_REPOSITORY}/issues`} target="_blank" rel="noopener noreferrer">Open public feedback <ExternalLink size={16} /></a>
    </section>
  </main>;
}

export function PagesPreferencesView() {
  const app = useApp();
  return <main id="main" className="container page-content prose-page">
    <PageHeading eyebrow="SET UP YOUR SPACE" title="Your preferences. Your pace."
      description="Choose how RECLAIM looks and what stays on this device." />
    <section className="panel">
      <h2>Appearance and region</h2>
      <div className="filter-panel">
        <Pick label="Theme" value={app.theme} onChange={app.setTheme} options={[
          { id: 'dark', name: 'Midnight' }, { id: 'light', name: 'Daylight' }, { id: 'contrast', name: 'High contrast' },
        ]} />
        <Pick label="Region" value={app.region} onChange={app.setRegion} options={regions} />
        <label className="field"><span>Language</span><input className="text-input" value="English" readOnly aria-label="Current language" /></label>
      </div>
      <p className="small">Theme and region preferences are saved in this browser. Region changes suggested resources; it does not detect your location. Additional languages need reviewed translations.</p>
    </section>
    <section className="panel">
      <div className="switch-row">
        <div><h2>Remember my recovery plan</h2><p>Off by default. Enable this only on a browser profile you trust. Saved answers, progress, and notes are not encrypted by RECLAIM.</p></div>
        <Switch checked={app.persist} onCheckedChange={app.setPersist} aria-label="Remember my recovery plan" />
      </div>
      <Notice>{app.persist ? 'Device saving is on. Your plan can be restored when you return in this browser.' : 'Session-only mode: reloading or closing the page discards your plan. Export a copy if you want to keep it.'} Turning saving off removes the saved plan while keeping your current session available.</Notice>
      <div className="action-row">
        <button className="btn secondary" disabled={!app.plan} onClick={() => app.plan && download('reclaim-private-plan.txt', planText(app.plan))}><Download size={16} />Export my plan</button>
        <Link className="text-link" href="/recovery">Open or clear my current plan</Link>
      </div>
    </section>
    <Notice>GitHub Pages hosts this edition. There are no accounts, account sync, or shared community records. Calendar exports work with your own calendar app. <Link className="text-link" href="/privacy">Read storage and safety details</Link></Notice>
  </main>;
}

export function PagesPrivacyView() {
  return <main id="main" className="container page-content prose-page">
    <PageHeading eyebrow="PRIVACY & SAFETY" title="Clear choices about your information."
      description="How the GitHub Pages edition stores plans and helps you use guidance safely." />
    {[
      ['Your recovery plan', 'Answers, checklist progress, and notes stay in this page’s memory by default. Reloading or closing the page loses that session. If you choose device saving, RECLAIM stores the current plan in browser local storage. It is not encrypted by the app, and other people with access to that browser profile may read it. Do not record passwords, verification codes, payment details, or private keys.'],
      ['Your controls', 'Turn off device saving in Preferences to remove the saved copy and keep working in the current session. Use Clear this guest plan in My recovery to remove both copies. Text exports and printed copies remain wherever you save them. Browser backups or device backups may retain copies outside RECLAIM’s control. Theme and region preferences are saved separately.'],
      ['Accounts and community', 'This static edition does not have sign-in, account sync, bookmarks, shared discussions, or moderation. It does not send recovery answers or notes to a RECLAIM database. General corrections can be suggested in public GitHub issues; those use GitHub’s own account and privacy rules. Never post private incident details there.'],
      ['Calendar check-ins', 'Recurring calendar files are generated in your browser with a generic security check-in title. Import a file into your calendar and choose its notifications. RECLAIM does not send email or push reminders, monitor your devices, or update events after import.'],
      ['Sources and limits', 'The collection contains original summaries with links to official or specialist resources. Specialist review is pending. Check the source for current provider procedures. Recovery, refunds, malware removal, and complete safety are not guaranteed. For workplace incidents, follow your organization’s response procedure.'],
      ['Safer use during abuse', 'Use a device the person cannot access when possible. Changing settings may alert someone who monitors you. The quick-exit button navigates away; it does not erase browser history, downloads, saved plans, or monitoring. Seek specialist safety-planning support.'],
      ['Connectivity', 'A first visit or page reload requires an internet connection. This edition does not install an offline service worker. An already open checklist can remain usable when the connection drops, but official source links need a connection. Export useful steps in advance if you expect to be offline.'],
    ].map(([title, body]) => <section className="panel" key={title}><h2>{title}</h2><p>{body}</p></section>)}
    <section className="panel"><h2>Hosting and data minimization</h2><p>No advertising analytics or session replay is installed. GitHub provides the hosting infrastructure and logs visitor IP addresses for security purposes.</p><a className="text-link" href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages" target="_blank" rel="noopener noreferrer">GitHub Pages documentation <ExternalLink size={14} /></a></section>
    <Link className="btn secondary" href="/account">Manage my device preferences</Link>
  </main>;
}
