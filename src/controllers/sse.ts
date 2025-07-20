import { SSEService } from '../services/sse.ts';
import type { NextFunction, Request, Response } from 'express';

function getCurrentlyPlayingSSE(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  SSEService.handleConnection(req, res, next);
}

export const SSEController = {
  getCurrentlyPlayingSSE
};
