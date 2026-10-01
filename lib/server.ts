import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
export function database() { if (!env.DB)
    throw new Error("Storage is unavailable. Please try again later."); return env.DB; }
export function json(data: unknown, status = 200) { return Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } }); }
export async function identity() { const user = await getChatGPTUser(); if (!user)
    throw new HttpError(401, "Sign in to use this feature. Your guest recovery plan is still available."); return user; }
export class HttpError extends Error {
    constructor(public status: number, message: string) { super(message); }
}
export async function guard(req: Request) { const origin = req.headers.get("origin"); if (req.headers.get("x-reclaim-request") !== "1" || !origin || origin !== new URL(req.url).origin)
    throw new HttpError(403, "This request could not be verified. Reload the page and try again."); if (Number(req.headers.get("content-length") || 0) > 65536)
    throw new HttpError(413, "This request is too large."); const user = await identity(); const db = database(); const now = Date.now(), key = `${user.userId}:${Math.floor(now / 60000)}`; const row = await db.prepare("INSERT INTO rate_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<30 RETURNING count").bind(key, now + 120000).first(); if (!row)
    throw new HttpError(429, "Please wait a minute before trying again."); await db.prepare("DELETE FROM rate_limits WHERE expires < ?").bind(now).run(); return user; }
export function fail(e: unknown) { if (e instanceof HttpError)
    return json({ error: e.message }, e.status); if (e instanceof Error && e.name === "ZodError")
    return json({ error: "Please check the information and try again." }, 400); console.error("RECLAIM operation failed", e instanceof Error ? e.name : "unknown"); return json({ error: "We could not complete that request. Your input has been kept; please try again." }, 503); }
export function isAdmin(id: string) { const ids = (env as unknown as Record<string, string>).RECLAIM_ADMIN_IDS || ""; return ids.split(",").map(x => x.trim()).filter(Boolean).includes(id); }
export async function readBody(req: Request): Promise<any> { const reader = req.body?.getReader(); if (!reader)
    throw new HttpError(400, "Missing request data."); let size = 0; const chunks: Uint8Array[] = []; while (true) {
    const part = await reader.read();
    if (part.done)
        break;
    size += part.value.byteLength;
    if (size > 65536) {
        await reader.cancel();
        throw new HttpError(413, "This request is too large.");
    }
    chunks.push(part.value);
} const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
} try {
        const value=JSON.parse(new TextDecoder().decode(bytes));
        if(!value||typeof value!=="object"||Array.isArray(value))throw new HttpError(400,"Use a request object.");
        return value;
}
catch {
    throw new HttpError(400, "Invalid request data.");
} }
