import connectDB from '@/lib/db';
import Portfolio from '@/models/Portfolio';
import Showreel from '@/models/Showreel';
import Job from '@/models/Job';
import Application from '@/models/Application';
import Contact from '@/models/Contact';
import { getAdminFromCookies } from '@/lib/auth';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/dashboard
 * Admin endpoint - fetch dashboard stats.
 */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const [
      totalPortfolios,
      activePortfolios,
      totalShowreels,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      totalContacts,
      unreadContacts,
    ] = await Promise.all([
      Portfolio.countDocuments(),
      Portfolio.countDocuments({ isActive: true }),
      Showreel.countDocuments(),
      Job.countDocuments(),
      Job.countDocuments({ isActive: true }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
    ]);

    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('jobId', 'title')
      .lean();

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return apiSuccess({
      stats: {
        portfolio: { total: totalPortfolios, active: activePortfolios },
        showreels: { total: totalShowreels },
        jobs: { total: totalJobs, active: activeJobs },
        applications: { total: totalApplications, pending: pendingApplications },
        contacts: { total: totalContacts, unread: unreadContacts },
      },
      recentApplications,
      recentContacts,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
