import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { getAdminFromCookies } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/contacts
 * Admin endpoint - fetch all contact submissions.
 * Query params: ?isRead=false&page=1&limit=20
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const isRead = searchParams.get('isRead');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const filter: Record<string, unknown> = {};
    if (isRead !== null && isRead !== undefined && isRead !== '') {
      filter.isRead = isRead === 'true';
    }

    const skip = (page - 1) * limit;

    const [contacts, total, unreadCount] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(filter),
      Contact.countDocuments({ isRead: false }),
    ]);

    return apiSuccess({
      contacts,
      unreadCount,
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
