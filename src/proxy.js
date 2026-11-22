import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Fast, optimistic guard: no session cookie → straight to sign in, remembering the page.
 * The real session and role checks happen on the server in the dashboard/payment layouts.
 */
export function proxy(request) {
  if (!getSessionCookie(request)) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*"],
};
