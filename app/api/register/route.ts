import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import User from "@/lib/UserSchema.js";
import {connectToDatabase} from "@/lib/Connection.js"

interface User {
  id: string;
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
    };

    await User.create(newUser);

    const token = signToken({
      id: newUser.id,
      email: newUser.email,
    });

    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during registration" },
      { status: 500 }
    );
  }
}
