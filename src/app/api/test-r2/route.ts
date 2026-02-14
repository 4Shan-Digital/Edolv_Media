import { NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

/**
 * Test R2 credentials and connectivity
 * Visit /api/test-r2 to verify your R2 setup
 * 
 * ⚠️ DELETE THIS FILE after testing in production!
 */
export async function GET() {
  try {
    const hasAccountId = !!process.env.R2_ACCOUNT_ID;
    const hasAccessKey = !!process.env.R2_ACCESS_KEY_ID;
    const hasSecretKey = !!process.env.R2_SECRET_ACCESS_KEY;
    const hasBucketName = !!process.env.R2_BUCKET_NAME;
    const hasPublicUrl = !!process.env.R2_PUBLIC_URL;

    if (!hasAccountId || !hasAccessKey || !hasSecretKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing R2 credentials in environment variables',
        credentials: {
          R2_ACCOUNT_ID: hasAccountId,
          R2_ACCESS_KEY_ID: hasAccessKey,
          R2_SECRET_ACCESS_KEY: hasSecretKey,
          R2_BUCKET_NAME: hasBucketName,
          R2_PUBLIC_URL: hasPublicUrl,
        }
      }, { status: 500 });
    }

    const endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

    const client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    // Try two tests: list buckets (broad permission) and list objects (bucket-specific)
    let listBucketsResult = null;
    let listBucketsError = null;
    
    try {
      const result = await client.send(new ListBucketsCommand({}));
      listBucketsResult = {
        buckets: result.Buckets?.map(b => b.Name) || [],
        bucketExists: result.Buckets?.some(b => b.Name === process.env.R2_BUCKET_NAME),
      };
    } catch (error: unknown) {
      listBucketsError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Try a simple test upload to verify bucket access
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    let uploadTestResult = null;
    let uploadTestError = null;
    
    try {
      const testKey = '_test_connection.txt';
      await client.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: testKey,
        Body: Buffer.from('Connection test from Edolv Media'),
        ContentType: 'text/plain',
      }));
      
      // Clean up test file
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      await client.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: testKey,
      }));
      
      uploadTestResult = 'Upload and delete test successful';
    } catch (error: unknown) {
      uploadTestError = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json({
      success: !uploadTestError,
      message: uploadTestError ? 'Bucket access test failed' : 'R2 connection successful!',
      endpoint,
      expectedBucket: process.env.R2_BUCKET_NAME,
      publicUrl: process.env.R2_PUBLIC_URL,
      tests: {
        listBuckets: {
          success: !listBucketsError,
          error: listBucketsError,
          result: listBucketsResult,
        },
        uploadTest: {
          success: !uploadTestError,
          error: uploadTestError,
          result: uploadTestResult,
        }
      },
      credentials: {
        R2_ACCOUNT_ID: hasAccountId,
        R2_ACCESS_KEY_ID: hasAccessKey,
        R2_SECRET_ACCESS_KEY: hasSecretKey,
        R2_BUCKET_NAME: hasBucketName,
        R2_PUBLIC_URL: hasPublicUrl,
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      credentials: {
        R2_ACCOUNT_ID: !!process.env.R2_ACCOUNT_ID,
        R2_ACCESS_KEY_ID: !!process.env.R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY: !!process.env.R2_SECRET_ACCESS_KEY,
        R2_BUCKET_NAME: !!process.env.R2_BUCKET_NAME,
        R2_PUBLIC_URL: !!process.env.R2_PUBLIC_URL,
      }
    }, { status: 500 });
  }
}
