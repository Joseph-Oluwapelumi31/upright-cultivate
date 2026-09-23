import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin");

  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/signin", req.nextUrl.origin);

    signInUrl.searchParams.set(
      "callbackUrl",
      req.nextUrl.pathname
    );

    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};