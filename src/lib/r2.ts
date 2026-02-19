import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

/**
 * Cloudflare R2 client (S3-compatible).
 * Reuse a single instance across the application.
 */
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export type UploadFolder = 'portfolio' | 'showreel' | 'thumbnails' | 'resumes' | 'about-video' | 'team' | 'reels';

/**
 * Upload a file to R2.
 * Returns the public URL and the storage key.
 */
export async function uploadToR2(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: UploadFolder
): Promise<{ url: string; key: string }> {
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `${folder}/${timestamp}-${sanitizedName}`;

  const params: PutObjectCommandInput = {
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    // Cache video files for 1 year, thumbnails for 1 month
    CacheControl: contentType.startsWith('video/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=2592000',
  };

  await r2Client.send(new PutObjectCommand(params));

  const url = `${R2_PUBLIC_URL}/${key}`;
  return { url, key };
}

/**
 * Delete a file from R2 by its key.
 */
export async function deleteFromR2(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );
}

/**
 * Generate a presigned URL for direct upload from the client.
 * This enables large file uploads without going through the Next.js server.
 */
export async function getPresignedUploadUrl(
  fileName: string,
  contentType: string,
  folder: UploadFolder
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `${folder}/${timestamp}-${sanitizedName}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    CacheControl: contentType.startsWith('video/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=2592000',
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
  const publicUrl = `${R2_PUBLIC_URL}/${key}`;

  return { uploadUrl, key, publicUrl };
}

/**
 * Generate a presigned URL for reading a private object (if needed).
 */
export async function getPresignedReadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn: 3600 });
}

/**
 * Extract the R2 key from a stored URL.
 * Stored URLs look like: https://xxx.r2.cloudflarestorage.com/folder/timestamp-filename.ext
 */
function extractKeyFromUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // Remove leading slash from pathname
    return parsed.pathname.replace(/^\//, '');
  } catch {
    return null;
  }
}

/**
 * Check if a URL points to the R2 S3 endpoint (needs signing) vs a public URL.
 */
function isR2PrivateUrl(url: string): boolean {
  return url.includes('.r2.cloudflarestorage.com');
}

/**
 * Sign media URLs on a document (or array of documents).
 * Replaces thumbnailUrl, videoUrl, imageUrl, and resumeUrl with presigned read URLs
 * so that browsers can access files from private R2 buckets.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signMediaUrls(docs: any): Promise<any> {
  if (!docs) return docs;
  const isArray = Array.isArray(docs);
  const items = isArray ? docs : [docs];

  const signed = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items.map(async (doc: any) => {
      const result = { ...doc };

      // Sign thumbnailUrl
      if (typeof result.thumbnailUrl === 'string' && isR2PrivateUrl(result.thumbnailUrl)) {
        const key = result.thumbnailKey || extractKeyFromUrl(result.thumbnailUrl);
        if (key) {
          result.thumbnailUrl = await getPresignedReadUrl(key);
        }
      }

      // Sign videoUrl
      if (typeof result.videoUrl === 'string' && isR2PrivateUrl(result.videoUrl)) {
        const key = result.videoKey || extractKeyFromUrl(result.videoUrl);
        if (key) {
          result.videoUrl = await getPresignedReadUrl(key);
        }
      }

      // Sign imageUrl (for team members and other images)
      if (typeof result.imageUrl === 'string' && isR2PrivateUrl(result.imageUrl)) {
        const key = result.imageKey || extractKeyFromUrl(result.imageUrl);
        if (key) {
          result.imageUrl = await getPresignedReadUrl(key);
        }
      }

      // Sign resumeUrl
      if (typeof result.resumeUrl === 'string' && isR2PrivateUrl(result.resumeUrl)) {
        const key = result.resumeKey || extractKeyFromUrl(result.resumeUrl);
        if (key) {
          result.resumeUrl = await getPresignedReadUrl(key);
        }
      }

      return result;
    })
  );

  return isArray ? signed : signed[0];
}

export { r2Client, R2_BUCKET_NAME };
