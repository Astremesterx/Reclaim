import { z } from "zod";
import { getGuide } from "./catalog";
export const planSchema = z.object({
    id: z.string().uuid(),
    guideId: z.string().refine(id => Boolean(getGuide(id)), "Unknown guide"),
    guideVersion: z.number().int().positive(),
    answers: z.object({
        category: z.string().max(80), platform: z.string().max(100),
        action: z.string().max(80), access: z.string().max(80),
        work: z.string().max(80), safe: z.string().max(80),
        region: z.string().max(80), repeat: z.string().max(80).optional()
    }).strict(),
    states: z.record(z.enum(["done", "blocked", "waiting", "skipped", "todo"])),
    notes: z.string().max(8000),
    createdAt: z.string().datetime(), updatedAt: z.string().datetime()
}).strict();
