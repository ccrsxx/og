import { Router, type Application } from 'express';
import { AuthMiddleware } from '../middlewares/auth.ts';
import { SpotifyController } from '../controllers/spotify.ts';
import { RateLimitRoute } from '../loaders/rate-limit/routes.ts';
import { SpotifyMiddleware } from '../middlewares/spotify.ts';

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
    RateLimitRoute.spotifyCurrentlyPlayingSSE,
    SpotifyMiddleware.isConnectionAuthorized,
    AuthMiddleware.isAuthorizedFromQuery,
    SpotifyController.getCurrentlyPlayingSSE
  );
};
