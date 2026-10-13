import { appIds, isAppId } from "@/apps/manifest";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import type { AppId } from "@/os/types";

/** Side effects a command asks the terminal to perform. Kept as data so commands stay pure. */
export type Effect =
  | { type: "open"; app: AppId; delayMs?: number }
  | { type: "close"; app: AppId }
  | { type: "clear" };

export interface CommandResult {
  output: string[];
  effects: Effect[];
}

interface Command {
  description: string;
  /** Shown in `help`, e.g. "open <app>". Defaults to the command name. */
  usage?: string;
  /** Hidden from `help` (easter eggs). */
  hidden?: boolean;
  run: (args: string[]) => CommandResult;
}

const say = (...output: string[]): CommandResult => ({ output, effects: [] });

const FILES: Record<string, () => string[]> = {
  "about.txt": () => [...profile.about],
  "status.txt": () => [
    `bootcamp ....... ${profile.status.bootcamp}`,
    `looking for .... ${profile.status.lookingFor}`,
    `available ...... ${profile.status.available}`,
  ],
  "todo.txt": () => profile.todo.map((t) => `[${t.done ? "x" : " "}] ${t.text}`),
};

/**
 * To add a command: add an entry here. `help` and Tab-completion pick it up automatically.
 */
export const commands: Record<string, Command> = {
  help: {
    description: "list commands",
    run: () =>
      say(
        "available commands:",
        ...Object.entries(commands)
          .filter(([, c]) => !c.hidden)
          .map(([name, c]) => `  ${(c.usage ?? name).padEnd(16)} ${c.description}`),
      ),
  },
  whoami: {
    description: "who is hill?",
    run: () =>
      say(
        `${profile.name.toLowerCase()} — "${profile.nickname.toLowerCase()}"`,
        `${profile.role.toLowerCase()} · ${profile.location.toLowerCase()}`,
      ),
  },
  ls: {
    usage: "ls [dir]",
    description: "list files (try: ls skills, ls projects)",
    run: ([dir]) => {
      const d = (dir ?? "").replace(/\/$/, "");
      if (d === "") return say(`${Object.keys(FILES).join("  ")}  projects/  skills/  resume.pdf`);
      if (d === "skills")
        return say(
          ...Object.entries(skills).map(([group, list]) => `${(group + "/").padEnd(11)}${list.join("  ")}`),
        );
      if (d === "projects") return say(projects.map((p) => `${p.slug}/`).join("  "));
      return say(`ls: cannot access '${dir}': No such file or directory`);
    },
  },
  cat: {
    usage: "cat <file>",
    description: "print a file (try: cat status.txt)",
    run: ([file]) => {
      if (!file) return say("usage: cat <file>");
      const read = FILES[file];
      return read ? say(...read()) : say(`cat: ${file}: No such file or directory`);
    },
  },
  open: {
    usage: "open <app>",
    description: `open an app (${appIds.join(", ")})`,
    run: ([app]) => {
      if (app && isAppId(app)) return { output: [`opening ${app} ...`], effects: [{ type: "open", app }] };
      return say(`open: unknown app '${app ?? ""}'. try: ${appIds.join(", ")}`);
    },
  },
  projects: {
    description: "list projects and open the folder",
    run: () => ({
      output: projects.map((p) => `${p.slug.padEnd(14)} ${p.stack.join(", ")}`),
      effects: [{ type: "open", app: "projects" }],
    }),
  },
  sudo: {
    usage: "sudo hire hill",
    description: "you know you want to",
    run: (args) => {
      if (args.join(" ") === "hire hill")
        return {
          output: ["[sudo] password for recruiter: ********", "access granted. launching Contact.app ..."],
          effects: [{ type: "open", app: "contact", delayMs: 700 }],
        };
      return say("visitor is not in the sudoers file. this incident will be reported.");
    },
  },
  echo: {
    usage: "echo <text>",
    description: "print text",
    run: (args) => say(args.join(" ")),
  },
  date: {
    description: "show the date",
    run: () => say(new Date().toString()),
  },
  clear: {
    description: "clear the screen",
    run: () => ({ output: [], effects: [{ type: "clear" }] }),
  },
  exit: {
    description: "close the terminal",
    run: () => ({ output: ["bye!"], effects: [{ type: "close", app: "terminal" }] }),
  },
  hire: {
    hidden: true,
    description: "",
    run: () => say("almost. try: sudo hire hill"),
  },
  rm: {
    hidden: true,
    description: "",
    run: (args) => say(args.includes("-rf") ? "nice try." : "rm: permission denied"),
  },
};

export function runCommand(raw: string): CommandResult {
  const [name, ...args] = raw.trim().split(/\s+/).filter(Boolean);
  if (!name) return { output: [], effects: [] };
  const cmd = commands[name.toLowerCase()];
  if (!cmd) return say(`command not found: ${name}. type 'help'`);
  return cmd.run(args);
}

/** Tab completion: completes the command name, or the app name after `open `. Returns null if not unique. */
export function complete(input: string): string | null {
  const openMatch = /^open\s+(\S*)$/.exec(input);
  if (openMatch) {
    const hits = appIds.filter((id) => id.startsWith(openMatch[1]));
    return hits.length === 1 ? `open ${hits[0]}` : null;
  }
  if (/\s/.test(input)) return null;
  const hits = Object.keys(commands).filter((c) => !commands[c].hidden && c.startsWith(input));
  return hits.length === 1 ? `${hits[0]} ` : null;
}

/** One-click buttons under the terminal for mouse and phone users. */
export const quickCommands = ["help", "whoami", "ls skills", "cat status.txt", "sudo hire hill", "clear"];
