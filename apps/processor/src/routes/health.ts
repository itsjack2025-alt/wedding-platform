import { Router } from 'express';
export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'wedding-processor',
    timestamp: new Date().toISOString(),
  });
});
