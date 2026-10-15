import type { AppId, OSAction, OSState, WindowState } from "./types";

export const COFFEE_COST = 3;
export const COFFEE_MIN = 4;
export const COFFEE_FULL = 100;

/**
 * The whole window manager is this one pure function.
 * No React in here, so it is easy to unit test (see reducer.test.ts).
 */
export function osReducer(state: OSState, action: OSAction): OSState {
  switch (action.type) {
    case "open": {
      const coffee = Math.max(COFFEE_MIN, state.coffee - COFFEE_COST);
      const existing = state.windows.find((w) => w.id === action.id);
      const opened: WindowState = existing
        ? { ...existing, minimized: false }
        : { id: action.id, position: action.position, minimized: false };
      return {
        ...state,
        coffee,
        windows: [...without(state.windows, action.id), opened],
      };
    }

    case "close":
      return { ...state, windows: without(state.windows, action.id) };

    case "focus": {
      const target = state.windows.find((w) => w.id === action.id);
      if (!target || focusedId(state) === action.id) return state;
      return {
        ...state,
        windows: [...without(state.windows, action.id), { ...target, minimized: false }],
      };
    }

    case "move":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, position: action.position } : w,
        ),
      };

    case "minimize":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w,
        ),
      };

    case "refill":
      return { ...state, coffee: COFFEE_FULL };

    case "shutdown":
      return { ...state, windows: [] };

    default:
      return state;
  }
}

/** The top-most window that is not minimized, or null. */
export function focusedId(state: OSState): AppId | null {
  for (let i = state.windows.length - 1; i >= 0; i--) {
    if (!state.windows[i].minimized) return state.windows[i].id;
  }
  return null;
}

/**
 * What clicking an app's taskbar button does, like Windows:
 * the window on top gets minimized; anything else (minimized or behind) comes to the front.
 */
export function taskbarAction(state: OSState, id: AppId): OSAction {
  return focusedId(state) === id ? { type: "minimize", id } : { type: "focus", id };
}

export function isOpen(state: OSState, id: AppId): boolean {
  return state.windows.some((w) => w.id === id && !w.minimized);
}

function without(windows: WindowState[], id: AppId): WindowState[] {
  return windows.filter((w) => w.id !== id);
}
