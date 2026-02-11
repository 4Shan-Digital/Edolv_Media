import { removeAuthCookie } from '@/lib/auth';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/auth/logout
 * Admin logout endpoint.
 */
export async function POST() {
  try {
    await removeAuthCookie();
    return apiSuccess({ message: 'Logged out successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
