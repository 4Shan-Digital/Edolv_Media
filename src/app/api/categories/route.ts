import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/categories
 * Public endpoint - fetch all active categories.
 */
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .select('name slug -_id')
      .lean();

    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}
