"use client";

import { useCallback, useEffect, useState, useTransition, type FormEvent } from "react";
import { CloseIcon, Spinner } from "@/components/icons";
import { buttonClass, cn } from "@/components/ui";
import { deleteEntry, listEntries, signGuestbook, type Entry, type FormState } from "./actions";
import { loadMine, saveMine, type Mine } from "./mine";
import { MESSAGE_MAX, NAME_MAX } from "./validate";

const fieldClass = "w-full border-2 border-ink bg-white px-3 py-2";

export default function GuestbookApp() {
  /** undefined = loading, null = could not reach the database. */
  const [entries, setEntries] = useState<Entry[] | null | undefined>(undefined);
  const [result, setResult] = useState<FormState | null>(null);
  const [pending, startTransition] = useTransition();
  /** Entries written from this browser (id → delete token). Only these get a delete button. */
  const [mine, setMine] = useState<Mine>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    listEntries().then(setEntries);
  }, []);

  useEffect(refresh, [refresh]);
  useEffect(() => setMine(loadMine()), []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      const res = await signGuestbook(data);
      setResult(res);
      if (res.ok) {
        form.reset();
        if (res.receipt) {
          const next = { ...mine, [res.receipt.id]: res.receipt.token };
          setMine(next);
          saveMine(next);
        }
        refresh();
      }
    });
  }

  async function onDelete(id: string) {
    const token = mine[id];
    if (!token || deletingId) return;
    setDeletingId(id);
    const res = await deleteEntry(id, token);
    setDeletingId(null);
    setResult(res.ok ? null : res);
    if (res.ok) {
      const rest = Object.fromEntries(Object.entries(mine).filter(([key]) => key !== id));
      setMine(rest);
      saveMine(rest);
      setEntries((list) => list?.filter((entry) => entry.id !== id));
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-2.5">
        <input
          name="name"
          aria-label="Your name"
          placeholder="Your name"
          maxLength={NAME_MAX}
          required
          autoComplete="nickname"
          className={fieldClass}
        />
        <textarea
          name="message"
          aria-label="Your message"
          placeholder="Leave a message…"
          maxLength={MESSAGE_MAX}
          rows={3}
          required
          className={fieldClass}
        />
        {/* Honeypot: hidden from people, bots tend to fill it in. */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

        <button type="submit" disabled={pending} className={buttonClass.dark}>
          {pending ? <Spinner /> : "Sign guestbook"}
        </button>
        <p aria-live="polite" className="min-h-5 text-xs">
          {result?.error ?? (result?.ok ? "Thanks for signing!" : "")}
        </p>
      </form>

      <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto" aria-label="Messages">
        {entries === undefined && (
          <li>
            <Spinner />
          </li>
        )}
        {entries === null && <li>The guestbook is taking a nap. Please try again later.</li>}
        {entries?.length === 0 && <li>Be the first to sign.</li>}
        {entries?.map((entry) => (
          <li key={entry.id} className="flex items-start gap-2 border-2 border-ink bg-white p-3">
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline justify-between gap-2">
                <span className="font-bold wrap-break-word">{entry.name}</span>
                <time dateTime={entry.created_at} className="shrink-0 text-xs opacity-60">
                  {new Date(entry.created_at).toLocaleDateString()}
                </time>
              </p>
              <p className="wrap-break-word">{entry.message}</p>
            </div>
            {mine[entry.id] && (
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                disabled={deletingId !== null}
                aria-label={`Delete your message, ${entry.message.slice(0, 30)}`}
                title="Delete my message"
                className={cn(buttonClass.light, "min-h-8 shrink-0 px-2")}
              >
                {deletingId === entry.id ? <Spinner /> : <CloseIcon />}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
