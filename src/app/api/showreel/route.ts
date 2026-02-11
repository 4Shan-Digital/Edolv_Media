import connectDB from '@/lib/db';
import Showreel from '@/models/Showreel';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';
import { signMediaUrls } from '@/lib/r2';

export const dynamic = 'force-dynamic';

/**
 * GET /api/showreel
 * Public endpoint - fetch the active showreel.
 */
export async function GET() {
  try {
    await connectDB();

    const showreel = await Showreel.findOne({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-videoKey -thumbnailKey -__v')
      .lean();

    const signed = showreel ? await signMediaUrls(JSON.parse(JSON.stringify(showreel))) : null;
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}
