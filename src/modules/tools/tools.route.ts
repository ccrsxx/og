import { Router, type Application } from 'express';
import { ToolController } from './tools.controller.ts';

export default (app: Application): void => {
  const router = Router();

  app.use('/tools', router);

  router.get('/ip', ToolController.getIpAddress);

  router.get('/ipinfo', ToolController.getIpAddressInfo);

  router.get('/headers', ToolController.getRequestHeader);
};
