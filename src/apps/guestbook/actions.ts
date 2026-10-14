"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/lib/supabase";
import { checkRateLimit, DAILY_LIMIT } from "./rateLimit";
import { validateEntry } from "./validate";

export type FormState = { ok: boolean; error?: string };
export type Entry = { id: string; name: string; message: string; created_at: string };

const UNAVAILABLE = "The guestbook is taking a nap. Please try again later.";

/** A salted hash of the visitor's IP: enough to rate limit, without storing the IP itself. */
async function visitorHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  return createHash("sha256")
    .update(ip + (process.env.IP_HASH_SALT ?? ""))
    .digest("hex");
}

export async function signGuestbook(formData: FormData): Promise<FormState> {
  // 1) Honeypot: real people never see this field, bots fill it in. Pretend it worked.
  if (formData.get("website")) return { ok: true };

  // 2) Validate.
  const parsed = validateEntry({ name: formData.get("name"), message: formData.get("message") });
  if (!parsed.ok) return { ok: false, error: parsed.error };

  try {
    const supabase = db();
    const ip_hash = await visitorHash();

    // 3) Rate limit: look at this visitor's posts from the last 24 hours.
    const since = new Date(Date.now() - 86_400_000).toISOString();
    const { data: previous, error: readError } = await supabase
      .from("guestbook_entries")
      .select("created_at")
      .eq("ip_hash", ip_hash)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(DAILY_LIMIT);
    if (readError) return { ok: false, error: UNAVAILABLE };

    const limit = checkRateLimit((previous ?? []).map((r) => r.created_at));
    if (!limit.ok) return { ok: false, error: limit.error };

    // 4) Save.
    const { error: insertError } = await supabase.from("guestbook_entries").insert({ ...parsed.value, ip_hash });
    if (insertError) return { ok: false, error: "Could not save your message. Please try again." };

    return { ok: true };
  } catch {
    return { ok: false, error: UNAVAILABLE };
  }
}

/** Returns null when the guestbook can't be reached, so the UI can say so politely. */
export async function listEntries(): Promise<Entry[] | null> {
  try {
    const { data, error } = await db()
      .from("guestbook_entries")
      .select("id, name, message, created_at") // never send ip_hash to the browser
      .eq("hidden", false)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}
