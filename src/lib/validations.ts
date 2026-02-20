import { z } from 'zod';

// ============================================
// Portfolio
// ============================================

export const createPortfolioSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  category: z.string().min(1, 'Category is required').max(100),
  description: z.string().min(1, 'Description is required').max(2000),
  client: z.string().min(1, 'Client name is required').max(200),
  duration: z.string().min(1, 'Duration is required').regex(/^\d{1,2}:\d{2}$/, 'Duration must be in M:SS or MM:SS format'),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number'),
  // File URLs and keys (for presigned upload method)
  videoUrl: z.string().url().optional(),
  videoKey: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  thumbnailKey: z.string().optional(),
});

export const updatePortfolioSchema = createPortfolioSchema.partial();

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;

// ============================================
// Jobs
// ============================================

export const jobDepartments = [
  'Production',
  'Creative',
  'Post-Production',
  'Operations',
] as const;

export const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
] as const;

export const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  department: z.enum(jobDepartments, { message: 'Invalid department' }),
  location: z.string().min(1, 'Location is required').max(200),
  type: z.enum(jobTypes, { message: 'Invalid job type' }),
  description: z.string().min(1, 'Description is required').max(5000),
  requirements: z.array(z.string().min(1)).min(1, 'At least one requirement is needed'),
  responsibilities: z.array(z.string().min(1)).min(1, 'At least one responsibility is needed'),
  isActive: z.boolean().default(true),
  isUrgent: z.boolean().default(false).optional(),
  priority: z.number().int().min(0).max(100).default(0).optional(),
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;

// ============================================
// Job Applications
// ============================================

export const applicationStatuses = [
  'pending',
  'reviewing',
  'shortlisted',
  'interview',
  'rejected',
  'hired',
] as const;

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required').max(20),
  coverLetter: z.string().max(5000).optional(),
  resumeUrl: z.string().url('Invalid resume URL'),
  portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(applicationStatuses, { message: 'Invalid status' }),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;

// ============================================
// Contact
// ============================================

export const contactServices = [
  'Video Editing',
  'Motion Graphics',
  'Color Grading',
  'Sound Design',
  'VFX',
  'Social Media Content',
  'Corporate Videos',
  'YouTube Production',
  'Other',
] as const;

export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional().or(z.literal('')),
  service: z.enum(contactServices, { message: 'Invalid service' }),
  message: z.string().min(1, 'Message is required').max(5000),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;

// ============================================
// Showreel
// ============================================

export const createShowreelSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  duration: z.string().regex(/^\d{1,2}:\d{2}$/, 'Duration must be in M:SS or MM:SS format'),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number'),
});

export const updateShowreelSchema = createShowreelSchema.partial();

export type CreateShowreelInput = z.infer<typeof createShowreelSchema>;
export type UpdateShowreelInput = z.infer<typeof updateShowreelSchema>;

// ============================================
// Admin Auth
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// Categories
// ============================================

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100).optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

// ============================================
// Thumbnail Categories
// ============================================

export const createThumbnailCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
});

export const updateThumbnailCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100).optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export type CreateThumbnailCategoryInput = z.infer<typeof createThumbnailCategorySchema>;
export type UpdateThumbnailCategoryInput = z.infer<typeof updateThumbnailCategorySchema>;

// ============================================
// Thumbnails
// ============================================

export const createThumbnailSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  category: z.string().min(1, 'Category is required').max(100),
  imageUrl: z.string().url().optional(),
  imageKey: z.string().optional(),
});

export const updateThumbnailSchema = createThumbnailSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateThumbnailInput = z.infer<typeof createThumbnailSchema>;
export type UpdateThumbnailInput = z.infer<typeof updateThumbnailSchema>;

// ============================================
// Reels
// ============================================

export const createReelSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  videoUrl: z.string().url().optional(),
  videoKey: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  thumbnailKey: z.string().optional(),
});

export const updateReelSchema = createReelSchema.partial().extend({
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export type CreateReelInput = z.infer<typeof createReelSchema>;
export type UpdateReelInput = z.infer<typeof updateReelSchema>;
