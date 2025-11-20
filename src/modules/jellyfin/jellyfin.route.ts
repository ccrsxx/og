import { Router, type Application } from 'express';
import { AuthMiddleware } from '../auth/auth.middleware.ts';
import { JellyfinController } from './jellyfin.controller.ts';

export default (app: Application): void => {
  const router = Router();

  app.use('/jellyfin', router);

  router.get(
    '/currently-playing',
    AuthMiddleware.isAuthorized,
    JellyfinController.getCurrentlyPlaying
  );
};
