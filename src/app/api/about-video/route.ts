import connectDB from '@/lib/db';
import AboutVideo from '@/models/AboutVideo';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';
import { signMediaUrls } from '@/lib/r2';

export const dynamic = 'force-dynamic';

/**
 * GET /api/about-video
 * Public endpoint - fetch the active about video.
 */
export async function GET() {
  try {
    await connectDB();

    const aboutVideo = await AboutVideo.findOne({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    const signed = aboutVideo ? await signMediaUrls(JSON.parse(JSON.stringify(aboutVideo))) : null;
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}
