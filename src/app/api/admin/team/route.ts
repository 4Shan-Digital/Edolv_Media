import connectDB from '@/lib/db';
import TeamMember from '@/models/TeamMember';
import { getAdminFromCookies } from '@/lib/auth';
import { uploadToR2, signMediaUrls } from '@/lib/r2';
import {
  apiSuccess,
  apiError,
  handleApiError,
  parseFormData,
  fileToBuffer,
  validateFile,
  IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
} from '@/lib/api-helpers';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createTeamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  bio: z.string().min(1, 'Bio is required').max(500),
  order: z.coerce.number().int().min(0).default(0),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
});

/**
 * GET /api/admin/team
 * Admin endpoint - fetch all team members.
 */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const teamMembers = await TeamMember.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    const signed = await signMediaUrls(JSON.parse(JSON.stringify(teamMembers)));
    return apiSuccess(signed);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/team
 * Admin endpoint - create a new team member.
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const { fields, files } = await parseFormData(request);

    // Validate image file
    const imageFile = files.image;
    if (!imageFile) return apiError('Image file is required', 400);

    const imageError = validateFile(imageFile, IMAGE_TYPES, MAX_IMAGE_SIZE_MB);
    if (imageError) return apiError(imageError, 400);

    // Validate fields
    const validatedData = createTeamMemberSchema.parse(fields);

    // Upload image to R2
    const imageBuffer = await fileToBuffer(imageFile);
    const imageUpload = await uploadToR2(
      imageBuffer,
      imageFile.name,
      imageFile.type,
      'team'
    );

    // Create team member
    const teamMember = await TeamMember.create({
      name: validatedData.name,
      role: validatedData.role,
      bio: validatedData.bio,
      imageUrl: imageUpload.url,
      order: validatedData.order,
      social: {
        linkedin: validatedData.linkedin || undefined,
        twitter: validatedData.twitter || undefined,
        instagram: validatedData.instagram || undefined,
      },
      isActive: true,
    });

    return apiSuccess(teamMember, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/admin/team
 * Admin endpoint - update a team member.
 */
export async function PUT(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return apiError('Team member ID is required', 400);

    const { fields, files } = await parseFormData(request);

    // Validate fields
    const validatedData = createTeamMemberSchema.parse(fields);

    const updateData: Partial<{
      name: string;
      role: string;
      bio: string;
      imageUrl: string;
      order: number;
      social: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
      };
    }> = {
      name: validatedData.name,
      role: validatedData.role,
      bio: validatedData.bio,
      order: validatedData.order,
      social: {
        linkedin: validatedData.linkedin || undefined,
        twitter: validatedData.twitter || undefined,
        instagram: validatedData.instagram || undefined,
      },
    };

    // If new image provided, upload it
    const imageFile = files.image;
    if (imageFile) {
      const imageError = validateFile(imageFile, IMAGE_TYPES, MAX_IMAGE_SIZE_MB);
      if (imageError) return apiError(imageError, 400);

      const imageBuffer = await fileToBuffer(imageFile);
      const imageUpload = await uploadToR2(
        imageBuffer,
        imageFile.name,
        imageFile.type,
        'team'
      );
      updateData.imageUrl = imageUpload.url;
    }

    const teamMember = await TeamMember.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!teamMember) return apiError('Team member not found', 404);

    return apiSuccess(teamMember);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/team
 * Admin endpoint - delete a team member.
 */
export async function DELETE(request: Request) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return apiError('Unauthorized', 401);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return apiError('Team member ID is required', 400);

    const teamMember = await TeamMember.findByIdAndDelete(id);
    if (!teamMember) return apiError('Team member not found', 404);

    return apiSuccess({ message: 'Team member deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
