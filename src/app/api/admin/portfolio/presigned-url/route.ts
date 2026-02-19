import { getAdminFromCookies } from '@/lib/auth';
import { getPresignedUploadUrl } from '@/lib/r2';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const presignedUrlSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.enum(['portfolio', 'showreel', 'thumbnails', 'resumes', 'about-video', 'team', 'reels']),
});

/**
 * POST /api/admin/portfolio/presigned-url
 * Generate a presigned URL for direct client-side upload to R2
 * This bypasses Vercel's body size limits and function timeouts
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    const body = await request.json();
    const { fileName, contentType, folder } = presignedUrlSchema.parse(body);

    const { uploadUrl, key, publicUrl } = await getPresignedUploadUrl(
      fileName,
      contentType,
      folder
    );

    return apiSuccess({ uploadUrl, key, publicUrl });
  } catch (error) {
    return handleApiError(error);
  }
}
