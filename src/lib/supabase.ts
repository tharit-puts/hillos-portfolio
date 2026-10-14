import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Server-side Supabase client. Uses the service role key, so it must never reach the browser. */
export function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars are missing (see .env.local)");
  return createClient(url, key, { auth: { persistSession: false } });
}
