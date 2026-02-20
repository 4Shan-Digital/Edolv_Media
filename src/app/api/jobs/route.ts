import connectDB from '@/lib/db';
import Job from '@/models/Job';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/jobs
 * Public endpoint - fetch all active jobs.
 * Query params: ?department=Production
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');

    const filter: Record<string, unknown> = { isActive: true };
    if (department && department !== 'All') {
      filter.department = department;
    }

    const jobs = await Job.find(filter)
      .sort({ isUrgent: -1, priority: -1, createdAt: -1 })
      .select('-__v')
      .lean();

    return apiSuccess(jobs);
  } catch (error) {
    return handleApiError(error);
  }
}
