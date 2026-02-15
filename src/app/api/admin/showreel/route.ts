import connectDB from '@/lib/db';
import Showreel from '@/models/Showreel';
import { getAdminFromCookies } from '@/lib/auth';
import { createShowreelSchema } from '@/lib/validations';
import { uploadToR2, signMediaUrls } from '@/lib/r2';
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
 * GET /api/admin/showreel
 * Admin endpoint - fetch all showreels.
 */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const showreels = await Showreel.find().sort({ createdAt: -1 }).lean();
    const signed = await signMediaUrls(JSON.parse(JSON.stringify(showreels)));
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/showreel
 * Admin endpoint - upload a new showreel.
 * Deactivates all previous showreels (only one active at a time).
 * Supports JSON (presigned URL method) and FormData (legacy method).
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // New method: JSON with pre-uploaded URLs (presigned URL flow)
      const body = await request.json();

      if (!body.videoUrl || !body.videoKey) {
        return apiError('Video URL and key are required', 400);
      }
      if (!body.thumbnailUrl || !body.thumbnailKey) {
        return apiError('Thumbnail URL and key are required', 400);
      }

      const validatedData = createShowreelSchema.parse(body);

      // Deactivate all existing showreels
      await Showreel.updateMany({}, { isActive: false });

      const showreel = await Showreel.create({
        ...validatedData,
        videoUrl: body.videoUrl,
        videoKey: body.videoKey,
        thumbnailUrl: body.thumbnailUrl,
        thumbnailKey: body.thumbnailKey,
        isActive: true,
      });

      return apiSuccess(showreel, 201);
    } else {
      // Old method: FormData with file uploads (kept for backward compatibility)
      const { fields, files } = await parseFormData(request);

      const videoFile = files.video;
      const thumbnailFile = files.thumbnail;

      if (!videoFile) return apiError('Video file is required', 400);
      if (!thumbnailFile) return apiError('Thumbnail image is required', 400);

      const videoError = validateFile(videoFile, VIDEO_TYPES, MAX_VIDEO_SIZE_MB);
      if (videoError) return apiError(videoError, 400);

      const imageError = validateFile(thumbnailFile, IMAGE_TYPES, MAX_IMAGE_SIZE_MB);
      if (imageError) return apiError(imageError, 400);

      const validatedData = createShowreelSchema.parse(fields);

      const [videoBuffer, thumbnailBuffer] = await Promise.all([
        fileToBuffer(videoFile),
        fileToBuffer(thumbnailFile),
      ]);

      const [videoUpload, thumbnailUpload] = await Promise.all([
        uploadToR2(videoBuffer, videoFile.name, videoFile.type, 'showreel'),
        uploadToR2(thumbnailBuffer, thumbnailFile.name, thumbnailFile.type, 'thumbnails'),
      ]);

      // Deactivate all existing showreels
      await Showreel.updateMany({}, { isActive: false });

      const showreel = await Showreel.create({
        ...validatedData,
        videoUrl: videoUpload.url,
        videoKey: videoUpload.key,
        thumbnailUrl: thumbnailUpload.url,
        thumbnailKey: thumbnailUpload.key,
        isActive: true,
      });

      return apiSuccess(showreel, 201);
    }
  } catch (error) {
    return handleApiError(error);
  }
}
