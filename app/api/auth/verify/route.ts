import { NextResponse } from "next/server";
import { extractUser } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const user = await extractUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        message: "Not authenticated"
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: true,
      authenticated: true,
      message: "Authentication valid"
    });
    
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, authenticated: false, message: "Server error during verification" },
      { status: 500 }
    );
  }
}