import { describe, expect, it } from "vitest";
import { makeDeleteToken, verifyDeleteToken } from "./deleteToken";

const ID = "7b0f6a1e-4c1a-4d0b-9a55-2a3f1e9d8c11";

describe("delete token", () => {
  it("accepts the token made for the same id and secret", () => {
    const token = makeDeleteToken(ID, "secret");
    expect(verifyDeleteToken(ID, token, "secret")).toBe(true);
  });

  it("rejects a token made for a different entry", () => {
    const token = makeDeleteToken("another-id", "secret");
    expect(verifyDeleteToken(ID, token, "secret")).toBe(false);
  });

  it("rejects a token made with a different secret", () => {
    const token = makeDeleteToken(ID, "other-secret");
    expect(verifyDeleteToken(ID, token, "secret")).toBe(false);
  });

  it("rejects garbage of any length", () => {
    expect(verifyDeleteToken(ID, "", "secret")).toBe(false);
    expect(verifyDeleteToken(ID, "nope", "secret")).toBe(false);
  });
});
