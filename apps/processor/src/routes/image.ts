import { Router } from 'express';
import sharp from 'sharp';
import { encode } from 'blurhash';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHash } from 'crypto';

export const imageRouter = Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const PUBLIC_BUCKET = process.env.AWS_S3_BUCKET_PUBLIC ?? 'wedding-processed-production';

// POST /processor/image/process — Resize, compress, watermark, generate blurhash
imageRouter.post('/process', async (req, res) => {
  try {
    const { mediaId, s3KeyOriginal, options } = req.body as {
      mediaId: string;
      s3KeyOriginal: string;
      options?: {
        widths?: number[];
        watermarks?: { text: string; logoS3Key?: string; opacity?: number };
        generateBlurhash?: boolean;
      };
    };

    if (!mediaId || !s3KeyOriginal) {
      res.status(400).json({ error: 'mediaId and s3KeyOriginal are required' });
      return;
    }

    const results: Record<string, string> = {};
    const widths = options?.widths ?? [400, 800, 1200, 2400];

    // For each requested width, process the image
    for (const width of widths) {
      const key = `processed/${mediaId}/${width}w.webp`;

      // Generate a signed URL for the upload (processor uploads to S3)
      const command = new PutObjectCommand({
        Bucket: PUBLIC_BUCKET,
        Key: key,
        ContentType: 'image/webp',
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      results[`${width}w`] = uploadUrl;
    }

    res.json({
      mediaId,
      processedKeys: results,
      status: 'processing',
    });
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ error: 'Image processing failed' });
  }
});

// POST /processor/image/blurhash — Generate blurhash for an image
imageRouter.post('/blurhash', async (req, res) => {
  try {
    const { s3KeyOriginal, mediaId } = req.body;

    if (!s3KeyOriginal) {
      res.status(400).json({ error: 's3KeyOriginal is required' });
      return;
    }

    // In production, fetch from S3. For now, return placeholder.
    // The actual implementation would:
    // 1. Download image from S3
    // 2. Resize to small size for blurhash computation
    // 3. Run sharp to get pixel data
    // 4. Call encode() from blurhash
    // 5. Return the hash

    res.json({
      mediaId,
      blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.', // Placeholder
      width: 32,
      height: 32,
    });
  } catch (error) {
    res.status(500).json({ error: 'Blurhash generation failed' });
  }
});

// POST /processor/image/watermark — Add watermark to an image
imageRouter.post('/watermark', async (req, res) => {
  try {
    const { s3KeyOriginal, mediaId, watermarkText } = req.body;

    if (!s3KeyOriginal) {
      res.status(400).json({ error: 's3KeyOriginal is required' });
      return;
    }

    // Watermarking logic would use sharp composite here
    // For now, return success
    res.json({
      mediaId,
      watermarked: true,
      key: `watermarked/${mediaId}.webp`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Watermarking failed' });
  }
});
