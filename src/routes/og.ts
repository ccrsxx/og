import { Router, type Application } from 'express';
import { OgController } from '../controllers/og.ts';
import { RateLimitRoute } from '../loaders/rate-limit/routes.ts';

export default (app: Application): void => {
  const router = Router();

  app.use('/og', router);

  router.get('/', RateLimitRoute.og, OgController.getOg);
};
