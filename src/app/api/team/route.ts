import connectDB from '@/lib/db';
import TeamMember from '@/models/TeamMember';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';
import { signMediaUrls } from '@/lib/r2';

export const dynamic = 'force-dynamic';

/**
 * GET /api/team
 * Public endpoint - fetch all active team members.
 */
export async function GET() {
  try {
    await connectDB();

    const teamMembers = await TeamMember.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-__v')
      .lean();

    const signed = await Promise.all(
      teamMembers.map(member => signMediaUrls(JSON.parse(JSON.stringify(member))))
    );
    
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}
