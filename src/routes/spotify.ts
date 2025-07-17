import { Router, type Application } from 'express';
import { AuthMiddleware } from '../middlewares/auth.ts';
import { SpotifyController } from '../controllers/spotify.ts';

export default (app: Application): void => {
  const router = Router();

  app.use('/spotify', router);

  router.get(
    '/currently-playing',
    AuthMiddleware.isAuthorized,
    SpotifyController.getCurrentlyPlaying
  );

  router.get(
    '/currently-playing/sse',
    AuthMiddleware.isAuthorizedFromQuery,
    SpotifyController.getCurrentlyPlayingSSE
  );
};
