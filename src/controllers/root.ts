import type { Request, Response } from 'express';
import type { ApiResponse } from '../utils/types/api.ts';

export function ping(_req: Request, res: Response<ApiResponse>): void {
  res.status(200).json({
    data: {
      message: 'API is running'
    }
  });
}

export const RootController = {
  ping
};
