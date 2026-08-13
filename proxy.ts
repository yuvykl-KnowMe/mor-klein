import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, safeEqual, sessionToken } from "@/lib/adminSession";

// Cookie-session auth for the admin area only (see `config.matcher` below).
// The login form at /admin/login checks ADMIN_PASSWORD and sets a signed
// session cookie; here we only verify that cookie. If the env var is missing
// we fail closed: every request gets 401.

const NOINDEX = "noindex, nofollow";

function withNoindex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", NOINDEX);
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page itself must stay reachable.
  if (pathname === "/admin/login") return withNoindex(NextResponse.next());

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return new NextResponse("Admin area is not configured", {
      status: 401,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  const cookie = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  if (cookie && safeEqual(cookie, sessionToken(password))) {
    return withNoindex(NextResponse.next());
  }

  if (pathname.startsWith("/api/")) {
    return withNoindex(
      NextResponse.json({ error: "unauthorized" }, { status: 401 })
    );
  }
  return withNoindex(
    NextResponse.redirect(new URL("/admin/login", request.url))
  );
}

export const config = {
  // Admin-only scope; no other route is touched by this proxy.
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
