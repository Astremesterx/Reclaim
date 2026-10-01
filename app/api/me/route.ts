import { getChatGPTUser } from "@/app/chatgpt-auth";
import { json, database, fail, isAdmin } from "@/lib/server";
export async function GET() { try {
    const u = await getChatGPTUser();
    if (!u)
        return json({ user: null });
    const row = await database().prepare("SELECT alias FROM profiles WHERE owner=?").bind(u.userId).first<{
        alias: string;
    }>();
    return json({ user: { id: u.userId, alias: row?.alias || "", admin: isAdmin(u.userId) } });
}
catch (e) {
    return fail(e);
} }
