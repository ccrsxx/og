import og from '../features/og/og.route.ts';
import home from '../features/home/home.route.ts';
import favicon from './favicon.ts';
import type { Application } from 'express';

export default (app: Application): void => {
  og(app);
  home(app);
  favicon(app);
};
