import connectDB from '@/lib/db';
import ThumbnailCategory from '@/models/ThumbnailCategory';
import { getAdminFromCookies } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';
import { createThumbnailCategorySchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/thumbnail-categories
 * Admin endpoint - fetch all thumbnail categories.
 */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const categories = await ThumbnailCategory.find()
      .sort({ order: 1, name: 1 })
      .lean();

    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/thumbnail-categories
 * Admin endpoint - create a new thumbnail category.
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const body = await request.json();
    const validatedData = createThumbnailCategorySchema.parse(body);

    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check for duplicate name
    const existing = await ThumbnailCategory.findOne({
      $or: [{ name: validatedData.name }, { slug }],
    });
    if (existing) {
      return apiError('A thumbnail category with this name already exists', 409);
    }

    const maxOrder = await ThumbnailCategory.findOne().sort({ order: -1 }).select('order').lean();
    const order = maxOrder ? maxOrder.order + 1 : 0;

    const category = await ThumbnailCategory.create({
      name: validatedData.name,
      slug,
      order,
    });

    return apiSuccess(category, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
