import { Router, type Application } from 'express';
import { RootController } from '../controller/root.js';

export default (app: Application): void => {
  const router = Router();

  app.use('/', router);

  router.get('/', RootController.ping);
};
