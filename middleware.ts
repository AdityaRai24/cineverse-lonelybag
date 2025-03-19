import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Define public and protected routes
const publicPaths = ["/", "/login", "/register"];
const authRequiredPaths = ["/home", "/browse", "/favorites"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip processing for API routes and static assets
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Check if route requires authentication
  const requiresAuth = authRequiredPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Check if it's a public route
  const isPublicPath = publicPaths.some(path => pathname === path);
  
  // Get auth token from cookies
  const authToken = request.cookies.get("auth_token")?.value;
  
  // Handle authenticated users on public pages (redirect to home)
  if (isPublicPath && authToken) {
    try {
      // Simple check if token exists (no need to verify for redirect)
      return NextResponse.redirect(new URL("/home", request.url));
    } catch (error) {
      // If error, continue to public page
      return NextResponse.next();
    }
  }
  
  // Handle unauthenticated users on protected pages
  if (requiresAuth && !authToken) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // For authenticated users on protected pages, verify token
  if (requiresAuth && authToken) {
    try {
      const decoded = verifyToken(authToken);
      if (!decoded) {
        // Invalid token, redirect to login
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete("auth_token");
        return response;
      }
      
      // Valid token, proceed
      return NextResponse.next();
    } catch (error) {
      // Token verification failed
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }
  
  // Default: proceed with the request
  return NextResponse.next();
}

// Configure which routes this middleware applies to
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)'
  ],
};