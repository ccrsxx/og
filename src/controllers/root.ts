import type { Request, Response } from 'express';
import type { ApiResponse } from '../utils/types/api.ts';

export function ping(_req: Request, res: Response<ApiResponse>): void {
  res.status(200).json({
    data: {
      message: 'Welcome! The API is up and running.',
      documentation_url: '/docs'
    }
  });
}

export const RootController = {
  ping
};
