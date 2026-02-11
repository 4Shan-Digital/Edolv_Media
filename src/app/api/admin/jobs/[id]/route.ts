import connectDB from '@/lib/db';
import Job from '@/models/Job';
import { getAdminFromCookies } from '@/lib/auth';
import { updateJobSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/jobs/[id]
 * Admin endpoint - fetch a single job.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const job = await Job.findById(params.id).lean();
    if (!job) return apiError('Job not found', 404);

    return apiSuccess(job);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/admin/jobs/[id]
 * Admin endpoint - update a job listing.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const body = await request.json();
    const validatedData = updateJobSchema.parse(body);

    const job = await Job.findByIdAndUpdate(
      params.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).lean();

    if (!job) return apiError('Job not found', 404);

    return apiSuccess(job);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/jobs/[id]
 * Admin endpoint - delete a job listing.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const job = await Job.findByIdAndDelete(params.id);
    if (!job) return apiError('Job not found', 404);

    return apiSuccess({ message: 'Job deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
