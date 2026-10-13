"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useOS } from "@/os/OSProvider";
import { complete, quickCommands, runCommand, type Effect } from "./commands";

interface Line {
  id: number;
  kind: "in" | "out";
  text: string;
}

const PROMPT = "hill@os:~$";
const MAX_LINES = 200;

let nextId = 0;
const line = (kind: Line["kind"], text: string): Line => ({ id: nextId++, kind, text });

const WELCOME = [
  line("out", "HillOS v26.10 — type 'help' or tap a command below."),
];

export default function TerminalApp() {
  const { open, close } = useOS();
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [lines]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function apply(effect: Effect) {
    const run = () => {
      if (effect.type === "open") open(effect.app);
      if (effect.type === "close") close(effect.app);
    };
    if (effect.type === "clear") return;
    if (effect.type === "open" && effect.delayMs) timers.current.push(window.setTimeout(run, effect.delayMs));
    else run();
  }

  function submit(raw: string) {
    const result = runCommand(raw);
    const cleared = result.effects.some((e) => e.type === "clear");
    setLines((prev) =>
      cleared
        ? []
        : [...prev, line("in", raw), ...result.output.map((t) => line("out", t))].slice(-MAX_LINES),
    );
    if (raw.trim()) setHistory((h) => [...h, raw]);
    setCursor(null);
    setInput("");
    result.effects.forEach(apply);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const done = complete(input);
      if (done) setInput(done);
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown" && cursor !== null) {
      e.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setInput("");
      } else {
        setCursor(next);
        setInput(history[next]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div className="flex h-full flex-col bg-term text-[13px] leading-relaxed text-term-text">
      <div
        className="flex max-h-[360px] min-h-[230px] flex-1 flex-col gap-0.5 overflow-auto p-4 max-md:max-h-none"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((l) => (
          <p key={l.id} className="whitespace-pre-wrap">
            {l.kind === "in" ? (
              <>
                <span className="text-sun">{PROMPT} </span>
                {l.text}
              </>
            ) : (
              l.text
            )}
          </p>
        ))}
        <label className="flex items-center gap-2">
          <span className="shrink-0 text-sun">{PROMPT}</span>
          <span className="sr-only">Terminal command</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-term-text caret-mint outline-none focus-visible:outline-none"
          />
        </label>
        <div ref={bottomRef} />
      </div>
      <div className="flex flex-wrap gap-2 border-t-[1.5px] border-neutral-700 px-4 py-3">
        {quickCommands.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => submit(c)}
            className="min-h-9 cursor-pointer border-[1.5px] border-mint px-3 text-mint hover:bg-mint hover:text-term"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
