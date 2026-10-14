import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * A "key" that proves you wrote an entry. It is derived from the entry id and a server
 * secret, so nothing extra is stored in the database, and nobody can forge one without the secret.
 */
export function makeDeleteToken(id: string, secret: string): string {
  return createHmac("sha256", secret).update(`guestbook-delete:${id}`).digest("hex");
}

export function verifyDeleteToken(id: string, token: string, secret: string): boolean {
  const expected = Buffer.from(makeDeleteToken(id, secret));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
