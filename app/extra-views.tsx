"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ShieldCheck, ExternalLink, Download, Globe2, LockKeyhole, Check, RefreshCw, UserRound } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { sources, guides, glossary, regions } from "@/lib/catalog";
import { useApp, api } from "./provider";
import { PageHeading, Notice, Pick, download } from "./ui";
import { toast } from "sonner";
export function SourcesView() { const [region, setRegion] = useState('all'); return <main id="main" className="container page-content"><PageHeading eyebrow="KNOW WHERE THE GUIDANCE COMES FROM" title="Sources you can check for yourself." description="Original summaries, direct references, and an honest record of what has been checked."/><div className="source-intro"><section className="panel"><BookOpen size={24}/><h3>Primary sources first</h3><p>Platform support, public cybersecurity agencies, and established specialist organizations.</p></section><section className="panel"><ShieldCheck size={24}/><h3>Clear about review status</h3><p>Research is not an independent expert review. These guides still need qualified specialist review before a public launch.</p></section><section className="panel"><RefreshCw size={24}/><h3>Made to be revisited</h3><p>Provider procedures change. Use the linked original and report a step that no longer matches.</p></section></div><div className="section-heading"><h2>{sources.length} research sources</h2><Pick label="Source region" value={region} onChange={setRegion} options={[{ id: 'all', name: 'All regions' }, ...regions]}/></div><div className="source-list">{sources.filter(s => region === 'all' || s.region === region || s.region === 'Global').map(s => <article className="source-row" key={s.id}><span className="source-logo">{s.name[0]}</span><div><h3>{s.name}</h3><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title} <ExternalLink size={13}/></a><small>{new URL(s.url).hostname} · {s.region} · {s.kind}</small></div><span className={`pill ${s.status === 'needs-recheck' ? 'warning' : ''}`}>{s.status === 'retrieved' ? 'Content retrieved' : s.status === 'search-confirmed' ? 'Search confirmed' : 'Recheck needed'}</span><span className="small-label">{s.checked}</span></article>)}</div><Notice>“Retrieved” means the source was available during research. It does not mean every recovery process was tested, and it does not mean a provider endorses RECLAIM. Regional advice may not apply elsewhere.</Notice><section className="panel"><h2>Coverage and current limits</h2><p className="spaced">{guides.length} guides cover common account, fraud, device, malware, and privacy situations. The current edition is English. Bank-specific disputes, carrier-specific steps, gaming services, router models, password-manager incidents, and many local reporting systems need further research. We do not claim to cover every incident.</p><Link href="/community" className="text-link">Suggest a missing topic</Link></section></main>; }
export function PrivacyView() {
    return <main id="main" className="container page-content prose-page"><PageHeading eyebrow="YOUR INFORMATION STAYS YOURS" title="Privacy, safety, and community care." description="Understand what gets saved, who can see it, and where RECLAIM’s help ends."/>{[
            ['Guest recovery', 'Your answers and plan stay in this browser session unless you opt into device saving or explicitly sync the plan to your account. Device saving is not encrypted against someone with access to the browser profile. On a borrowed or monitored device, use the session-only mode and consider exporting only to a safe location.'],
            ['Private account storage', 'Account sync stores your chosen recovery plan, notes, bookmarks, display name, and check-ins in the application database. These records are access-controlled by your signed-in identity. The service operator may administer the database; this is not end-to-end encryption. Keep secrets and identity documents out of notes.'],
            ['Public contributions', 'Questions and replies are visible to people who can access this site. Use a pseudonym and review your text before posting. Automated checks can miss private information. Do not upload intimate imagery, suspicious programs, credentials, or identity documents. Attachments and direct messages are not enabled.'],
            ['Community rules', 'Be kind. Explain uncertainties. No harassment, impersonation, doxxing, spam, requests for codes, paid recovery offers, or remote-access solicitation. Links and potentially unsafe solicitations may wait for moderation. Accepted answers reflect the question author’s experience; they are not certified guidance.'],
            ['Reports and review', 'Use Report beside a discussion or reply to submit concerns. Moderators can remove content and record the action. Guide corrections are queued for editorial review. Moderator and expert roles are not automatically awarded by popularity. A response time is not guaranteed.'],
            ['Your choices', 'You can clear the current guest plan, disable device saving, export private data, and delete your account’s private plans and preferences in Account settings. Deleting private data does not delete previously posted discussions or reports. Contact the site operator for requests involving public content and retained audit records.'],
            ['Notifications and monitoring', 'RECLAIM does not monitor your devices or financial accounts. Email and push delivery are not configured. Calendar files must be imported into your own calendar. Changing or deleting a check-in here does not modify a calendar event already imported elsewhere.'],
            ['Sources and limitations', 'Guide summaries link to primary or specialist sources. Research dates and availability checks are distinct from independent expert review. No provider recovery, refund, malware removal, or complete safety outcome is guaranteed. For a workplace incident, use your organization’s response procedure.'],
            ['Safer use during abuse', 'If someone may monitor your activity, seek help from a device they cannot access when possible. Changing settings may alert them. The quick-exit button only navigates away; it does not erase browser history, stored files, or monitoring. Use specialist safety-planning support.'],
            ['Data minimization', 'No advertising analytics or session replay is installed. The app does not request your third-party passwords, one-time codes, seed phrases, or private keys. Standard hosting infrastructure may process operational request logs. No automated retention or deletion deadline is promised; operational retention policy must be finalized before a public launch.']
        ].map(([title, text]) => <section className="panel" key={title}><h2>{title}</h2><p>{text}</p></section>)}</main>;
}
export function GlossaryView() { const [q, setQ] = useState(''); return <main id="main" className="container page-content prose-page"><PageHeading eyebrow="A LITTLE LESS JARGON" title="Security, in plain language." description="Short explanations for terms you may see during recovery."/><input className="text-input full" aria-label="Find a security term" value={q} onChange={e => setQ(e.target.value)} placeholder="Find a term…"/><div className="stack spaced">{Object.entries(glossary).filter(([k, v]) => (k + ' ' + v).toLowerCase().includes(q.toLowerCase())).map(([k, v]) => <section className="panel" key={k}><h2>{k}</h2><p>{v}</p></section>)}</div></main>; }
export function AccountView() { const app = useApp(); const [alias, setAlias] = useState(app.user?.alias || ''), [clear, setClear] = useState(false), [busy, setBusy] = useState(false), [offline, setOffline] = useState(false); useEffect(() => { setAlias(app.user?.alias || ''); }, [app.user]); return <main id="main" className="container page-content prose-page"><PageHeading eyebrow="SET UP YOUR SPACE" title="Your preferences. Your pace." description="Choose what to save and how you use RECLAIM."/><section className="panel"><h2>Appearance and region</h2><div className="filter-panel"><Pick label="Theme" value={app.theme} onChange={app.setTheme} options={[{ id: 'dark', name: 'Midnight' }, { id: 'light', name: 'Daylight' }, { id: 'contrast', name: 'High contrast' }]}/><Pick label="Region" value={app.region} onChange={app.setRegion} options={regions}/><label className="field"><span>Language</span><input className="text-input" value="English" readOnly aria-label="Current language"/></label></div><p className="small">Additional languages need reviewed translations. Region changes resource suggestions; it does not reveal your location.</p></section><section className="panel"><h2>Your account</h2>{app.user ? <><p>Your account is signed in. Use a display name for community contributions.</p><label className="field spaced"><span>Community display name</span><input className="text-input" maxLength={28} value={alias} onChange={e => setAlias(e.target.value)} placeholder="Choose a nickname"/></label><div className="action-row"><button className="btn primary" disabled={alias.trim().length < 3} onClick={async () => { try {
    await api('/api/private', { action: 'profile', alias });
    await app.refreshUser();
    toast.success('Display name saved.');
}
catch (e: any) {
    toast.error(e.message);
} }}>Save display name</button><a className="btn secondary" href="/signout-with-chatgpt?return_to=/" target="_top">Sign out</a></div></> : <><p>Guest guides and plans are free to use. Sign in to sync plans and join discussions.</p><a className="btn primary spaced" href="/signin-with-chatgpt?return_to=/account" target="_top">Sign in with ChatGPT</a><p className="small spaced">Authentication uses the hosting platform. Independent email sign-in and app-managed passkeys are not configured.</p></>}</section><section className="panel"><h2>Private data controls</h2><p>Export or clear private account data. Existing public discussions and audit records are handled separately.</p><div className="action-row"><button className="btn secondary" disabled={!app.user} onClick={async () => { try {
    const data = await api('/api/private');
    download('reclaim-private-data.json', JSON.stringify(data, null, 2), 'application/json');
}
catch (e: any) {
    toast.error(e.message);
} }}><Download size={16}/>Export private account data</button><button className="btn secondary" disabled={!app.user} onClick={() => setClear(true)}>Delete private account data</button></div><button className="text-link spaced" onClick={() => { app.setPersist(false); toast.success('Device saving is off. Your current session stays available.'); }}>Use session-only mode on this device</button></section><section className="panel"><h2>Public guides for offline use</h2><p>Save pages you visit for low-connectivity situations. Private plans and account pages are excluded. Saved guides may become outdated.</p><button className="btn secondary spaced" disabled={offline} onClick={async () => { try {
    if (!('serviceWorker' in navigator))
        throw new Error('This browser does not support offline guides.');
    const r = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    r.active?.postMessage({ type: 'CACHE_PUBLIC', urls: ['/', '/guides', '/sources', '/privacy', ...Array.from(document.querySelectorAll('script[src],link[rel="stylesheet"]')).map(x => (x as HTMLScriptElement).src || (x as HTMLLinkElement).href)] });
    setOffline(true);
    toast.success('Offline saving enabled. Revisit public guides while online to cache them.');
}
catch (e: any) {
    toast.error(e.message);
} }}>{offline ? 'Offline saving enabled' : 'Enable offline guide saving'}</button><button className="muted-button" onClick={async () => { if ('serviceWorker' in navigator) {
    const rs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(rs.filter(r => r.active?.scriptURL.endsWith('/sw.js')).map(r => r.unregister()));
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.startsWith('reclaim-public-')).map(n => caches.delete(n)));
} setOffline(false); toast.success('Offline guide cache cleared.'); }}>Clear offline guides</button></section><AlertDialog open={clear} onOpenChange={setClear}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete private account data?</AlertDialogTitle><AlertDialogDescription>This deletes synced plans, check-ins, bookmarks, and your display-name preference. Export first if you need a copy. Public contributions are not deleted.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={async () => { setBusy(true); try {
    await api('/api/private', { action: 'delete-private-data' });
    await app.refreshUser();
    await app.refreshPrivate();
    toast.success('Private account data deleted.');
}
catch (e: any) {
    toast.error(e.message);
}
finally {
    setBusy(false);
} }}>Delete private data</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></main>; }
export function AdminView() { const app = useApp(), [data, setData] = useState<any>(null), [error, setError] = useState(''); const load = () => api('/api/admin').then(setData).catch(e => setError(e.message)); useEffect(() => { if (app.user?.admin)
    void load(); }, [app.user]); const moderate = async (table: string, id: string, status: string) => { try {
    await api('/api/admin', { action: 'moderate', table, id, status });
    await load();
    toast.success('Moderation action recorded.');
}
catch (e: any) {
    toast.error(e.message);
} }; return <main id="main" className="container page-content"><PageHeading eyebrow="EDITORIAL WORKSPACE" title="Keep the guidance useful and the community safe." description="A protected queue for reports, corrections, and source availability checks."/>{!app.user?.admin ? <Notice>Editorial access is restricted. The site operator must configure an administrator allowlist before these tools can be used. Reading public guides does not require this role.</Notice> : error ? <Notice>{error}</Notice> : !data ? <p>Loading review queues…</p> : <><div className="source-intro">{[['Questions', data.posts.length], ['Replies', data.comments.length], ['Reports & corrections', data.reports.length]].map(([t, n]) => <section className="panel" key={t}><span className="eyebrow">{t}</span><h2>{n} pending</h2></section>)}</div>{(['posts', 'comments', 'reports'] as const).map(table => <section className="panel" key={table}><h2>{table === 'reports' ? 'Reports and corrections' : table}</h2>{!data[table].length ? <p>No items waiting for review.</p> : data[table].map((r: any) => <article className="queue-item" key={r.id}><h3>{r.title || r.target || r.alias}</h3><p className="preserve-lines">{r.body || r.reason}</p><div className="action-row">{table !== 'reports' && <button className="btn primary" onClick={() => moderate(table, r.id, 'published')}>Approve</button>}<button className="btn secondary" onClick={() => moderate(table, r.id, table === 'reports' ? 'closed' : 'removed')}>{table === 'reports' ? 'Close report' : 'Remove'}</button></div></article>)}</section>)}<section className="panel"><h2>Source availability</h2><p>A reachable link still requires content review. Checks never publish new instructions.</p>{sources.map(s => <div className="source-row" key={s.id}><div><h3>{s.name}</h3><p>{s.title}</p></div><button className="btn secondary" onClick={async () => { try {
    const r = await api('/api/admin', { action: 'check-source', id: s.id });
    toast.info(`${s.name}: ${r.status}`);
    await load();
}
catch (e: any) {
    toast.error(e.message);
} }}>Check link</button></div>)}</section></>}</main>; }
