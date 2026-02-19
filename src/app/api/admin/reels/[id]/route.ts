import connectDB from '@/lib/db';
import Reel from '@/models/Reel';
import { getAdminFromCookies } from '@/lib/auth';
import { updateReelSchema } from '@/lib/validations';
import { deleteFromR2, signMediaUrls } from '@/lib/r2';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/reels/[id]
 * Admin – update a reel (title, isActive, order, or replace video/thumbnail).
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const reel = await Reel.findById(params.id);
    if (!reel) return apiError('Reel not found', 404);

    const body = await request.json();
    const validatedData = updateReelSchema.parse(body);

    // If new video was uploaded, delete the old one from R2
    if (validatedData.videoKey && validatedData.videoKey !== reel.videoKey) {
      if (reel.videoKey) {
        await deleteFromR2(reel.videoKey).catch(() => null);
      }
    }

    // If new thumbnail was uploaded, delete the old one from R2
    if (validatedData.thumbnailKey && validatedData.thumbnailKey !== reel.thumbnailKey) {
      if (reel.thumbnailKey) {
        await deleteFromR2(reel.thumbnailKey).catch(() => null);
      }
    }

    Object.assign(reel, validatedData);
    await reel.save();

    const signed = await signMediaUrls([JSON.parse(JSON.stringify(reel))]);
    return apiSuccess(signed[0]);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/reels/[id]
 * Admin – delete a reel and remove files from R2.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const reel = await Reel.findById(params.id);
    if (!reel) return apiError('Reel not found', 404);

    // Delete files from R2
    if (reel.videoKey) await deleteFromR2(reel.videoKey).catch(() => null);
    if (reel.thumbnailKey) await deleteFromR2(reel.thumbnailKey).catch(() => null);

    await Reel.deleteOne({ _id: params.id });

    return apiSuccess({ message: 'Reel deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
