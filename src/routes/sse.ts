import { type Application } from 'express';
import { AuthMiddleware } from '../middlewares/auth.ts';
import { SSEController } from '../controllers/sse.ts';
import { RateLimitRoute } from '../loaders/rate-limit/routes.ts';
import { SSEMiddleware } from '../middlewares/sse.ts';

export default (app: Application): void => {
  app.use(
    '/sse',
    RateLimitRoute.sse,
    SSEMiddleware.isConnectionAuthorized,
    AuthMiddleware.isAuthorizedFromQuery,
    SSEController.getCurrentlyPlayingSSE
  );
};
