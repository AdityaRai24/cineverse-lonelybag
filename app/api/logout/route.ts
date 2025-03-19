// app/api/logout/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Create a response
  const response = NextResponse.json({ 
    success: true, 
    message: "Logged out successfully" 
  });
  
  // Clear the auth_token cookie
  response.cookies.delete("auth_token");
  
  return response;
} 