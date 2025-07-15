import og from './og.ts';
import root from './root.ts';
import docs from './docs.ts';
import spotify from './spotify.ts';
import favicon from './favicon.ts';
import type { Application } from 'express';

export default (app: Application): void => {
  og(app);
  root(app);
  docs(app);
  spotify(app);
  favicon(app);
};
