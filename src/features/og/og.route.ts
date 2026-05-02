import { Router, type Application } from 'express';
import { RateLimitRoute } from '../../loaders/rate-limit/routes.ts';
import type { OgController } from './og.controller.ts';

export type OgRouteConfig = {
  app: Application;
  controller: OgController;
};

export function loadRoutes(cfg: OgRouteConfig): void {
  const router = Router();

  cfg.app.use('/og', router);

  router.get('/', RateLimitRoute.og, cfg.controller.getOg);
}
