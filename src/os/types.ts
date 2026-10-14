export type AppId =
  | "about"
  | "projects"
  | "terminal"
  | "resume"
  | "contact"
  | "guestbook"
  | "trash";

export interface Point {
  x: number;
  y: number;
}

export interface WindowState {
  id: AppId;
  position: Point;
  minimized: boolean;
}

export interface OSState {
  /** Array order is the z-order: the last item is drawn on top. */
  windows: WindowState[];
  /** The coffee meter in the menu bar, 0–100. */
  coffee: number;
}

export type OSAction =
  | { type: "open"; id: AppId; position: Point }
  | { type: "close"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "move"; id: AppId; position: Point }
  | { type: "minimize"; id: AppId }
  | { type: "refill" }
  | { type: "shutdown" };
