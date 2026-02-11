import connectDB from '@/lib/db';
import Application from '@/models/Application';
import { getAdminFromCookies } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';
import { signMediaUrls } from '@/lib/r2';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/applications
 * Admin endpoint - fetch all applications.
 * Query params: ?jobId=xxx&status=pending&page=1&limit=20
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const filter: Record<string, unknown> = {};
    if (jobId) filter.jobId = jobId;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('jobId', 'title department')
        .lean(),
      Application.countDocuments(filter),
    ]);

    // Sign resume URLs so they can be downloaded
    const signedApplications = await signMediaUrls(JSON.parse(JSON.stringify(applications)));

    return apiSuccess({
      applications: signedApplications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
