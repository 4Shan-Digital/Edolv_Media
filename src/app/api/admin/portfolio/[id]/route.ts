import connectDB from '@/lib/db';
import Portfolio from '@/models/Portfolio';
import { getAdminFromCookies } from '@/lib/auth';
import { updatePortfolioSchema } from '@/lib/validations';
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
 * GET /api/admin/portfolio/[id]
 * Admin endpoint - fetch a single portfolio item.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const portfolio = await Portfolio.findById(params.id).lean();
    if (!portfolio) return apiError('Portfolio item not found', 404);

    return apiSuccess(portfolio);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/admin/portfolio/[id]
 * Admin endpoint - update a portfolio item.
 * Supports JSON (with pre-uploaded URLs) or FormData (with file uploads).
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const portfolio = await Portfolio.findById(params.id);
    if (!portfolio) return apiError('Portfolio item not found', 404);

    const contentType = request.headers.get('content-type') || '';
    const updateData: Record<string, unknown> = {};

    if (contentType.includes('application/json')) {
      // New method: JSON with pre-uploaded URLs
      const body = await request.json();
      const validatedData = updatePortfolioSchema.parse(body);
      Object.assign(updateData, validatedData);

      // If new video or thumbnail URLs provided, delete old files from R2
      if (body.videoUrl && body.videoUrl !== portfolio.videoUrl && portfolio.videoKey) {
        deleteFromR2(portfolio.videoKey).catch((err) =>
          console.error('Failed to delete old video:', err)
        );
      }

      if (body.thumbnailUrl && body.thumbnailUrl !== portfolio.thumbnailUrl && portfolio.thumbnailKey) {
        deleteFromR2(portfolio.thumbnailKey).catch((err) =>
          console.error('Failed to delete old thumbnail:', err)
        );
      }
    } else {
      // Old method: FormData with file uploads
      const { fields, files } = await parseFormData(request);
      const validatedData = updatePortfolioSchema.parse(fields);
      Object.assign(updateData, validatedData);

      // Handle video file replacement
      if (files.video) {
        const videoError = validateFile(files.video, VIDEO_TYPES, MAX_VIDEO_SIZE_MB);
        if (videoError) return apiError(videoError, 400);

        const videoBuffer = await fileToBuffer(files.video);
        const videoUpload = await uploadToR2(videoBuffer, files.video.name, files.video.type, 'portfolio');

        // Delete old video from R2
        if (portfolio.videoKey) {
          deleteFromR2(portfolio.videoKey).catch((err) =>
            console.error('Failed to delete old video:', err)
          );
        }

        updateData.videoUrl = videoUpload.url;
        updateData.videoKey = videoUpload.key;
      }

      // Handle thumbnail file replacement
      if (files.thumbnail) {
        const imageError = validateFile(files.thumbnail, IMAGE_TYPES, MAX_IMAGE_SIZE_MB);
        if (imageError) return apiError(imageError, 400);

        const thumbnailBuffer = await fileToBuffer(files.thumbnail);
        const thumbnailUpload = await uploadToR2(thumbnailBuffer, files.thumbnail.name, files.thumbnail.type, 'thumbnails');

        // Delete old thumbnail from R2
        if (portfolio.thumbnailKey) {
          deleteFromR2(portfolio.thumbnailKey).catch((err) =>
            console.error('Failed to delete old thumbnail:', err)
          );
        }

        updateData.thumbnailUrl = thumbnailUpload.url;
        updateData.thumbnailKey = thumbnailUpload.key;
      }

      // Handle order and isActive from fields
      if (fields.order !== undefined) {
        updateData.order = parseInt(fields.order, 10);
      }
      if (fields.isActive !== undefined) {
        updateData.isActive = fields.isActive === 'true';
      }
    }

    const updated = await Portfolio.findByIdAndUpdate(
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
 * DELETE /api/admin/portfolio/[id]
 * Admin endpoint - delete a portfolio item and its files from R2.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const portfolio = await Portfolio.findById(params.id);
    if (!portfolio) return apiError('Portfolio item not found', 404);

    // Delete files from R2 (non-blocking)
    Promise.allSettled([
      deleteFromR2(portfolio.videoKey),
      deleteFromR2(portfolio.thumbnailKey),
    ]).then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`R2 deletion ${index} failed:`, result.reason);
        }
      });
    });

    await Portfolio.findByIdAndDelete(params.id);

    return apiSuccess({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
