import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { getAdminFromCookies } from '@/lib/auth';
import { createCategorySchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/categories
 * Admin endpoint - fetch all categories.
 */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const categories = await Category.find()
      .sort({ order: 1, name: 1 })
      .lean();

    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/categories
 * Admin endpoint - create a new category.
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const body = await request.json();
    const { name } = createCategorySchema.parse(body);

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check for duplicate
    const existing = await Category.findOne({
      $or: [{ name }, { slug }],
    });
    if (existing) {
      return apiError('A category with this name already exists', 409);
    }

    // Get next order
    const maxOrder = await Category.findOne().sort({ order: -1 }).select('order').lean();
    const nextOrder = (maxOrder?.order ?? -1) + 1;

    const category = await Category.create({
      name,
      slug,
      order: nextOrder,
      isActive: true,
    });

    return apiSuccess(category, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
