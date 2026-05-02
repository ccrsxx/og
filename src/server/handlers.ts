import type { Application } from 'express';
import { appConfig } from '../config/config.ts';
import { appEnv } from '../config/env.ts';
import { loadRoutes as loadFaviconRoutes } from '../features/favicon/favicon.route.ts';
import { HomeController } from '../features/home/home.controller.ts';
import { loadRoutes as loadHomeRoutes } from '../features/home/home.route.ts';
import { OgController } from '../features/og/og.controller.ts';
import { loadRoutes as loadOgRoutes } from '../features/og/og.route.ts';
import { OgService, loadFonts } from '../features/og/og.service.ts';

export async function handlers(app: Application): Promise<void> {
  const fonts = await loadFonts(appEnv.CLOUDFLARE_CDN_URL);

  const ogService = new OgService({
    cloudflareCdnUrl: appEnv.CLOUDFLARE_CDN_URL,
    fonts
  });

  const ogController = new OgController(ogService, {
    isProduction: appConfig.isProduction
  });

  const homeController = new HomeController();

  loadOgRoutes({ app, controller: ogController });
  loadHomeRoutes({ app, controller: homeController });
  loadFaviconRoutes({ app });
}
