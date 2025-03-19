import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Paths that don't require authentication
const publicPaths = ["/", "/login", "/register", "/home","/movie"];
const authRequiredPaths = ["/profile", "/settings", "/movies", "/tv-shows"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  const requiresAuth = authRequiredPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isPublicPath = publicPaths.some((path) => pathname === path);

  // Get auth token from cookie
  const authToken = request.cookies.get("auth_token")?.value;

  // If user is authenticated and tries to access a public path like "/", redirect them to "/home"
  if (isPublicPath && authToken) {
    try {
      const decoded = verifyToken(authToken);
      if (decoded) {
        return NextResponse.redirect(new URL("/home", request.url));
      }
    } catch (error) {
      console.error("Invalid token:", error);
      // If token verification fails, clear the invalid cookie
      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // If user is unauthenticated and tries to access a protected route, redirect them to "/"
  if (requiresAuth && !authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // For protected routes, verify the token is valid
  if (requiresAuth && authToken) {
    try {
      const decoded = verifyToken(authToken);
      if (!decoded) {
        // If token is invalid, redirect to login
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete("auth_token");
        return response;
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      // If token verification fails, clear the cookie and redirect
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|public|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)",
  ],
};
