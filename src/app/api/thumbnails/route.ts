import connectDB from '@/lib/db';
import Thumbnail from '@/models/Thumbnail';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';
import { signMediaUrls } from '@/lib/r2';

export const dynamic = 'force-dynamic';

/**
 * GET /api/thumbnails
 * Public endpoint - fetch all active thumbnails.
 * Query params: ?category=YouTube&limit=12
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const filter: Record<string, unknown> = { isActive: true };
    if (category && category !== 'All') {
      filter.category = category;
    }

    let query = Thumbnail.find(filter)
      .sort({ createdAt: -1 })
      .select('-imageKey -__v');

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const thumbnails = await query.lean();
    const signed = await signMediaUrls(JSON.parse(JSON.stringify(thumbnails)));
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}
