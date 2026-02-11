import { NextResponse } from 'next/server';
import { getAdminFromCookies } from '@/lib/auth';

/**
 * GET /api/admin/auth/debug
 * Debug endpoint to verify environment variables are loaded
 * Protected - requires admin authentication
 * Disabled in production
 */
export async function GET() {
  // Block in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { success: false, error: 'Not available in production' },
      { status: 404 }
    );
  }

  // Require authentication
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const hasAdminEmail = !!process.env.ADMIN_EMAIL;
  const hasAdminPasswordHash = !!process.env.ADMIN_PASSWORD_HASH;
  const hasJwtSecret = !!process.env.JWT_SECRET;
  const hasMongoUri = !!process.env.MONGODB_URI;

  return NextResponse.json({
    success: true,
    environment: {
      hasAdminEmail,
      hasAdminPasswordHash,
      hasJwtSecret,
      hasMongoUri,
      adminEmail: process.env.ADMIN_EMAIL || 'NOT SET',
      passwordHashLength: process.env.ADMIN_PASSWORD_HASH?.length || 0,
      passwordHashPrefix: process.env.ADMIN_PASSWORD_HASH?.substring(0, 7) || 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
    },
  });
}
