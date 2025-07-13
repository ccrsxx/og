import og from './og.ts';
import root from './root.ts';
import type { Application } from 'express';

export default (app: Application): void => {
  root(app);
  og(app);
};
