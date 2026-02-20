import connectDB from '@/lib/db';
import Job from '@/models/Job';
import { getAdminFromCookies } from '@/lib/auth';
import { createJobSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/jobs
 * Admin endpoint - fetch all jobs (including inactive).
 */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const jobs = await Job.find().sort({ priority: -1, createdAt: -1 }).lean();
    return apiSuccess(jobs);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/jobs
 * Admin endpoint - create a new job listing.
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const body = await request.json();
    const validatedData = createJobSchema.parse(body);

    const job = await Job.create(validatedData);
    return apiSuccess(job, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
