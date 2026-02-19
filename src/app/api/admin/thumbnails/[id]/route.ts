import connectDB from '@/lib/db';
import Thumbnail from '@/models/Thumbnail';
import { getAdminFromCookies } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';
import { updateThumbnailSchema } from '@/lib/validations';
import { deleteFromR2, signMediaUrls } from '@/lib/r2';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/thumbnails/[id]
 * Admin endpoint - get a single thumbnail.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const thumbnail = await Thumbnail.findById(params.id).lean();
    if (!thumbnail) return apiError('Thumbnail not found', 404);

    const signed = await signMediaUrls(JSON.parse(JSON.stringify(thumbnail)));
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/admin/thumbnails/[id]
 * Admin endpoint - update a thumbnail.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const body = await request.json();
    const validatedData = updateThumbnailSchema.parse(body);

    const existingThumbnail = await Thumbnail.findById(params.id);
    if (!existingThumbnail) return apiError('Thumbnail not found', 404);

    const updateData: Record<string, unknown> = {};

    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive;

    // If a new image is uploaded, delete the old one from R2
    if (validatedData.imageUrl && validatedData.imageKey) {
      if (existingThumbnail.imageKey) {
        try {
          await deleteFromR2(existingThumbnail.imageKey);
        } catch (err) {
          console.error('Failed to delete old image from R2:', err);
        }
      }
      updateData.imageUrl = validatedData.imageUrl;
      updateData.imageKey = validatedData.imageKey;
    }

    const thumbnail = await Thumbnail.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    const signed = await signMediaUrls(JSON.parse(JSON.stringify(thumbnail)));
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/thumbnails/[id]
 * Admin endpoint - delete a thumbnail.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const thumbnail = await Thumbnail.findById(params.id);
    if (!thumbnail) return apiError('Thumbnail not found', 404);

    // Delete image from R2
    if (thumbnail.imageKey) {
      try {
        await deleteFromR2(thumbnail.imageKey);
      } catch (err) {
        console.error('Failed to delete image from R2:', err);
      }
    }

    await Thumbnail.findByIdAndDelete(params.id);

    return apiSuccess({ message: 'Thumbnail deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
