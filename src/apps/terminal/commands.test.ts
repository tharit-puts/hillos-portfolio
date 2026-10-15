import { describe, expect, it } from "vitest";
import { commands, complete, runCommand } from "./commands";

describe("runCommand", () => {
  it("ignores empty input", () => {
    expect(runCommand("   ")).toEqual({ output: [], effects: [] });
  });

  it("reports unknown commands", () => {
    expect(runCommand("dance").output[0]).toContain("command not found: dance");
  });

  it("help lists every visible command but not easter eggs", () => {
    const text = runCommand("help").output.join("\n");
    for (const [name, c] of Object.entries(commands)) {
      if (c.hidden) expect(text.includes(`  ${name} `)).toBe(false);
      else expect(text).toContain(c.usage ?? name);
    }
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(runCommand("  WHOAMI  ").output[0]).toContain("tharit putsorn");
  });

  it("open <app> emits an open effect, and rejects unknown apps", () => {
    expect(runCommand("open projects").effects).toEqual([{ type: "open", app: "projects" }]);
    const bad = runCommand("open photoshop");
    expect(bad.effects).toHaveLength(0);
    expect(bad.output[0]).toContain("unknown app");
  });

  it("sudo hire hill opens Contact after a short delay", () => {
    expect(runCommand("sudo hire hill").effects).toEqual([{ type: "open", app: "contact", delayMs: 700 }]);
    expect(runCommand("sudo rm everything").effects).toHaveLength(0);
  });

  it("cat reads known files and errors on missing ones", () => {
    expect(runCommand("cat status.txt").output).toHaveLength(3);
    expect(runCommand("cat secrets.txt").output[0]).toContain("No such file");
  });

  it("ls accepts a trailing slash", () => {
    expect(runCommand("ls skills/")).toEqual(runCommand("ls skills"));
  });

  it("ls skills prints one line per group, using skill names", () => {
    const { output } = runCommand("ls skills");
    expect(output).toHaveLength(3);
    expect(output[1]).toContain("Spring Boot");
    expect(output[2]).toContain("Gemini API");
    expect(output.join(" ")).not.toContain("[object Object]");
  });

  it("open skills opens the Skills app", () => {
    expect(runCommand("open skills").effects).toEqual([{ type: "open", app: "skills" }]);
  });

  it("clear and exit emit effects", () => {
    expect(runCommand("clear").effects).toEqual([{ type: "clear" }]);
    expect(runCommand("exit").effects).toEqual([{ type: "close", app: "terminal" }]);
  });
});

describe("complete", () => {
  it("completes a unique command prefix", () => {
    expect(complete("who")).toBe("whoami ");
  });

  it("returns null when the prefix is ambiguous", () => {
    expect(complete("c")).toBeNull(); // cat, clear
  });

  it("completes app names after open", () => {
    expect(complete("open pro")).toBe("open projects");
    expect(complete("open zzz")).toBeNull();
  });

  it("never suggests hidden commands", () => {
    expect(complete("hir")).toBeNull();
  });
});
