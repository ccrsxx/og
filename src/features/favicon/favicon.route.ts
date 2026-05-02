import express, { Router, type Application } from 'express';

export type FaviconRouteConfig = {
  app: Application;
};

export function loadRoutes(cfg: FaviconRouteConfig): void {
  const router = Router();

  cfg.app.use('/favicon.ico', router);

  router.get('/', express.static('public/favicon.ico'));
}
