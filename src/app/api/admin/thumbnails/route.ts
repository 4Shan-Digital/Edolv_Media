import connectDB from '@/lib/db';
import Thumbnail from '@/models/Thumbnail';
import { getAdminFromCookies } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';
import { createThumbnailSchema } from '@/lib/validations';
import { signMediaUrls } from '@/lib/r2';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/thumbnails
 * Admin endpoint - fetch all thumbnails.
 */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const thumbnails = await Thumbnail.find()
      .sort({ createdAt: -1 })
      .lean();

    const signed = await signMediaUrls(JSON.parse(JSON.stringify(thumbnails)));
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/thumbnails
 * Admin endpoint - create a new thumbnail (presigned URL flow).
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const body = await request.json();
    const validatedData = createThumbnailSchema.parse(body);

    if (!validatedData.imageUrl || !validatedData.imageKey) {
      return apiError('Image URL and key are required', 400);
    }

    const thumbnail = await Thumbnail.create({
      title: validatedData.title,
      category: validatedData.category,
      imageUrl: validatedData.imageUrl,
      imageKey: validatedData.imageKey,
    });

    return apiSuccess(thumbnail, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
