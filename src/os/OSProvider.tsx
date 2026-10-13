"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { manifest } from "@/apps/manifest";
import { focusedId, osReducer, taskbarAction } from "./reducer";
import type { AppId, OSState, Point } from "./types";

export const initialOSState: OSState = {
  windows: [
    { id: "about", position: manifest.about.defaultPosition, minimized: false },
    { id: "terminal", position: manifest.terminal.defaultPosition, minimized: false },
  ],
  coffee: 87,
};

interface OSApi {
  state: OSState;
  focused: AppId | null;
  open: (id: AppId) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  move: (id: AppId, position: Point) => void;
  minimize: (id: AppId) => void;
  refill: () => void;
  /** Click on an app's taskbar button: minimize it if on top, otherwise bring it forward. */
  toggleFromTaskbar: (id: AppId) => void;
  /** Close every window. */
  shutdown: () => void;
}

const OSContext = createContext<OSApi | null>(null);

export function OSProvider({
  children,
  initialState = initialOSState,
}: {
  children: ReactNode;
  initialState?: OSState;
}) {
  const [state, dispatch] = useReducer(osReducer, initialState);

  const api = useMemo<OSApi>(
    () => ({
      state,
      focused: focusedId(state),
      open: (id) => dispatch({ type: "open", id, position: manifest[id].defaultPosition }),
      close: (id) => dispatch({ type: "close", id }),
      focus: (id) => dispatch({ type: "focus", id }),
      move: (id, position) => dispatch({ type: "move", id, position }),
      minimize: (id) => dispatch({ type: "minimize", id }),
      refill: () => dispatch({ type: "refill" }),
      toggleFromTaskbar: (id) => dispatch(taskbarAction(state, id)),
      shutdown: () => dispatch({ type: "shutdown" }),
    }),
    [state],
  );

  return <OSContext.Provider value={api}>{children}</OSContext.Provider>;
}

export function useOS(): OSApi {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used inside <OSProvider>");
  return ctx;
}
