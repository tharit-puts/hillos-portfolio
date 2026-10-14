export const NAME_MAX = 40;
export const MESSAGE_MAX = 280;

export type ValidationResult =
  | { ok: true; value: { name: string; message: string } }
  | { ok: false; error: string };

/** Form data is untrusted, so inputs are `unknown` and checked before use. */
export function validateEntry(input: { name: unknown; message: unknown }): ValidationResult {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (!name) return { ok: false, error: "Please enter your name." };
  if (name.length > NAME_MAX) return { ok: false, error: `Name is too long (max ${NAME_MAX}).` };
  if (!message) return { ok: false, error: "Please write a message." };
  if (message.length > MESSAGE_MAX) return { ok: false, error: `Message is too long (max ${MESSAGE_MAX}).` };
  if (/https?:\/\/|www\./i.test(message)) return { ok: false, error: "Links are not allowed." };

  return { ok: true, value: { name, message } };
}
