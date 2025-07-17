import { OgService } from '../services/og.ts';
import { appConfig } from '../config/index.ts';
import type { Request, Response } from 'express';

async function getOg(req: Request, res: Response<Buffer>): Promise<void> {
  const og = await OgService.getOg(req.query);

  if (appConfig.isProduction) {
    res.set(
      'Cache-Control',
      'public, immutable, no-transform, max-age=31536000'
    );
  }

  res.contentType('image/png').send(og);
}

export const OgController = {
  getOg
};
