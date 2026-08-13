import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

// HTTP Basic Auth for the admin area only (see `config.matcher` below).
// Username is fixed ("mor"); password comes from ADMIN_PASSWORD. If the env
// var is missing we fail closed: every request gets 401.

const NOINDEX = "noindex, nofollow";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"',
      "X-Robots-Tag": NOINDEX,
    },
  });
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return unauthorized();

  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return unauthorized();

  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const sep = decoded.indexOf(":");
  if (sep < 0) return unauthorized();

  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);
  if (!safeEqual(user, "mor") || !safeEqual(pass, password)) {
    return unauthorized();
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", NOINDEX);
  return response;
}

export const config = {
  // Admin-only scope; no other route is touched by this proxy.
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
