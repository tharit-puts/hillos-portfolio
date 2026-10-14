import { describe, expect, it } from "vitest";
import { parseMine } from "./mine";

describe("parseMine", () => {
  it("reads a saved map", () => {
    expect(parseMine('{"a":"t1","b":"t2"}')).toEqual({ a: "t1", b: "t2" });
  });

  it("returns an empty map for missing or broken data", () => {
    expect(parseMine(null)).toEqual({});
    expect(parseMine("not json")).toEqual({});
    expect(parseMine("[1,2]")).toEqual({});
    expect(parseMine("null")).toEqual({});
  });

  it("drops entries whose token is not a string", () => {
    expect(parseMine('{"a":"t1","b":5}')).toEqual({ a: "t1" });
  });
});
