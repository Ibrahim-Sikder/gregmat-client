import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/user",
  "/mountains",
  "/prep-swift",
  "/prep-swift/quizzes/",
  "/write-essay",
  "/quizzes",
  "/practices/quant-problems",
  "/practices/verbal-problems",
  "/skill-building/main-idea",
  "/skill-building/pairing",
  "/skill-building/sentence-function",
  "/skill-building/support-contrast",
  "/skill-building/vocab-check",
  "/vocab",
  "/misc",
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const cookie = request.cookies.get("session");
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  const isPlus = searchParams.get("isPlus") === "true";
  if (isPlus && !cookie) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  if (isProtected && !cookie) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (cookie && pathname === "/auth") {
    const redirectTo = searchParams.get("redirect") || "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/mountains/:path*",
    "/auth",
    "/prep-swift/:path*",
    "/prep-swift/quizzes/",
    "/class/:path*",
    "/write-essay/:path*",
    "/quizzes/:path*",
    "/practices/quant-problems",
    "/practices/quant-problems/:path*",
    "/practices/verbal-problems",
    "/practices/verbal-problems/:path*",
    "/skill-building/main-idea",
    "/skill-building/main-idea/:path*",
    "/skill-building/pairing",
    "/skill-building/pairing/:path*",
    "/skill-building/sentence-function",
    "/skill-building/sentence-function/:path*",
    "/skill-building/support-contrast",
    "/skill-building/support-contrast/:path*",
    "/skill-building/vocab-check",
    "/skill-building/vocab-check/:path*",
    "/vocab/:path*",
    "/misc/:path*",
  ],
};
