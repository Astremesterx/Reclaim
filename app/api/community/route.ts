import { readBody } from "@/lib/server";
import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { database, json, guard, fail, HttpError } from "@/lib/server";
import { categories } from "@/lib/catalog";
import { contentIssues, moderationFlags } from "@/lib/recovery";
const clean = (s: unknown, min = 8, max = 5000) => { const text = z.string().trim().min(min).max(max).parse(s); const issues = contentIssues(text); if (issues.length)
    throw new HttpError(400, issues.join(" ")); return text; };
export async function GET(req: Request) { try {
    const db = database(), u = await getChatGPTUser(), owner = u?.userId || "", url = new URL(req.url), id = url.searchParams.get("id");
    if (id) {
        const p = await db.prepare("SELECT p.*, (p.owner=?) AS mine,(SELECT count(*) FROM votes WHERE post=p.id) AS votes,(SELECT count(*) FROM votes WHERE post=p.id AND owner=?) AS voted FROM posts p WHERE p.id=? AND (p.status='published' OR p.owner=?)").bind(owner, owner, id, owner).first<any>();
        if (!p)
            throw new HttpError(404, "Discussion not found.");
        const c = await db.prepare("SELECT id,parent,alias,body,created,status,(owner=?) AS mine FROM comments WHERE post=? AND (status='published' OR owner=?) AND owner NOT IN (SELECT blocked FROM blocks WHERE owner=?) ORDER BY created").bind(owner, id, owner, owner).all();
        delete p.owner;
        return json({ post: p, comments: c.results });
    }
    const p = await db.prepare("SELECT p.id,p.alias,p.title,p.body,p.category,p.status,p.resolved,p.created,(p.owner=?) AS mine,(SELECT count(*) FROM votes WHERE post=p.id) AS votes,(SELECT count(*) FROM comments WHERE post=p.id AND status='published') AS replies FROM posts p WHERE (p.status='published' OR p.owner=?) AND p.owner NOT IN (SELECT blocked FROM blocks WHERE owner=?) ORDER BY p.created DESC LIMIT 100").bind(owner, owner, owner).all();
    return json({ posts: p.results });
}
catch (e) {
    return fail(e);
} }
export async function POST(req: Request) {
    try {
        const u = await guard(req), db = database(), d = await readBody(req) as any, now = new Date().toISOString();
        if (d.action === "post" || d.action === "comment") {
            const profile = await db.prepare("SELECT alias FROM profiles WHERE owner=?").bind(u.userId).first<{
                alias: string;
            }>();
            if (!profile)
                throw new HttpError(400, "Choose a community display name first.");
            const body = clean(d.body), id = crypto.randomUUID();
            const title = d.action === "post" ? clean(d.title, 8, 140) : "";
            const status = moderationFlags(title + " " + body).length ? "pending" : "published";
            if (d.action === "post") {
                if (!categories.some(c => c.id === d.category))
                    throw new HttpError(400, "Choose a topic.");
                await db.prepare("INSERT INTO posts(id,owner,alias,title,body,category,status,created,updated) VALUES(?,?,?,?,?,?,?,?,?)").bind(id, u.userId, profile.alias, title, body, d.category, status, now, now).run();
            }
            else {
                const postId = z.string().uuid().parse(d.post);
                const p = await db.prepare("SELECT id FROM posts WHERE id=? AND status='published'").bind(postId).first();
                if (!p)
                    throw new HttpError(404, "Discussion unavailable.");
                const parent = d.parent ? z.string().uuid().parse(d.parent) : null;
                if (parent && !await db.prepare("SELECT id FROM comments WHERE id=? AND post=? AND status='published'").bind(parent, postId).first())
                    throw new HttpError(400, "Reply target unavailable.");
                if (parent) {
                    const chain = await db.prepare("WITH RECURSIVE ancestors(id,parent,depth) AS (SELECT id,parent,1 FROM comments WHERE id=? UNION ALL SELECT c.id,c.parent,a.depth+1 FROM comments c JOIN ancestors a ON c.id=a.parent WHERE a.depth<4) SELECT max(depth) AS depth FROM ancestors").bind(parent).first<{
                        depth: number;
                    }>();
                    if ((chain?.depth || 0) >= 4)
                        throw new HttpError(400, "This reply thread is full. Add a top-level reply instead.");
                }
                await db.prepare("INSERT INTO comments(id,post,parent,owner,alias,body,status,created) VALUES(?,?,?,?,?,?,?,?)").bind(id, postId, parent, u.userId, profile.alias, body, status, now).run();
            }
            return json({ ok: true, id, status });
        }
        const id = z.string().max(120).parse(d.id);
        if (d.action === "vote") {
            if (!await db.prepare("SELECT id FROM posts WHERE id=? AND status='published'").bind(id).first())
                throw new HttpError(404, "Discussion unavailable.");
            if (d.remove)
                await db.prepare("DELETE FROM votes WHERE owner=? AND post=?").bind(u.userId, id).run();
            else
                await db.prepare("INSERT OR IGNORE INTO votes(owner,post) VALUES(?,?)").bind(u.userId, id).run();
        }
        else if (d.action === "resolve") {
            await db.prepare("UPDATE posts SET resolved=?,updated=? WHERE id=? AND owner=?").bind(d.resolved ? 1 : 0, now, id, u.userId).run();
        }
        else if (d.action === "accept") {
            const c = await db.prepare("SELECT id FROM comments WHERE id=? AND post=? AND status='published'").bind(d.comment, id).first();
            if (!c)
                throw new HttpError(400, "Reply unavailable.");
            await db.prepare("UPDATE posts SET accepted=?,resolved=1,updated=? WHERE id=? AND owner=?").bind(d.comment, now, id, u.userId).run();
        }
        else if (d.action === "report" || d.action === "correction") {
            await db.prepare("INSERT INTO reports(id,owner,target,reason,created) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(), u.userId, id, clean(d.reason, 8, 1500), now).run();
        }
        else if (d.action === "block") {
            const p = await db.prepare("SELECT owner FROM posts WHERE id=?").bind(id).first<{
                owner: string;
            }>();
            if (!p)
                throw new HttpError(404, "Discussion unavailable.");
            await db.prepare("INSERT OR IGNORE INTO blocks(owner,blocked) VALUES(?,?)").bind(u.userId, p.owner).run();
        }
        else if (d.action === "remove") {
            await db.prepare("UPDATE posts SET status='removed',updated=? WHERE id=? AND owner=?").bind(now, id, u.userId).run();
        }
        else
            throw new HttpError(400, "Unknown action.");
        return json({ ok: true });
    }
    catch (e) {
        return fail(e);
    }
}
