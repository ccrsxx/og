import { Router, type Application } from 'express';
import type { HomeController } from './home.controller.ts';

export type HomeRouteConfig = {
  app: Application;
  controller: HomeController;
};

export function loadRoutes(cfg: HomeRouteConfig): void {
  const router = Router();

  cfg.app.use('/', router);

  router.get('/', cfg.controller.ping);
}
