import type { Application } from 'express';
import home from '../features/home/home.route.ts';
import og from '../features/og/og.route.ts';
import favicon from './favicon.ts';

export default (app: Application): void => {
  og(app);
  home(app);
  favicon(app);
};
