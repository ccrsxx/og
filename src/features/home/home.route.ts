import { Router, type Application } from 'express';
import { HomeController } from './home.controller.ts';

export default (app: Application): void => {
  const router = Router();

  app.use('/', router);

  router.get('/', HomeController.ping);
};
