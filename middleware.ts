import { NextRequest, NextResponse } from "next/server";
// If the incoming request has the "token" cookie
export function middleware(request: NextRequest) {
  const has_token = request.cookies.get(process.env.NEXT_APP_TOKEN_NAME!);
  const auth_routes = [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify",
    "/auth/client/signin",
    "/auth/employee/signin"
  ];

  if (
    (has_token === undefined || has_token === null) &&
    !auth_routes.includes(request.nextUrl.pathname)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    const response = NextResponse.redirect(url);
    response.headers.set("x-middleware-cache", "no-cache");
    return response;
  } else if (has_token && request.nextUrl.pathname.startsWith("/auth/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    const response = NextResponse.redirect(url);
    response.headers.set("x-middleware-cache", "no-cache");
    return response;
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|sitemap.xml).*)"
  ]
};
