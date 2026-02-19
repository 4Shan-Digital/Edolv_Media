import connectDB from '@/lib/db';
import ThumbnailCategory from '@/models/ThumbnailCategory';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/thumbnail-categories
 * Public endpoint - fetch all active thumbnail categories.
 */
export async function GET() {
  try {
    await connectDB();

    const categories = await ThumbnailCategory.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .select('name slug -_id')
      .lean();

    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}
