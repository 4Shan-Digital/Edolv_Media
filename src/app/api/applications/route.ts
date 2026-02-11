import connectDB from '@/lib/db';
import Job from '@/models/Job';
import Application from '@/models/Application';
import { createApplicationSchema } from '@/lib/validations';
import { sendApplicationAcknowledgment } from '@/lib/email';
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

    // Send acknowledgment email (non-blocking)
    sendApplicationAcknowledgment(
      validatedData.name,
      validatedData.email,
      job.title
    ).catch((err) => console.error('Failed to send application email:', err));

    return apiSuccess(
      { id: application._id, message: 'Application submitted successfully' },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
