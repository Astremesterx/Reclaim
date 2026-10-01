import { readBody } from "@/lib/server";
import { planSchema as payload } from "@/lib/validation";
import { z } from "zod";
import { database, json, guard, identity, fail, HttpError } from "@/lib/server";
import { getGuide, guides } from "@/lib/catalog";
import { contentIssues } from "@/lib/recovery";
export async function GET() { try {
    const u = await identity(), db = database();
    const [p, r, b] = await Promise.all([db.prepare("SELECT payload FROM plans WHERE owner=? ORDER BY updated DESC").bind(u.userId).all<{
            payload: string;
        }>(), db.prepare("SELECT * FROM reminders WHERE owner=? ORDER BY due").bind(u.userId).all(), db.prepare("SELECT target FROM bookmarks WHERE owner=?").bind(u.userId).all()]);
    return json({ plans: p.results.map(x => JSON.parse(x.payload)), reminders: r.results, bookmarks: b.results.map((x: any) => x.target) });
}
catch (e) {
    return fail(e);
} }
export async function POST(req: Request) {
    try {
        const u = await guard(req), data = await readBody(req) as any, db = database();
        switch (data.action) {
            case "profile": {
                const alias = z.string().trim().min(3).max(28).regex(/^[\p{L}\p{N} _-]+$/u).parse(data.alias);
                await db.prepare("INSERT INTO profiles(owner,alias,created) VALUES(?,?,?) ON CONFLICT(owner) DO UPDATE SET alias=excluded.alias").bind(u.userId, alias, new Date().toISOString()).run();
                break;
            }
            case "save-plan": {
                const p = payload.parse(data.plan);
                if (!getGuide(p.guideId))
                    throw new HttpError(400, "Unknown recovery guide.");
                if (contentIssues(p.notes).length)
                    throw new HttpError(400, "Remove passwords, codes, and personal identifiers from notes before syncing.");
                const result = await db.prepare("INSERT INTO plans(id,owner,payload,updated) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,updated=excluded.updated WHERE plans.owner=excluded.owner").bind(p.id, u.userId, JSON.stringify(p), p.updatedAt).run();
                if (!result.meta.changes)
                    throw new HttpError(404, "Plan not found.");
                break;
            }
            case "delete-plan":
                await db.prepare("DELETE FROM plans WHERE id=? AND owner=?").bind(z.string().uuid().parse(data.id), u.userId).run();
                break;
            case "bookmark": {
                const target = z.string().max(100).parse(data.target);
                if (!guides.some(g => g.id === target) && !target.startsWith("post:"))
                    throw new HttpError(400, "Unknown bookmark.");
                if (data.remove)
                    await db.prepare("DELETE FROM bookmarks WHERE owner=? AND target=?").bind(u.userId, target).run();
                else
                    await db.prepare("INSERT OR IGNORE INTO bookmarks(owner,target) VALUES(?,?)").bind(u.userId, target).run();
                break;
            }
            case "reminder": {
                const r = z.object({ title: z.string().min(3).max(80), due: z.string().datetime(), frequency: z.enum(["ONCE", "WEEKLY", "MONTHLY"]), timezone: z.string().max(80) }).parse(data.reminder);
                try {
                    new Intl.DateTimeFormat("en", { timeZone: r.timezone }).format();
                }
                catch {
                    throw new HttpError(400, "Invalid timezone.");
                }
                await db.prepare("INSERT OR IGNORE INTO reminders(id,owner,title,due,frequency,timezone,paused) VALUES(?,?,?,?,?,?,0)").bind(crypto.randomUUID(), u.userId, r.title, r.due, r.frequency, r.timezone).run();
                break;
            }
            case "pause-reminder":
                await db.prepare("UPDATE reminders SET paused=? WHERE id=? AND owner=?").bind(data.paused ? 1 : 0, z.string().uuid().parse(data.id), u.userId).run();
                break;
            case "delete-reminder":
                await db.prepare("DELETE FROM reminders WHERE id=? AND owner=?").bind(z.string().uuid().parse(data.id), u.userId).run();
                break;
            case "delete-private-data":
                await db.batch(["plans", "reminders", "bookmarks", "profiles"].map(t => db.prepare(`DELETE FROM ${t} WHERE owner=?`).bind(u.userId)));
                break;
            default: throw new HttpError(400, "Unknown action.");
        }
        return json({ ok: true });
    }
    catch (e) {
        return fail(e);
    }
}
