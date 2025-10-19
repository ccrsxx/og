import { type Application } from 'express';
import { AuthMiddleware } from '../auth/auth.middleware.ts';
import { RateLimitRoute } from '../../core/loaders/rate-limit/routes.ts';
import { SSEController } from './sse.controller.ts';
import { SSEMiddleware } from './sse.middleware.ts';

export default (app: Application): void => {
  app.use(
    '/sse',
    RateLimitRoute.sse,
    SSEMiddleware.isConnectionAuthorized,
    AuthMiddleware.isAuthorizedFromQuery,
    SSEController.getCurrentlyPlayingSSE
  );
};
