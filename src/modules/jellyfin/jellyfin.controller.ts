import { SSEService } from '../sse/sse.service.ts';
import { JellyfinService } from './jellyfin.service.ts';
import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../../core/utils/types/api.ts';
import type { CurrentlyPlaying } from '../../core/utils/types/currently-playing.ts';

async function getCurrentlyPlaying(
  _req: Request,
  res: Response<ApiResponse<CurrentlyPlaying>>
): Promise<void> {
  const currentlyPlaying = await JellyfinService.getCurrentlyPlaying();

  res.status(200).json({
    data: currentlyPlaying
  });
}

function getCurrentlyPlayingSSE(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  SSEService.handleConnection(req, res, next);
}

export const JellyfinController = {
  getCurrentlyPlaying,
  getCurrentlyPlayingSSE
};
