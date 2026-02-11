import connectDB from '@/lib/db';
import Job from '@/models/Job';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/jobs/[id]
 * Public endpoint - fetch a single job by ID.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const job = await Job.findOne({ _id: params.id, isActive: true })
      .select('-__v')
      .lean();

    if (!job) {
      return apiError('Job not found', 404);
    }

    return apiSuccess(job);
  } catch (error) {
    return handleApiError(error);
  }
}
