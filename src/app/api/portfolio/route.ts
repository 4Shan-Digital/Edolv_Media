import connectDB from '@/lib/db';
import Portfolio from '@/models/Portfolio';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';
import { signMediaUrls } from '@/lib/r2';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portfolio
 * Public endpoint - fetch all active portfolio items.
 * Query params: ?category=Corporate&limit=6
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

    let query = Portfolio.find(filter)
      .sort({ createdAt: -1 })
      .select('-videoKey -thumbnailKey -__v');

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const portfolios = await query.lean();
    const signed = await signMediaUrls(JSON.parse(JSON.stringify(portfolios)));
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}
