import { Router } from 'express';
export const videoRouter = Router();
// POST /processor/video/thumbnail — Extract thumbnail from video
videoRouter.post('/thumbnail', async (req, res) => {
    try {
        const { s3KeyOriginal, mediaId, timestamp } = req.body;
        if (!s3KeyOriginal) {
            res.status(400).json({ error: 's3KeyOriginal is required' });
            return;
        }
        // In production, use ffmpeg to extract frame at timestamp
        // For now, return placeholder
        res.json({
            mediaId,
            thumbnailKey: `thumbnails/${mediaId}.jpg`,
            timestamp: timestamp ?? 1,
            status: 'generated',
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Thumbnail generation failed' });
    }
});
// POST /processor/video/transcode — Transcode video to HLS
videoRouter.post('/transcode', async (req, res) => {
    try {
        const { s3KeyOriginal, mediaId, resolutions } = req.body;
        if (!s3KeyOriginal) {
            res.status(400).json({ error: 's3KeyOriginal is required' });
            return;
        }
        const defaultResolutions = [
            { width: 1280, height: 720, bitrate: 2500000 },
            { width: 1920, height: 1080, bitrate: 5000000 },
        ];
        res.json({
            mediaId,
            hlsKey: `hls/${mediaId}/master.m3u8`,
            resolutions: resolutions ?? defaultResolutions,
            status: 'queued',
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Transcoding failed' });
    }
});
