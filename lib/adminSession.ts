import { createHmac, timingSafeEqual } from "node:crypto";

// Shared between proxy.ts (verification) and the /admin/login action (issuing).

export const SESSION_COOKIE = "mor_admin_session";

// Deterministic session token derived from the admin password, so a password
// change invalidates existing sessions. No server-side session state needed.
export function sessionToken(password: string) {
  return createHmac("sha256", password)
    .update("mor-admin-session-v1")
    .digest("hex");
}

export function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
