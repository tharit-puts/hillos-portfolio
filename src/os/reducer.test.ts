import { describe, expect, it } from "vitest";
import { COFFEE_COST, COFFEE_MIN, focusedId, isOpen, osReducer } from "./reducer";
import type { OSState } from "./types";

const empty: OSState = { windows: [], coffee: 50 };
const at = { x: 10, y: 20 };

describe("osReducer", () => {
  it("opens a new window on top", () => {
    let s = osReducer(empty, { type: "open", id: "about", position: at });
    s = osReducer(s, { type: "open", id: "terminal", position: at });
    expect(s.windows.map((w) => w.id)).toEqual(["about", "terminal"]);
    expect(focusedId(s)).toBe("terminal");
  });

  it("re-opening an existing window brings it to the front and keeps its position", () => {
    let s = osReducer(empty, { type: "open", id: "about", position: { x: 1, y: 2 } });
    s = osReducer(s, { type: "open", id: "terminal", position: at });
    s = osReducer(s, { type: "open", id: "about", position: { x: 999, y: 999 } });
    expect(s.windows.map((w) => w.id)).toEqual(["terminal", "about"]);
    expect(s.windows[1].position).toEqual({ x: 1, y: 2 });
  });

  it("closes a window", () => {
    let s = osReducer(empty, { type: "open", id: "about", position: at });
    s = osReducer(s, { type: "close", id: "about" });
    expect(s.windows).toHaveLength(0);
    expect(focusedId(s)).toBeNull();
  });

  it("focus reorders but is a no-op for the window already on top", () => {
    let s = osReducer(empty, { type: "open", id: "about", position: at });
    s = osReducer(s, { type: "open", id: "trash", position: at });
    const same = osReducer(s, { type: "focus", id: "trash" });
    expect(same).toBe(s);
    s = osReducer(s, { type: "focus", id: "about" });
    expect(focusedId(s)).toBe("about");
  });

  it("moves a window", () => {
    let s = osReducer(empty, { type: "open", id: "about", position: at });
    s = osReducer(s, { type: "move", id: "about", position: { x: 300, y: 40 } });
    expect(s.windows[0].position).toEqual({ x: 300, y: 40 });
  });

  it("minimized windows are skipped when finding focus, and reopen restores them", () => {
    let s = osReducer(empty, { type: "open", id: "about", position: at });
    s = osReducer(s, { type: "open", id: "terminal", position: at });
    s = osReducer(s, { type: "minimize", id: "terminal" });
    expect(focusedId(s)).toBe("about");
    expect(isOpen(s, "terminal")).toBe(false);
    s = osReducer(s, { type: "open", id: "terminal", position: at });
    expect(isOpen(s, "terminal")).toBe(true);
    expect(focusedId(s)).toBe("terminal");
  });

  it("drinks coffee on every open, never below the minimum, and refills to 100", () => {
    let s = osReducer({ windows: [], coffee: 50 }, { type: "open", id: "about", position: at });
    expect(s.coffee).toBe(50 - COFFEE_COST);
    s = osReducer({ windows: [], coffee: COFFEE_MIN }, { type: "open", id: "about", position: at });
    expect(s.coffee).toBe(COFFEE_MIN);
    s = osReducer(s, { type: "refill" });
    expect(s.coffee).toBe(100);
  });
});
