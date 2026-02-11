import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standard API response wrapper for success.
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Standard API response wrapper for errors.
 */
export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * Handle Zod validation errors.
 */
export function handleValidationError(error: ZodError) {
  const messages = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
  return apiError(messages.join(', '), 400);
}

/**
 * Generic error handler for API routes.
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return handleValidationError(error);
  }

  if (error instanceof Error) {
    return apiError(error.message, 500);
  }

  return apiError('Internal server error', 500);
}

/**
 * Parse multipart form data from a Request.
 * Returns the fields and files separately.
 */
export async function parseFormData(request: Request) {
  const formData = await request.formData();
  const fields: Record<string, string> = {};
  const files: Record<string, File> = {};

  formData.forEach((value, key) => {
    if (value instanceof File) {
      files[key] = value;
    } else {
      fields[key] = value;
    }
  });

  return { fields, files };
}

/**
 * Convert a File object to a Buffer for upload.
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Validate file type and size.
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeMB: number
): string | null {
  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}`;
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: ${maxSizeMB}MB`;
  }

  return null;
}

export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
export const RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const MAX_VIDEO_SIZE_MB = 500;
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_RESUME_SIZE_MB = 10;
