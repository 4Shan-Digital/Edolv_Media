import connectDB from '@/lib/db';
import Application from '@/models/Application';
import { getAdminFromCookies } from '@/lib/auth';
import { updateApplicationStatusSchema } from '@/lib/validations';
import { deleteFromR2 } from '@/lib/r2';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/applications/[id]
 * Admin endpoint - fetch a single application with job details.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const application = await Application.findById(params.id)
      .populate('jobId', 'title department location type')
      .lean();

    if (!application) return apiError('Application not found', 404);

    return apiSuccess(application);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/admin/applications/[id]
 * Admin endpoint - update application status.
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
    const { status } = updateApplicationStatusSchema.parse(body);

    const application = await Application.findByIdAndUpdate(
      params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    )
      .populate('jobId', 'title department')
      .lean();

    if (!application) return apiError('Application not found', 404);

    return apiSuccess(application);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/applications/[id]
 * Admin endpoint - delete an application.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const application = await Application.findById(params.id);
    if (!application) return apiError('Application not found', 404);

    // Delete resume from R2 if stored there
    if (application.resumeKey) {
      deleteFromR2(application.resumeKey).catch((err) =>
        console.error('Failed to delete resume from R2:', err)
      );
    }

    await Application.findByIdAndDelete(params.id);

    return apiSuccess({ message: 'Application deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
