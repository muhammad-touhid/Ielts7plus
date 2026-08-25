import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  // Protect /admin routes
  const staffRoles = ["admin", "teacher", "moderator"];
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!session || !staffRoles.includes(role)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (staffRoles.includes(role)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Redirect logged-in users away from /login
  if (pathname === "/login" && session) {
    if (staffRoles.includes(role))
      return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
