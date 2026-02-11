import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = '7d';

export interface AdminPayload {
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}

/**
 * Verify admin credentials against environment variables.
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    throw new Error('Admin credentials not configured in environment variables');
  }

  // Check email match
  if (email !== adminEmail) {
    return false;
  }

  // Verify password using bcrypt
  return bcrypt.compare(password, adminPasswordHash);
}

/**
 * Generate a JWT token for the admin.
 */
export async function generateToken(email: string): Promise<string> {
  return new SignJWT({ email, role: 'admin' as const })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token.
 */
export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

/**
 * Set the admin auth cookie.
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

/**
 * Remove the admin auth cookie.
 */
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get admin payload from cookies (for server components / route handlers).
 */
export async function getAdminFromCookies(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Get admin payload from a NextRequest (for middleware).
 */
export async function getAdminFromRequest(req: NextRequest): Promise<AdminPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Utility to hash a password (used for initial setup).
 * Run: npx tsx -e "import bcrypt from 'bcryptjs'; console.log(bcrypt.hashSync('your-password', 12))"
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
