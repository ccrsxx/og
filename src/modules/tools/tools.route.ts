import { Router, type Application } from 'express';
import { RateLimitRoute } from '../../core/loaders/rate-limit/routes.ts';
import { ToolController } from './tools.controller.ts';

export default (app: Application): void => {
  const router = Router();

  app.use('/tools', router);

  router.get('/ip', ToolController.getIpAddress);

  router.get('/ipinfo', RateLimitRoute.ipinfo, ToolController.getIpAddressInfo);

  router.get('/headers', ToolController.getRequestHeader);
};
