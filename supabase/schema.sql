-- Guestbook.app table. Run this once in Supabase → SQL Editor.

create table if not exists guestbook_entries (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null check (char_length(name) between 1 and 40),
  message     text        not null check (char_length(message) between 1 and 280),
  ip_hash     text        not null,                 -- salted sha256 of the visitor IP, used for rate limiting
  hidden      boolean     not null default false,   -- tick this in the dashboard to hide a message
  created_at  timestamptz not null default now()
);

create index if not exists guestbook_entries_created_at_idx on guestbook_entries (created_at desc);
create index if not exists guestbook_entries_ip_created_at_idx on guestbook_entries (ip_hash, created_at desc);

-- RLS on with no policies: the browser (anon key) can't read or write anything.
-- The server uses the service role key, which bypasses RLS.
alter table guestbook_entries enable row level security;
