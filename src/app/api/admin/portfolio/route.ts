import connectDB from '@/lib/db';
import Portfolio from '@/models/Portfolio';
import { getAdminFromCookies } from '@/lib/auth';
import { createPortfolioSchema } from '@/lib/validations';
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
 * GET /api/admin/portfolio
 * Admin endpoint - fetch all portfolio items (including inactive).
 */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const portfolios = await Portfolio.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const signed = await signMediaUrls(JSON.parse(JSON.stringify(portfolios)));
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/portfolio
 * Admin endpoint - create a new portfolio item.
 * Expects multipart/form-data with video and thumbnail files.
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const { fields, files } = await parseFormData(request);

    // Validate files
    const videoFile = files.video;
    const thumbnailFile = files.thumbnail;

    if (!videoFile) return apiError('Video file is required', 400);
    if (!thumbnailFile) return apiError('Thumbnail image is required', 400);

    const videoError = validateFile(videoFile, VIDEO_TYPES, MAX_VIDEO_SIZE_MB);
    if (videoError) return apiError(videoError, 400);

    const imageError = validateFile(thumbnailFile, IMAGE_TYPES, MAX_IMAGE_SIZE_MB);
    if (imageError) return apiError(imageError, 400);

    // Validate fields
    const validatedData = createPortfolioSchema.parse(fields);

    // Upload files to R2
    const [videoBuffer, thumbnailBuffer] = await Promise.all([
      fileToBuffer(videoFile),
      fileToBuffer(thumbnailFile),
    ]);

    const [videoUpload, thumbnailUpload] = await Promise.all([
      uploadToR2(videoBuffer, videoFile.name, videoFile.type, 'portfolio'),
      uploadToR2(thumbnailBuffer, thumbnailFile.name, thumbnailFile.type, 'thumbnails'),
    ]);

    // Get the next order number
    const maxOrder = await Portfolio.findOne().sort({ order: -1 }).select('order').lean();
    const nextOrder = (maxOrder?.order ?? -1) + 1;

    // Create portfolio item
    const portfolio = await Portfolio.create({
      ...validatedData,
      videoUrl: videoUpload.url,
      videoKey: videoUpload.key,
      thumbnailUrl: thumbnailUpload.url,
      thumbnailKey: thumbnailUpload.key,
      order: nextOrder,
    });

    return apiSuccess(portfolio, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
