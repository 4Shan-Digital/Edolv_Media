import connectDB from '@/lib/db';
import Reel from '@/models/Reel';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';
import { signMediaUrls } from '@/lib/r2';

export const dynamic = 'force-dynamic';

/**
 * GET /api/reels
 * Public endpoint – fetch active reels sorted by order then newest first.
 * Query params: ?limit=6
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    let query = Reel.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-videoKey -thumbnailKey -__v');

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const reels = await query.lean();
    const signed = await signMediaUrls(JSON.parse(JSON.stringify(reels)));
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}
