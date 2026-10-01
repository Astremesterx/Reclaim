"use client";
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { createPlan, defaultAnswers, type Plan, type Answers } from "@/lib/recovery";
import { getGuide } from "@/lib/catalog";
import { planSchema } from "@/lib/validation";
import { Toaster, toast } from "sonner";
import { GITHUB_PAGES } from "@/lib/deployment";
const storageKey = (name: string) => `${GITHUB_PAGES ? 'reclaim-pages' : 'reclaim'}-${name}`;
export async function api(path: string, data?: unknown) { if (GITHUB_PAGES) throw new Error('This feature needs a server and is unavailable in the GitHub Pages edition.'); const r = await fetch(path, { method: data ? "POST" : "GET", headers: data ? { "Content-Type": "application/json", "X-Reclaim-Request": "1" } : undefined, body: data ? JSON.stringify(data) : undefined }); const j: any = await r.json(); if (!r.ok)
    throw new Error(j.error || "This action could not be completed."); return j; }
type AppState = {
    plan: Plan | null;
    setPlan: (p: Plan | null) => void;
    start: (id: string, a?: Answers) => Plan;
    persist: boolean;
    setPersist: (v: boolean) => void;
    region: string;
    setRegion: (v: string) => void;
    theme: string;
    setTheme: (v: string) => void;
    query: string;
    setQuery: (v: string) => void;
    user: any;
    refreshUser: () => Promise<void>;
    privateData: any;
    refreshPrivate: () => Promise<void>;
    bookmark: (id: string) => Promise<void>;
};
const Context = createContext<AppState | null>(null);
export function AppProvider({ children }: {
    children: ReactNode;
}) {
    const [plan, setPlan] = useState<Plan | null>(null), [persist, setPersist] = useState(false), [ready, setReady] = useState(false), [region, setRegion] = useState("Global"), [theme, setTheme] = useState("dark"), [query, setQuery] = useState(""), [user, setUser] = useState<any>(null), [privateData, setPrivate] = useState<any>({ plans: [], reminders: [], bookmarks: [] });
    const refreshUser = useCallback(async () => { if (GITHUB_PAGES) return; try {
        const d = await api('/api/me');
        setUser(d.user);
    }
    catch {
        setUser(null);
    } }, []);
    const refreshPrivate = useCallback(async () => { if (GITHUB_PAGES) return; const d = await api('/api/private'); setPrivate(d); }, []);
    useEffect(() => { try {
        const t = localStorage.getItem(storageKey('theme')) || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        setTheme(t);
        setRegion(localStorage.getItem(storageKey('region')) || 'Global');
        if (localStorage.getItem(storageKey('save')) === 'yes') {
            setPersist(true);
            const raw = localStorage.getItem(storageKey('plan'));
            if (raw) {
                const parsed = planSchema.safeParse(JSON.parse(raw));
                if (parsed.success)
                    setPlan(parsed.data);
            }
        }
    }
    catch { } setReady(true); void refreshUser(); }, [refreshUser]);
    useEffect(() => { if (ready) {
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem(storageKey('theme'), theme);
            localStorage.setItem(storageKey('region'), region);
        }
        catch { }
    } }, [theme, region, ready]);
    useEffect(() => { if (ready) {
        try {
            if (persist) {
                localStorage.setItem(storageKey('save'), 'yes');
                if (plan)
                    localStorage.setItem(storageKey('plan'), JSON.stringify(plan));
                else
                    localStorage.removeItem(storageKey('plan'));
            }
            else {
                localStorage.removeItem(storageKey('save'));
                localStorage.removeItem(storageKey('plan'));
            }
        }
        catch {
            toast.error('This browser could not save your plan. Export a copy instead.');
        }
    } }, [plan, persist, ready]);
    useEffect(() => { if (user)
        void refreshPrivate().catch(() => { });
    else
        setPrivate({ plans: [], reminders: [], bookmarks: [] }); }, [user, refreshPrivate]);
    const start = (id: string, a: Answers = { ...defaultAnswers, region }) => { const p = createPlan(id, a); setPlan(p); return p; };
    const bookmark = async (id: string) => { if (!user) {
        toast.info('Sign in to save bookmarks.');
        return;
    } await api('/api/private', { action: 'bookmark', target: id, remove: privateData.bookmarks.includes(id) }); await refreshPrivate(); };
    return <Context.Provider value={{ plan, setPlan, start, persist, setPersist, region, setRegion, theme, setTheme, query, setQuery, user, refreshUser, privateData, refreshPrivate, bookmark }}>{children}<Toaster position="bottom-right" richColors closeButton/></Context.Provider>;
}
export function useApp() { const c = useContext(Context); if (!c)
    throw new Error('Missing provider'); return c; }
