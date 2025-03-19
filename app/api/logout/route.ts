// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create 
    
    
    const response = NextResponse.json({
      success: true,
      message: "Logout successful"
    });
    
    // Clear auth token cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      sameSite: 'strict',
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during logout" },
      { status: 500 }
    );
  }
}