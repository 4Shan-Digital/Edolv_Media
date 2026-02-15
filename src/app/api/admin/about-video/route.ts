import connectDB from '@/lib/db';
import AboutVideo from '@/models/AboutVideo';
import { getAdminFromCookies } from '@/lib/auth';
import { uploadToR2, deleteFromR2, signMediaUrls } from '@/lib/r2';
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
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createAboutVideoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
});

/**
 * GET /api/admin/about-video
 * Admin endpoint - fetch all about videos.
 */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const videos = await AboutVideo.find().sort({ createdAt: -1 }).lean();
    const signed = await signMediaUrls(JSON.parse(JSON.stringify(videos)));
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/about-video
 * Admin endpoint - upload a new about video.
 * Deactivates all previous videos (only one active at a time).
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

      const validatedData = createAboutVideoSchema.parse(body);

      // Deactivate all existing videos
      await AboutVideo.updateMany({}, { isActive: false });

      const aboutVideo = await AboutVideo.create({
        ...validatedData,
        videoUrl: body.videoUrl,
        videoKey: body.videoKey,
        thumbnailUrl: body.thumbnailUrl,
        thumbnailKey: body.thumbnailKey,
        isActive: true,
      });

      return apiSuccess(aboutVideo, 201);
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

      const validatedData = createAboutVideoSchema.parse(fields);

      const [videoBuffer, thumbnailBuffer] = await Promise.all([
        fileToBuffer(videoFile),
        fileToBuffer(thumbnailFile),
      ]);

      const [videoUpload, thumbnailUpload] = await Promise.all([
        uploadToR2(videoBuffer, videoFile.name, videoFile.type, 'about-video'),
        uploadToR2(thumbnailBuffer, thumbnailFile.name, thumbnailFile.type, 'thumbnails'),
      ]);

      // Deactivate all existing videos
      await AboutVideo.updateMany({}, { isActive: false });

      const aboutVideo = await AboutVideo.create({
        ...validatedData,
        videoUrl: videoUpload.url,
        videoKey: videoUpload.key,
        thumbnailUrl: thumbnailUpload.url,
        thumbnailKey: thumbnailUpload.key,
        isActive: true,
      });

      return apiSuccess(aboutVideo, 201);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/about-video
 * Admin endpoint - delete about video by ID.
 */
export async function DELETE(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return apiError('Video ID is required', 400);

    const video = await AboutVideo.findById(id);
    if (!video) return apiError('Video not found', 404);

    // Delete files from R2
    Promise.allSettled([
      video.videoKey ? deleteFromR2(video.videoKey) : Promise.resolve(),
      video.thumbnailKey ? deleteFromR2(video.thumbnailKey) : Promise.resolve(),
    ]).then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`R2 deletion ${index} failed:`, result.reason);
        }
      });
    });

    await AboutVideo.findByIdAndDelete(id);

    return apiSuccess({ message: 'Video deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
