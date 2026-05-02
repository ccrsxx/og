import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api.ts';

export class HomeController {
  ping = (_: Request, res: Response<ApiResponse>): void => {
    res.status(200).json({
      data: {
        message: 'Welcome! The API is up and running',
        documentationUrl: 'https://api.ccrsxx.com/docs'
      }
    });
  };
}
