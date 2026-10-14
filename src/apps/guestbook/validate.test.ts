import { describe, expect, it } from "vitest";
import { MESSAGE_MAX, NAME_MAX, validateEntry } from "./validate";

describe("validateEntry", () => {
  it("accepts a normal entry and trims spaces", () => {
    expect(validateEntry({ name: "  Mai ", message: " hi! " })).toEqual({
      ok: true,
      value: { name: "Mai", message: "hi!" },
    });
  });

  it("rejects an empty or blank name", () => {
    expect(validateEntry({ name: "   ", message: "hi" }).ok).toBe(false);
  });

  it("rejects an empty message", () => {
    expect(validateEntry({ name: "Mai", message: "" }).ok).toBe(false);
  });

  it("rejects a name that is too long", () => {
    expect(validateEntry({ name: "x".repeat(NAME_MAX + 1), message: "hi" }).ok).toBe(false);
  });

  it("accepts a message exactly at the limit, rejects one over", () => {
    expect(validateEntry({ name: "a", message: "x".repeat(MESSAGE_MAX) }).ok).toBe(true);
    expect(validateEntry({ name: "a", message: "x".repeat(MESSAGE_MAX + 1) }).ok).toBe(false);
  });

  it("rejects links", () => {
    expect(validateEntry({ name: "a", message: "buy at https://spam.com" }).ok).toBe(false);
    expect(validateEntry({ name: "a", message: "see www.spam.com" }).ok).toBe(false);
  });

  it("rejects non-string input", () => {
    expect(validateEntry({ name: 123, message: null }).ok).toBe(false);
  });
});
