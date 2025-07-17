import { Router, type Application } from 'express';
import { SpotifyController } from '../controllers/spotify.ts';
import { AuthMiddleware } from '../middlewares/auth.ts';

export default (app: Application): void => {
  const router = Router();

  app.use('/spotify', router);

  router.get(
    '/currently-playing',
    AuthMiddleware.isAuthorized,
    SpotifyController.getCurrentlyPlaying
  );

  router.get(
    '/currently-playing/stream',
    AuthMiddleware.isAuthorized,
    SpotifyController.getCurrentlyPlayingStream
  );
};
