import { guides, getGuide, type Step } from "./catalog";
export type Answers = {
    category: string;
    platform: string;
    action: string;
    access: string;
    work: string;
    safe: string;
    region: string;
    repeat?: string;
};
export type Plan = {
    id: string;
    guideId: string;
    guideVersion: number;
    answers: Answers;
    states: Record<string, string>;
    notes: string;
    createdAt: string;
    updatedAt: string;
};
export const defaultAnswers: Answers = { category: "", platform: "Any service", action: "unsure", access: "unsure", work: "personal", safe: "yes", region: "Global" };
export function recommend(a: Answers): string {
    if (a.category === "safety")
        return a.action === "images" ? "image-abuse" : a.action === "shared" ? "cloud-sharing" : "monitoring-safety";
    if (a.action === "paid" || a.category === "money")
        return a.action === "identity" ? "identity-theft" : a.action === "breach" ? "data-breach" : a.platform === "UPI / payment app" ? "upi-fraud" : "payment-fraud";
    if (a.repeat === "yes")
        return "repeat-compromise";
    if (a.category === "devices")
        return a.action === "sim" ? "sim-swap" : a.platform === "Apple" ? "stolen-iphone" : a.platform === "Google" ? "lost-android" : "lost-computer";
    if (a.category === "malware")
        return a.action === "ransom" ? "ransomware" : a.action === "popups" ? "browser-popups" : a.action === "remote" ? "remote-access" : "malware-check";
    if (a.category === "phishing")
        return a.action === "password" || a.action === "code" ? "exposed-password" : a.action === "ran" ? "malware-check" : a.action === "remote" ? "remote-access" : a.action === "app" ? "connected-apps" : "suspicious-link";
    if (a.action === "mfa")
        return "lost-mfa";
    if (a.action === "alert")
        return "unexpected-mfa";
    if (a.platform === "Google")
        return "google-account";
    if (a.platform === "Microsoft")
        return "microsoft-account";
    if (a.platform === "Apple")
        return "apple-account";
    return a.category === "unsure" || !a.category ? "not-sure" : "social-account";
}
export function planSteps(p: Plan): Step[] {
    const g = getGuide(p.guideId);
    if (!g)
        return [];
    const steps = g.steps.filter(s => !s.when || p.answers.access === "unsure" || s.when === p.answers.access);
    const context: Step[] = [];
    if (p.answers.work === "work")
        context.push({ id: "work-first", title: "Contact your workplace security team", body: "Use a known internal contact and follow your organization’s incident procedure before resetting or erasing a managed device.", check: "Your IT or security team knows what happened.", fallback: "If the usual system is unavailable, use an independently known workplace contact.", sourceId: "ransom", phase: "Do now" });
    if (p.answers.safe === "no" && p.guideId !== "monitoring-safety")
        context.push({ id: "safe-device", title: "Choose a safer way to get help", body: "If this device may be controlled or monitored, consider another device you trust before entering account information. If someone close to you may be involved, use the monitoring safety guide first.", check: "You have considered the safety of the device you use.", fallback: "Open the specialist safety resource from a safer device when possible.", sourceId: "safety", phase: "Do now" });
    return [...context, ...steps, { id: `${g.id}-prevention`, title: "Make a follow-up plan", body: "Revisit unresolved steps and choose a useful security routine. A completed checklist is a record of your actions, not a guarantee that every risk is gone.", check: "You know what to check next.", fallback: "Keep this step open and return when you are ready.", sourceId: g.sourceIds[0], phase: "Prevent recurrence" }];
}
export function createPlan(guideId: string, answers: Answers = defaultAnswers): Plan { const now = new Date().toISOString(); return { id: crypto.randomUUID(), guideId, guideVersion: getGuide(guideId)?.version || 1, answers: { ...answers }, states: {}, notes: "", createdAt: now, updatedAt: now }; }
const synonyms: Record<string, string> = { gmail: "google", gamil: "google", outlook: "microsoft", xbox: "microsoft", iphone: "apple", instagram: "social", facebook: "social", whatsapp: "social", stolen: "lost", hacked: "account", virus: "malware", scammer: "fraud", scam: "fraud", monitoring: "monitored", authenticator: "mfa" };
export function searchGuides(query: string, category = "all", platform = "all", effort = "all", region = "Global", level = "all", device = "all") {
    const terms = query.toLowerCase().split(/\W+/).filter(t => t.length > 2 && !['the', 'and', 'someone', 'with', 'was', 'have', 'been', 'what', 'how', 'can'].includes(t));
    return guides.filter(g => (category === "all" || g.category === category) && (platform === "all" || g.platform === platform) && (effort === "all" || g.minutes <= Number(effort)) && (region === "Global" || g.region === "Global" || g.region === region) && (level === "all" || g.level === level) && (device === "all" || g.device === device || g.device === "Any device"))
        .map(g => { const text = `${g.title} ${g.description} ${g.platform} ${g.tags.join(' ')}`.toLowerCase(); return { g, score: terms.reduce((n, t) => n + (text.includes(t) ? 3 : synonyms[t] && text.includes(synonyms[t]) ? 2 : text.split(/\W+/).some(w => w.length > 4 && t.length > 4 && editDistance(w, t) <= 1) ? 1 : 0), 0) }; }).filter(x => !terms.length || x.score > 0).sort((a, b) => b.score - a.score).map(x => x.g);
}
function editDistance(a: string, b: string) { if (Math.abs(a.length - b.length) > 1)
    return 2; const d = Array.from({ length: b.length + 1 }, (_, i) => i); for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
        const tmp = d[j];
        d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
    }
} return d[b.length]; }
export function contentIssues(text: string) { const issues: string[] = []; if (/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text))
    issues.push("Remove personal email addresses."); if (/\b(?:\d[ -]?){12,19}\b/.test(text))
    issues.push("Remove long account, card, or identity numbers."); if (/(?:password|otp|recovery code|seed phrase|api[_ -]?key)\s*[:=]\s*\S+/i.test(text))
    issues.push("Remove secret values or recovery codes."); if (/-----BEGIN .*PRIVATE KEY-----|(?:sk-|ghp_)[a-z0-9]{15,}/i.test(text))
    issues.push("Remove private keys or access tokens."); return issues; }
export function moderationFlags(text: string) { return /(?:dm|message|contact) me|recover.{0,20}(?:fee|payment)|send.{0,15}(?:password|code|crypto)|https?:\/\/|www\./i.test(text) ? ["Link or recovery solicitation requires moderator review"] : []; }
export const routines = [{ id: "account-review", title: "Review account activity", description: "Check recent sign-ins and recovery details in accounts that matter to you.", frequency: "WEEKLY", guide: "google-account" }, { id: "backup-check", title: "Check a backup you can restore", description: "Restore a small sample to a separate location and confirm it opens.", frequency: "MONTHLY", guide: "ransomware" }, { id: "app-review", title: "Review connected apps", description: "Remove connections you no longer use, after checking their purpose.", frequency: "MONTHLY", guide: "connected-apps" }, { id: "updates", title: "Check device updates", description: "Use your device’s official update controls and restart when needed.", frequency: "MONTHLY", guide: "malware-check" }];
export {calendarFile} from "./calendar";
