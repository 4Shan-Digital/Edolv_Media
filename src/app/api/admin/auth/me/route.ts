import { getAdminFromCookies } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/auth/me
 * Check if admin is authenticated.
 */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();

    if (!admin) {
      return apiError('Not authenticated', 401);
    }

    return apiSuccess({ email: admin.email, role: admin.role });
  } catch (error) {
    return handleApiError(error);
  }
}
