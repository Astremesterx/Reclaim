"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Sun, Moon, Globe2, UserRound, WifiOff, Menu } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useApp } from "./provider";
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem} from "@/components/ui/dropdown-menu";
import HomeView from "./home";
import { GuideLibrary, GuideView, TriageView } from "./guide-views";
import { RecoveryView, ProtectView } from "./recovery-views";
import { CommunityView, DiscussionView } from "./community-views";
import { SourcesView, PrivacyView, GlossaryView, AccountView, AdminView } from "./extra-views";
import { getGuide, regions } from "@/lib/catalog";
import { searchGuides, planSteps } from "@/lib/recovery";
import { EmptyState } from "./ui";
import { pageTitle } from "@/lib/page-metadata";
import { GITHUB_PAGES } from "@/lib/deployment";
import { PagesServerFeature, PagesPreferencesView, PagesPrivacyView } from "./pages-views";
export default function ReclaimApp() {
    const path = usePathname() || '/', router = useRouter(), app = useApp(), ref = useRef(app);
    ref.current = app;
    const [offline, setOffline] = useState(false);
    useEffect(() => { const update = () => setOffline(!navigator.onLine); update(); window.addEventListener('online', update); window.addEventListener('offline', update); return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); }; }, []);
    useEffect(() => { document.title = pageTitle(path); window.scrollTo(0, 0); }, [path]);
    useEffect(() => { const ctx = (document as any).modelContext; if (!ctx?.registerTool)
        return; const lifecycle = new AbortController(); const register = (t: any) => { try {
        Promise.resolve(ctx.registerTool(t, { signal: lifecycle.signal })).catch(() => { });
    }
    catch { } }; register({ name: 'search_recovery_guides', title: 'Search recovery guides', description: 'Find source-backed guide summaries. Does not save the query or change a plan.', inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 400 } }, required: ['query'], additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: async (input: any) => { if (!input || typeof input.query !== 'string' || input.query.length > 400 || Object.keys(input).some(k => k !== 'query'))
            throw new Error('Provide only a query string of up to 400 characters.'); return { guides: searchGuides(input.query).slice(0, 8).map(g => ({ id: g.id, title: g.title, url: `${GITHUB_PAGES ? "#" : ""}/guides/${g.id}`, review: g.review })) }; } }); register({ name: 'open_recovery_guide', title: 'Open a recovery guide', description: 'Navigate to an existing recovery guide. Does not create or replace a personal plan.', inputSchema: { type: 'object', properties: { guideId: { type: 'string' } }, required: ['guideId'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: async (input: any) => { if (!input || typeof input.guideId !== 'string' || Object.keys(input).some(k => k !== 'guideId') || !getGuide(input.guideId))
            throw new Error('Choose an existing guide ID.'); router.push(`/guides/${input.guideId}`); return { openedGuide: input.guideId }; } }); return () => lifecycle.abort(); }, [router]);
    let content;
    if (path === '/')
        content = <HomeView />;
    else if (path === '/help')
        content = <TriageView />;
    else if (path === '/guides')
        content = <GuideLibrary />;
    else if (path.startsWith('/guides/'))
        content = <GuideView key={path} id={path.split('/')[2]}/>;
    else if (path === '/recovery')
        content = <RecoveryView />;
    else if (path === '/protect')
        content = <ProtectView />;
    else if (path === '/community')
        content = GITHUB_PAGES ? <PagesServerFeature /> : <CommunityView />;
    else if (path.startsWith('/community/'))
        content = GITHUB_PAGES ? <PagesServerFeature /> : <DiscussionView id={path.split('/')[2]}/>;
    else if (path === '/sources')
        content = <SourcesView />;
    else if (path === '/privacy')
        content = GITHUB_PAGES ? <PagesPrivacyView /> : <PrivacyView />;
    else if (path === '/glossary')
        content = <GlossaryView />;
    else if (path === '/account')
        content = GITHUB_PAGES ? <PagesPreferencesView /> : <AccountView />;
    else if (path === '/editorial')
        content = GITHUB_PAGES ? <PagesServerFeature editorial /> : <AdminView />;
    else
        content = <main id="main" className="container page-content"><EmptyState title="Let’s get you back on track." body="That page is not available."><Link className="btn primary" href="/">Go to help</Link></EmptyState></main>;
    return <div className="app-shell"><a href="#main" className="skip-link">Skip to content</a><header className="site-header"><div className="nav-wrap"><Link href="/" className="brand" aria-label="RECLAIM home"><span className="brand-mark"><ShieldCheck size={23}/></span>reclaim<span className="brand-dot">.</span></Link><nav aria-label="Main navigation">{[['/help', 'Get help'], ['/guides', 'Browse guides'], ['/recovery', 'My recovery'], ['/community', 'Community'], ['/protect', 'Stay protected']].map(([href, label]) => <Link key={href} href={href} className={(href === '/' ? path === '/' || path === '/help' : path.startsWith(href)) ? 'active' : ''}><span className="nav-desktop">{label}</span><span className="nav-mobile">{href==='/help'?'Help':href==='/guides'?'Search':href==='/recovery'?'My plan':label}</span></Link>)}</nav><div className="header-tools"><DropdownMenu><DropdownMenuTrigger asChild><button className="icon-btn" aria-label="More pages"><Menu size={19}/></button></DropdownMenuTrigger><DropdownMenuContent align="end">{[["/protect","Stay protected"],["/sources","Our sources"],["/glossary","Glossary"],["/privacy","Privacy and safety"],["/account","Preferences and region"]].map(([href,label])=><DropdownMenuItem key={href} asChild><Link href={href}>{label}</Link></DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu><Globe2 size={17}/><Select value={app.region} onValueChange={app.setRegion}><SelectTrigger aria-label="Region" className="region-select"><SelectValue /></SelectTrigger><SelectContent>{regions.map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select><button className="icon-btn" aria-label={`Switch to ${app.theme === 'light' ? 'dark' : 'light'} theme`} onClick={() => app.setTheme(app.theme === 'light' ? 'dark' : 'light')}>{app.theme === 'light' ? <Moon size={19}/> : <Sun size={19}/>}</button><Link className="icon-btn" href="/account" aria-label="Account and preferences"><UserRound size={19}/></Link><Link href="/help" className="btn small primary">Get help now</Link></div></div></header>{GITHUB_PAGES && <div className="edition-notice"><span>GitHub Pages edition · Plans stay on this device.</span><Link href="/account">Storage preferences</Link></div>}{offline && <div className="offline-notice"><WifiOff size={16}/>{GITHUB_PAGES ? "You’re offline. Keep this page open or export your plan. Source links and page reloads need a connection." : "You’re offline. Saved public guides may be outdated; account and community changes need a connection."}</div>}{content}<footer className="site-footer"><div className="container footer-row"><Link href="/" className="brand">reclaim<span className="brand-dot">.</span></Link><p>Clear guidance. Your next step.</p><Link href="/sources">Our sources</Link><Link href="/glossary">Glossary</Link><Link href="/privacy">Privacy & safety</Link><Link href="/account">Preferences</Link>{app.user?.admin && <Link href="/editorial">Editorial</Link>}</div><div className="container footer-note">Independent recovery guidance. Not affiliated with the services referenced.</div></footer></div>;
}
