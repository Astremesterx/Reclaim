"use client";
import Link from "next/link";
import { SearchBox, GuideCard } from "./ui";
import { useApp } from "./provider";
import { getGuide } from "@/lib/catalog";
import { ShieldCheck, Search, KeyRound, Link2, Wallet, Smartphone, Bug, Fingerprint, CircleHelp, BookOpen, LockKeyhole, Check, Globe2, Sun, ChevronRight, LifeBuoy } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
const topics = [
    { icon: KeyRound, title: "My account was hacked", text: "Recover access and secure your accounts.", category: "accounts", color: "mint" },
    { icon: Link2, title: "I clicked something suspicious", text: "Find out what to do after a link or message.", category: "phishing", color: "blue" },
    { icon: Wallet, title: "My money or identity is at risk", text: "Act on fraud and protect your information.", category: "money", color: "peach" },
    { icon: Smartphone, title: "My device is lost or stolen", text: "Protect your accounts and personal data.", category: "devices", color: "violet" },
    { icon: Bug, title: "Something is wrong with my device", text: "Work through malware and unusual activity.", category: "malware", color: "pink" },
    { icon: Fingerprint, title: "I'm being monitored or harassed", text: "Find support that puts your safety first.", category: "safety", color: "cyan" },
];
export default function HomeView() {
    const app = useApp();
    return (<main id="main" className="container"><section className="hero"><div className="eyebrow"><span className="tiny-line"/> A CLEARER PATH FORWARD</div><h1>Take back control<br />of your <span>digital life.</span></h1><p>Something happened online. You don’t have to figure it out alone.<br className="desktop"/> Find clear guidance and take your next step with confidence.</p><SearchBox /><div className="hero-trust"><span><Check size={14}/>Free recovery guidance</span><span><LockKeyhole size={14}/>No account needed</span><span><BookOpen size={14}/>Official sources, clear steps</span></div></section>
  {app.plan && <section className="confidence-strip"><div className="strip-icon"><ShieldCheck size={27}/></div><div><h3>Pick up where you left off.</h3><p>{getGuide(app.plan.guideId)?.title}</p></div><Link href="/recovery" className="btn primary">Resume my plan</Link></section>}
  <section className="topic-section"><div className="section-heading"><div><span className="eyebrow">LET’S START HERE</span><h2>What are you dealing with?</h2></div><Link className="text-link" href="/help"><CircleHelp size={17}/> I’m not sure</Link></div><div className="topic-grid">{topics.map(t => <Link href={`/help?category=${t.category}`} className="topic-card" key={t.category}><span className={`topic-icon ${t.color}`}><t.icon size={23}/></span><h3>{t.title}</h3><p>{t.text}</p><span className="card-footer">Find your next step <ChevronRight size={16}/></span></Link>)}</div></section>
  <section className="confidence-strip"><div className="strip-icon"><LifeBuoy size={27}/></div><div><h3>A little clarity goes a long way.</h3><p>Tell us what happened. We’ll help you put the next steps in order.</p></div><Link href="/help" className="btn secondary">Build my recovery plan</Link></section>
  <section className="bottom-section"><div><span className="eyebrow">ONE STEP AT A TIME</span><h2>A way forward, without the overwhelm.</h2></div><div className="three-steps">{[["01", "Understand what happened", "A few simple questions help narrow down your situation."], ["02", "Follow your recovery plan", "Clear, practical steps with official resources along the way."], ["03", "Feel more prepared", "Follow-up checks and small habits for the days ahead."]].map(([n, t, d]) => <article key={n}><span className="step-number">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
  <section className="featured-section"><div className="section-heading"><div><span className="eyebrow">PRACTICAL STARTING POINTS</span><h2>Clear guides. Useful next steps.</h2></div><Link className="text-link" href="/guides">Browse all guides <ChevronRight size={16}/></Link></div><div className="guide-grid">{["google-account", "suspicious-link", "repeat-compromise"].map(id => <GuideCard key={id} guide={getGuide(id)!}/>)}</div><div className="action-row"><Link href="/community" className="text-link">Have a specific question? Visit the community</Link></div></section>
  </main>);
}
