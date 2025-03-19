import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import User from "@/lib/UserSchema";
import { connectToDatabase } from "@/lib/Connection";

interface User {
  id: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: user.id,
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: false, // Change to false for localhost development
      sameSite: "lax", // Try "lax" instead of "strict" for development
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during login" },
      { status: 500 }
    );
  }
}
