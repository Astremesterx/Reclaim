import { readBody } from "@/lib/server";
import { database, json, guard, identity, fail, HttpError, isAdmin } from "@/lib/server";
import { sources } from "@/lib/catalog";
import {checkSourceLink} from "@/lib/source-checks";
async function admin() { const u = await identity(); if (!isAdmin(u.userId))
    throw new HttpError(403, "Editorial access requires an administrator to configure your role."); return u; }
export async function GET() { try {
    await admin();
    const db = database();
    const [p, c, r, s] = await Promise.all([db.prepare("SELECT id,title,body,alias,created FROM posts WHERE status='pending'").all(), db.prepare("SELECT id,body,alias,post FROM comments WHERE status='pending'").all(), db.prepare("SELECT id,target,reason,created FROM reports WHERE status='open'").all(), db.prepare("SELECT * FROM source_checks ORDER BY checked DESC LIMIT 100").all()]);
    return json({ posts: p.results, comments: c.results, reports: r.results, checks: s.results });
}
catch (e) {
    return fail(e);
} }
export async function POST(req: Request) {
    try {
        await guard(req);
        const u = await admin(), d = await readBody(req) as any, db = database(), now = new Date().toISOString();
        if (d.action === "moderate") {
            if (!["posts", "comments", "reports"].includes(d.table) || !["published", "removed", "closed"].includes(d.status))
                throw new HttpError(400, "Invalid moderation action.");
            await db.batch([db.prepare(`UPDATE ${d.table} SET status=? WHERE id=?`).bind(d.status, String(d.id)), db.prepare("INSERT INTO audit(id,owner,action,target,created) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(), u.userId, `${d.table}:${d.status}`, String(d.id), now)]);
            return json({ ok: true });
        }
        if (d.action === "check-source") {
            const s = sources.find(x => x.id === d.id);
            if (!s)
                throw new HttpError(400, "Choose a registered source.");
            const checked = await checkSourceLink(s.id);
            const status=checked.status,hash=checked.etag;
            await db.prepare("INSERT INTO source_checks(id,source,status,checked,hash,review) VALUES(?,?,?,?,?,'pending')").bind(crypto.randomUUID(), s.id, status, now, hash).run();
            return json({ ok: true, status });
        }
        throw new HttpError(400, "Unknown action.");
    }
    catch (e) {
        return fail(e);
    }
}
