import picomatch from 'picomatch';
import { Router, type Application } from 'express';
import { RootController } from '../controllers/root.ts';
import { ToolController } from '../controllers/tool.ts';

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

    return RootController.ping(req, res);
  });
};
