import { Router, type Application } from 'express';
import { SpotifyController } from '../controllers/spotify.ts';

export default (app: Application): void => {
  const router = Router();

  app.use('/spotify', router);

  router.get('/currently-playing', SpotifyController.getCurrentlyPlaying);
};
