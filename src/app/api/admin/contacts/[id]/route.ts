import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { getAdminFromCookies } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/contacts/[id]
 * Admin endpoint - mark contact as read/unread.
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
    const { isRead } = body;

    if (typeof isRead !== 'boolean') {
      return apiError('isRead must be a boolean', 400);
    }

    const contact = await Contact.findByIdAndUpdate(
      params.id,
      { $set: { isRead } },
      { new: true }
    ).lean();

    if (!contact) return apiError('Contact not found', 404);

    return apiSuccess(contact);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/contacts/[id]
 * Admin endpoint - delete a contact submission.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const contact = await Contact.findByIdAndDelete(params.id);
    if (!contact) return apiError('Contact not found', 404);

    return apiSuccess({ message: 'Contact deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
