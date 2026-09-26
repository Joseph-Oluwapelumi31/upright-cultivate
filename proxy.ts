import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/supply/checkout");
    
  const isAuthRoute = 
    pathname.startsWith("/signin") || 
    pathname.startsWith("/signup") || 
    pathname.startsWith("/forgot-password") || 
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-otp");

  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/signin", req.nextUrl.origin);

    signInUrl.searchParams.set(
      "next",
      `${req.nextUrl.pathname}${req.nextUrl.search}`
    );

    return Response.redirect(signInUrl);
  }
  
  if (isAuthRoute && isLoggedIn) {
    const role = (req.auth as any)?.user?.role;
    const destination = role === "ADMIN" ? "/admin" : "/dashboard";
    return Response.redirect(new URL(destination, req.nextUrl.origin));
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/supply/checkout/:path*",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ],
};