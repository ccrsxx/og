import root from './root.js';
import type { Application } from 'express';

export default (app: Application): void => {
  root(app);
};
