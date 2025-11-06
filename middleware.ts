import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Read token and role cookies
  const tokenName = process.env.NEXT_PUBLIC_APP_TOKEN_NAME || "token";
  const hasToken = request.cookies.get(tokenName)?.value;
  const role = request.cookies.get("user_role")?.value; // Optional, if you set role cookie

  // Define public routes
  const publicRoutes = [
    "/",
    // "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify",
    "/auth/client/signin",
    "/auth/employee/signin",
    "/admin-dashboard",
    "/coordinator-dashboard"
  ];

  const pathname = request.nextUrl.pathname;

  // 🔹 1. Redirect unauthenticated users away from private routes
  if (!hasToken && !publicRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    const res = NextResponse.redirect(url);
    res.headers.set("x-middleware-cache", "no-cache");
    return res;
  }

  // 🔹 2. Redirect authenticated users away from auth routes
  if (hasToken && pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();

    // Optional: redirect based on role
    if (role === "ROLE_ADMIN") url.pathname = "/admin/dashboard";
    else if (role === "ROLE_EMPLOYEE") url.pathname = "/employee/dashboard";
    else if (role === "ROLE_CLIENT") url.pathname = "/client/dashboard";
    else url.pathname = "/home"; // fallback

    const res = NextResponse.redirect(url);
    res.headers.set("x-middleware-cache", "no-cache");
    return res;
  }

  if (role === "ROLE_COORDINATOR") {
    const url = request.nextUrl.clone();
  }

  // 🔹 3. Allow normal requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|sitemap.xml).*)",
  ],
};
