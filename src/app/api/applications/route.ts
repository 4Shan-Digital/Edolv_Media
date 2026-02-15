import connectDB from '@/lib/db';
import Job from '@/models/Job';
import Application from '@/models/Application';
import { createApplicationSchema } from '@/lib/validations';
import { sendApplicationAcknowledgment, sendApplicationNotificationToAdmin } from '@/lib/email';
import {
  apiSuccess,
  apiError,
  handleApiError,
  parseFormData,
  fileToBuffer,
  validateFile,
  RESUME_TYPES,
  MAX_RESUME_SIZE_MB,
} from '@/lib/api-helpers';
import { uploadToR2 } from '@/lib/r2';

export const dynamic = 'force-dynamic';

/**
 * POST /api/applications
 * Public endpoint - submit a job application.
 * Expects multipart/form-data with resume file.
 */
export async function POST(request: Request) {
  try {
    await connectDB();

    const { fields, files } = await parseFormData(request);

    // Validate resume file
    const resumeFile = files.resume;
    if (!resumeFile) {
      return apiError('Resume file is required', 400);
    }

    const fileError = validateFile(resumeFile, RESUME_TYPES, MAX_RESUME_SIZE_MB);
    if (fileError) {
      return apiError(fileError, 400);
    }

    // Upload resume to R2
    const resumeBuffer = await fileToBuffer(resumeFile);
    const { url: resumeUrl, key: resumeKey } = await uploadToR2(
      resumeBuffer,
      resumeFile.name,
      resumeFile.type,
      'resumes'
    );

    // Validate fields
    const validatedData = createApplicationSchema.parse({
      ...fields,
      resumeUrl,
    });

    // Verify job exists and is active
    const job = await Job.findOne({ _id: validatedData.jobId, isActive: true });
    if (!job) {
      return apiError('Job not found or no longer accepting applications', 404);
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      jobId: validatedData.jobId,
      email: validatedData.email,
    });
    if (existingApplication) {
      return apiError('You have already applied for this position', 409);
    }

    // Create application
    const application = await Application.create({
      ...validatedData,
      resumeKey,
    });

    // Send emails (non-blocking, fire-and-forget)
    console.log('📧 Attempting to send application emails...');
    console.log('📧 Admin email:', process.env.ADMIN_NOTIFICATION_EMAIL);
    console.log('📧 From email:', process.env.EMAIL_FROM);
    console.log('📧 Resend API key present:', !!process.env.RESEND_API_KEY);
    
    // Check if required env vars are present
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not set!');
    }
    if (!process.env.ADMIN_NOTIFICATION_EMAIL) {
      console.error('❌ ADMIN_NOTIFICATION_EMAIL is not set!');
    }
    if (!process.env.EMAIL_FROM) {
      console.error('❌ EMAIL_FROM is not set!');
    }
    
    Promise.allSettled([
      sendApplicationAcknowledgment(
        validatedData.name,
        validatedData.email,
        job.title
      ),
      sendApplicationNotificationToAdmin({
        applicantName: validatedData.name,
        applicantEmail: validatedData.email,
        applicantPhone: validatedData.phone,
        jobTitle: job.title,
        jobDepartment: job.department,
        coverLetter: validatedData.coverLetter,
        resumeUrl,
        portfolioUrl: validatedData.portfolioUrl,
      }),
    ]).then((results) => {
      results.forEach((result, index) => {
        const emailType = index === 0 ? 'Applicant acknowledgment' : 'Admin notification';
        if (result.status === 'rejected') {
          console.error(`❌ ${emailType} email failed:`, result.reason);
        } else {
          console.log(`✅ ${emailType} email sent successfully`);
        }
      });
    }).catch((error) => {
      console.error('❌ Unexpected error sending application emails:', error);
    });

    return apiSuccess(
      { id: application._id, message: 'Application submitted successfully' },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
