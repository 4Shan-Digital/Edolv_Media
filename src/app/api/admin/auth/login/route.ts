import { verifyAdminCredentials, generateToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/auth/login
 * Admin login endpoint.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const isValid = await verifyAdminCredentials(email, password);
    
    if (!isValid) {
      return apiError('Invalid email or password', 401);
    }

    const token = await generateToken(email);
    await setAuthCookie(token);

    return apiSuccess({ message: 'Login successful' });
  } catch (error) {
    return handleApiError(error);
  }
}
