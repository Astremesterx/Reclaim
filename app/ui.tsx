"use client";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Search, ExternalLink, BookOpen, Clock, Bookmark, ShieldCheck, Info } from "lucide-react";
import Link from "next/link";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useApp } from "./provider";
import { getSource, type Guide } from "@/lib/catalog";
import { toast } from "sonner";
import { GITHUB_PAGES } from "@/lib/deployment";
import { Empty, EmptyHeader, EmptyMedia, EmptyContent } from "@/components/ui/empty";
export function Pick({ label, value, onChange, options }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: (string | {
        id: string;
        name: string;
    })[];
}) { return <label className="field"><span>{label}</span><Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="w-full h-11"><SelectValue /></SelectTrigger><SelectContent>{options.map(o => <SelectItem key={typeof o === 'string' ? o : o.id} value={typeof o === 'string' ? o : o.id}>{typeof o === 'string' ? o : o.name}</SelectItem>)}</SelectContent></Select></label>; }
export function SearchBox({ compact = false }: {
    compact?: boolean;
}) { const app = useApp(), router = useRouter(); const [q, setQ] = useState(app.query); return <form className={`searchbar ${compact ? 'compact' : ''}`} onSubmit={e => { e.preventDefault(); app.setQuery(q); router.push('/guides'); }}><Search size={21}/><input value={q} onChange={e => setQ(e.target.value)} aria-label="Describe your problem" placeholder="What happened? e.g. someone changed my Gmail password" maxLength={400}/><button type="submit" className="btn primary">Find help</button></form>; }
export function GuideCard({ guide: g }: {
    guide: Guide;
}) { const app = useApp(); return <article className="guide-card"><div className="guide-meta"><span className="pill">{g.platform}</span><span><Clock size={13}/>{g.minutes} min effort</span></div><Link href={`/guides/${g.id}`}><h3>{g.title}</h3><p>{g.description}</p></Link><div className="guide-card-footer"><span><BookOpen size={14}/>{getSource(g.sourceIds[0]).name} source</span>{!GITHUB_PAGES && <button className={`icon-btn ${app.privateData.bookmarks.includes(g.id) ? 'selected' : ''}`} onClick={() => app.bookmark(g.id).catch(e => toast.error(e.message))} aria-label={`Bookmark ${g.title}`}><Bookmark size={17}/></button>}</div></article>; }
export function SourceLink({ id }: {
    id: string;
}) { const s = getSource(id); return <a className="source-link" href={s.url} target="_blank" rel="noopener noreferrer"><span><strong>{s.name}</strong><small>{s.title}</small><small>{new URL(s.url).hostname}</small></span><ExternalLink size={16}/></a>; }
export function Notice({ children, tone = "info" }: {
    children: ReactNode;
    tone?: string;
}) { return <div className={`notice ${tone}`}><Info size={18}/><div>{children}</div></div>; }
export function PageHeading({ eyebrow, title, description, action }: {
    eyebrow: string;
    title: string;
    description: string;
    action?: ReactNode;
}) { return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>; }
export function EmptyState({ title, body, children }: {
    title: string;
    body: string;
    children?: ReactNode;
}) { return <Empty className="empty-state"><EmptyHeader><EmptyMedia className="topic-icon mint"><ShieldCheck size={28}/></EmptyMedia><h2>{title}</h2><p>{body}</p></EmptyHeader><EmptyContent>{children}</EmptyContent></Empty>; }
export function FinancialResources(){const {region}=useApp();return <Notice tone="caution"><strong>Money at risk? Contact your bank or payment provider now.</strong><p>Use its official app or the number on your card. You can return to the checklist afterward.</p>{region==="India"?<><p>India: I4C lists <a className="text-link" href="tel:1930">1930</a> for financial cyber-fraud reporting. Check the official portal for current procedures.</p><SourceLink id="india-helpline"/></>:region==="United States"?<SourceLink id="scam"/>:region==="United Kingdom"?<><SourceLink id="uk-fraud"/><p className="small">This service covers England, Wales and Northern Ireland. Its guidance directs people in Scotland to Police Scotland.</p></>:region==="Australia"?<SourceLink id="australia"/>:<p>Choose your region in Preferences for supported local resources. For other locations, use your bank and your local official reporting service.</p>}<Link href="/guides/payment-fraud" className="text-link">Open immediate recovery steps</Link><Link href="/account" className="text-link">Change region</Link></Notice>}
export function SafetyExit(){return <div className="safety-exit"><a className="btn secondary" href="https://www.wikipedia.org/" target="_top" rel="noreferrer">Quick exit</a><p className="small">Navigates to Wikipedia. It does not erase browser history, downloads, or monitoring.</p></div>}
export function download(name: string, text: string, type = 'text/plain') { const u = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement('a'); a.href = u; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(u), 1000); }
