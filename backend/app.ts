import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { appConfig } from './config/app.config';
import { loggingMiddleware } from './middleware/logging.middleware';
import { errorMiddleware } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import merchantRoutes from './routes/merchant.routes';
import disputeRoutes from './routes/dispute.routes';
import notificationRoutes from './routes/notification.routes';
import evidenceRoutes from './routes/evidence.routes';
import adminRoutes from './routes/admin.routes';

import { initScheduler } from './jobs/scheduler';

const app: Express = express();

// ── Security & Parsing Middleware ─────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: appConfig.corsOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request Logging ───────────────────────────────────────────────────────────
app.use(loggingMiddleware);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'DisputeX API is running',
    env: appConfig.env,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/admin', adminRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: 'Route not found.' });
});

// ── Global Error Handler (MUST be last) ──────────────────────────────────────
app.use(errorMiddleware);

// ── Background Jobs ───────────────────────────────────────────────────────────
initScheduler();

export default app;
