import { type Application } from 'express';
import { DocsController } from './docs.controller.ts';

export default (app: Application): void => {
  app.use('/docs', DocsController.getDocs);
};
