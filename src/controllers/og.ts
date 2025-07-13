import { OgService, type ValidOgQuery } from '../services/og.ts';
import type { Request, Response } from 'express';

export async function getOg(
  req: Request<unknown, unknown, unknown, ValidOgQuery>,
  res: Response<Buffer>
): Promise<void> {
  const ogBuffer = await OgService.getOg(req.query);

  res.contentType('image/png').send(ogBuffer);
}

export const OgController = {
  getOg
};
