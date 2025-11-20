import og from '../../modules/og/og.route.ts';
import sse from '../../modules/sse/sse.route.ts';
import root from '../../modules/home/home.route.ts';
import docs from '../../modules/docs/docs.route.ts';
import tools from '../../modules/tools/tools.route.ts';
import spotify from '../../modules/spotify/spotify.route.ts';
import jellyfin from '../../modules/jellyfin/jellyfin.route.ts';
import favicon from './favicon.ts';
import type { Application } from 'express';

export default (app: Application): void => {
  og(app);
  sse(app);
  root(app);
  docs(app);
  tools(app);
  spotify(app);
  favicon(app);
  jellyfin(app);
};
