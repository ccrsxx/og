import { Router, type Application } from 'express';
import { AuthMiddleware } from '../auth/auth.middleware.ts';
import { SpotifyController } from './spotify.controller.ts';

export default (app: Application): void => {
  const router = Router();

  app.use('/spotify', router);

  router.get(
    '/currently-playing',
    AuthMiddleware.isAuthorized,
    SpotifyController.getCurrentlyPlaying
  );
};
