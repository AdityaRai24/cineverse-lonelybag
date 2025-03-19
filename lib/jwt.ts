import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

// Should be in .env file
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);
const JWT_EXPIRY = "1d"; // 1 day

interface TokenPayload {
  id: string;
  email: string;
}

export async function signToken(payload: any): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
  return jwt;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as any;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

export async function extractUser(req: Request): Promise<TokenPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;

  const decodedToken = await verifyToken(token);
  return decodedToken;
}
