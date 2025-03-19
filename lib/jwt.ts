import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Should be in .env file
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '1d'; // 1 day

interface TokenPayload {
  id: string;
  email: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

export async function extractUser(req: Request): Promise<TokenPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  
  const decodedToken = verifyToken(token);
  return decodedToken;
}