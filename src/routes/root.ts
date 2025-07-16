import { type Application } from 'express';
import { RootController } from '../controllers/root.ts';

export default (app: Application): void => {
  app.get('/', RootController.ping);
};
