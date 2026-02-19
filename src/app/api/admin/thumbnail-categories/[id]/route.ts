import connectDB from '@/lib/db';
import ThumbnailCategory from '@/models/ThumbnailCategory';
import { getAdminFromCookies } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';
import { updateThumbnailCategorySchema } from '@/lib/validations';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/thumbnail-categories/[id]
 * Admin endpoint - update a thumbnail category.
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
    const validatedData = updateThumbnailCategorySchema.parse(body);

    const updateData: Record<string, unknown> = {};

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
      const slug = validatedData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      updateData.slug = slug;

      // Check for duplicate name (excluding current)
      const existing = await ThumbnailCategory.findOne({
        _id: { $ne: new mongoose.Types.ObjectId(params.id) },
        $or: [{ name: validatedData.name }, { slug }],
      });
      if (existing) {
        return apiError('A thumbnail category with this name already exists', 409);
      }
    }

    if (validatedData.isActive !== undefined) {
      updateData.isActive = validatedData.isActive;
    }

    if (validatedData.order !== undefined) {
      updateData.order = validatedData.order;
    }

    const category = await ThumbnailCategory.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!category) return apiError('Thumbnail category not found', 404);

    return apiSuccess(category);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/thumbnail-categories/[id]
 * Admin endpoint - delete a thumbnail category.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const category = await ThumbnailCategory.findByIdAndDelete(params.id);
    if (!category) return apiError('Thumbnail category not found', 404);

    return apiSuccess({ message: 'Thumbnail category deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
