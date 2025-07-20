import { type Application } from 'express';
import { AuthMiddleware } from '../middlewares/auth.ts';
import { SpotifyController } from '../controllers/spotify.ts';
import { RateLimitRoute } from '../loaders/rate-limit/routes.ts';
import { SpotifySSEMiddleware } from '../middlewares/spotify-sse.ts';

export default (app: Application): void => {
  app.use(
    '/sse',
    RateLimitRoute.spotifyCurrentlyPlayingSSE,
    SpotifySSEMiddleware.isConnectionAuthorized,
    AuthMiddleware.isAuthorizedFromQuery,
    SpotifyController.getCurrentlyPlayingSSE
  );
};
