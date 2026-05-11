import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { imageRouter } from './routes/image.js';
import { videoRouter } from './routes/video.js';
import { aiRouter } from './routes/ai.js';
import { healthRouter } from './routes/health.js';
const app = express();
const PORT = process.env.PORT ?? 3001;
// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3000',
    credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
// Routes
app.use('/health', healthRouter);
app.use('/processor/image', imageRouter);
app.use('/processor/video', videoRouter);
app.use('/processor/ai', aiRouter);
// Error handler
app.use((err, req, res, next) => {
    console.error('Processor error:', err);
    res.status(500).json({ error: err.message ?? 'Internal server error' });
});
app.listen(PORT, () => {
    console.log(`Processor service running on port ${PORT}`);
});
export default app;
