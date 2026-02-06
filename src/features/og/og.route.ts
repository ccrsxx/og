import { Router, type Application } from 'express';
import { RateLimitRoute } from '../../loaders/rate-limit/routes.ts';
import { OgController } from './og.controller.ts';

export default (app: Application): void => {
  const router = Router();

  app.use('/og', router);

  router.get('/', RateLimitRoute.og, OgController.getOg);
};
