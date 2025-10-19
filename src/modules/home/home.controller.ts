import { getPublicUrlFromRequest } from '../../core/utils/helper.ts';
import type { Request, Response } from 'express';
import type { ApiResponse } from '../../core/utils/types/api.ts';

function ping(req: Request, res: Response<ApiResponse>): void {
  res.status(200).json({
    data: {
      message: 'Welcome! The API is up and running',
      documentationUrl: `${getPublicUrlFromRequest(req)}/docs`
    }
  });
}

export const HomeController = {
  ping
};
