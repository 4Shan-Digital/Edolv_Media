import { getAdminFromCookies } from '@/lib/auth';
import { getPresignedUploadUrl, type UploadFolder } from '@/lib/r2';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

/**
 * POST /api/admin/upload/presign
 * Generate a presigned URL for direct upload to R2.
 * This allows large file uploads to bypass the Next.js server.
 *
 * Body: { fileName: string, contentType: string, folder: UploadFolder }
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    const body = await request.json();
    const { fileName, contentType, folder } = body;

    if (!fileName || !contentType || !folder) {
      return apiError('fileName, contentType, and folder are required', 400);
    }

    const validFolders: UploadFolder[] = ['portfolio', 'showreel', 'thumbnails', 'resumes'];
    if (!validFolders.includes(folder)) {
      return apiError('Invalid folder. Must be: portfolio, showreel, thumbnails, or resumes', 400);
    }

    const allAllowedTypes = [...ALLOWED_VIDEO_TYPES, ...ALLOWED_IMAGE_TYPES, ...ALLOWED_RESUME_TYPES];
    if (!allAllowedTypes.includes(contentType)) {
      return apiError(`Invalid content type: ${contentType}`, 400);
    }

    const result = await getPresignedUploadUrl(fileName, contentType, folder);

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
