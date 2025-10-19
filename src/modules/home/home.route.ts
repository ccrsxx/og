import picomatch from 'picomatch';
import { Router, type Application } from 'express';
import { ToolController } from '../tools/tools.controller.ts';
import { HomeController } from './home.controller.ts';

export default (app: Application): void => {
  const router = Router();

  app.use('/', router);

  router.get('/', (req, res) => {
    const { hostname } = req;

    if (picomatch.isMatch(hostname, 'ip.*')) {
      return ToolController.getIpAddress(req, res);
    }

    if (picomatch.isMatch(hostname, 'ipinfo.*')) {
      return ToolController.getIpAddressInfo(req, res);
    }

    if (picomatch.isMatch(hostname, 'headers.*')) {
      return ToolController.getRequestHeader(req, res);
    }

    return HomeController.ping(req, res);
  });
};
