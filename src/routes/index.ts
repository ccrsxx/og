import og from './og.ts';
import root from './root.ts';
import spotify from './spotify.ts';
import type { Application } from 'express';

export default (app: Application): void => {
  og(app);
  root(app);
  spotify(app);
};
