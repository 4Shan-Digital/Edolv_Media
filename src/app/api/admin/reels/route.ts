import connectDB from '@/lib/db';
import Reel from '@/models/Reel';
import { getAdminFromCookies } from '@/lib/auth';
import { createReelSchema } from '@/lib/validations';
import { signMediaUrls } from '@/lib/r2';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/reels
 * Admin – fetch all reels (including inactive), signed URLs.
 */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const reels = await Reel.find().sort({ order: 1, createdAt: -1 }).lean();
    const signed = await signMediaUrls(JSON.parse(JSON.stringify(reels)));
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/reels
 * Admin – create a new reel. Expects JSON with pre-uploaded file URLs.
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const body = await request.json();

    if (!body.videoUrl || !body.videoKey) {
      return apiError('Video URL and key are required', 400);
    }

    const validatedData = createReelSchema.parse(body);

    const maxOrder = await Reel.findOne().sort({ order: -1 }).select('order').lean();
    const nextOrder = (maxOrder?.order ?? -1) + 1;

    const reel = await Reel.create({
      title: validatedData.title,
      videoUrl: validatedData.videoUrl,
      videoKey: validatedData.videoKey,
      thumbnailUrl: validatedData.thumbnailUrl || '',
      thumbnailKey: validatedData.thumbnailKey || '',
      order: nextOrder,
      isActive: true,
    });

    return apiSuccess(reel, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
