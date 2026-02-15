import connectDB from '@/lib/db';
import Showreel from '@/models/Showreel';
import { getAdminFromCookies } from '@/lib/auth';
import { updateShowreelSchema } from '@/lib/validations';
import { uploadToR2, deleteFromR2 } from '@/lib/r2';
import {
  apiSuccess,
  apiError,
  handleApiError,
  parseFormData,
  fileToBuffer,
  validateFile,
  VIDEO_TYPES,
  IMAGE_TYPES,
  MAX_VIDEO_SIZE_MB,
  MAX_IMAGE_SIZE_MB,
} from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/showreel/[id]
 * Admin endpoint - update showreel details or replace video/thumbnail.
 * Supports JSON (presigned URL method) and FormData (legacy method).
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const showreel = await Showreel.findById(params.id);
    if (!showreel) return apiError('Showreel not found', 404);

    const contentType = request.headers.get('content-type') || '';
    const updateData: Record<string, unknown> = {};

    if (contentType.includes('application/json')) {
      // New method: JSON with pre-uploaded URLs
      const body = await request.json();
      const validatedData = updateShowreelSchema.parse(body);
      Object.assign(updateData, validatedData);

      // If new video URL provided, delete old file from R2
      if (body.videoUrl && body.videoUrl !== showreel.videoUrl && showreel.videoKey) {
        deleteFromR2(showreel.videoKey).catch((err) =>
          console.error('Failed to delete old showreel video:', err)
        );
      }
      if (body.videoUrl) {
        updateData.videoUrl = body.videoUrl;
        updateData.videoKey = body.videoKey;
      }

      // If new thumbnail URL provided, delete old file from R2
      if (body.thumbnailUrl && body.thumbnailUrl !== showreel.thumbnailUrl && showreel.thumbnailKey) {
        deleteFromR2(showreel.thumbnailKey).catch((err) =>
          console.error('Failed to delete old showreel thumbnail:', err)
        );
      }
      if (body.thumbnailUrl) {
        updateData.thumbnailUrl = body.thumbnailUrl;
        updateData.thumbnailKey = body.thumbnailKey;
      }

      // Handle isActive toggle
      if (body.isActive !== undefined) {
        const newIsActive = body.isActive === true || body.isActive === 'true';
        if (newIsActive) {
          await Showreel.updateMany({ _id: { $ne: params.id } }, { isActive: false });
        }
        updateData.isActive = newIsActive;
      }
    } else {
      // Old method: FormData with file uploads
      const { fields, files } = await parseFormData(request);

      const validatedData = updateShowreelSchema.parse(fields);
      Object.assign(updateData, validatedData);

      // Handle video replacement
      if (files.video) {
        const videoError = validateFile(files.video, VIDEO_TYPES, MAX_VIDEO_SIZE_MB);
        if (videoError) return apiError(videoError, 400);

        const videoBuffer = await fileToBuffer(files.video);
        const videoUpload = await uploadToR2(videoBuffer, files.video.name, files.video.type, 'showreel');

        if (showreel.videoKey) {
          deleteFromR2(showreel.videoKey).catch((err) =>
            console.error('Failed to delete old showreel video:', err)
          );
        }

        updateData.videoUrl = videoUpload.url;
        updateData.videoKey = videoUpload.key;
      }

      // Handle thumbnail replacement
      if (files.thumbnail) {
        const imageError = validateFile(files.thumbnail, IMAGE_TYPES, MAX_IMAGE_SIZE_MB);
        if (imageError) return apiError(imageError, 400);

        const thumbnailBuffer = await fileToBuffer(files.thumbnail);
        const thumbnailUpload = await uploadToR2(thumbnailBuffer, files.thumbnail.name, files.thumbnail.type, 'thumbnails');

        if (showreel.thumbnailKey) {
          deleteFromR2(showreel.thumbnailKey).catch((err) =>
            console.error('Failed to delete old showreel thumbnail:', err)
          );
        }

        updateData.thumbnailUrl = thumbnailUpload.url;
        updateData.thumbnailKey = thumbnailUpload.key;
      }

      // Handle isActive toggle
      if (fields.isActive !== undefined) {
        const newIsActive = fields.isActive === 'true';
        if (newIsActive) {
          await Showreel.updateMany({ _id: { $ne: params.id } }, { isActive: false });
        }
        updateData.isActive = newIsActive;
      }
    }

    const updated = await Showreel.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/showreel/[id]
 * Admin endpoint - delete a showreel and its files from R2.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const showreel = await Showreel.findById(params.id);
    if (!showreel) return apiError('Showreel not found', 404);

    // Delete files from R2
    Promise.allSettled([
      deleteFromR2(showreel.videoKey),
      deleteFromR2(showreel.thumbnailKey),
    ]).then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`R2 deletion ${index} failed:`, result.reason);
        }
      });
    });

    await Showreel.findByIdAndDelete(params.id);

    return apiSuccess({ message: 'Showreel deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
