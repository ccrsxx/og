import { SSEService } from '../sse/sse.service.ts';
import { SpotifyService } from './spotify.service.ts';
import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../../core/utils/types/api.ts';
import type { CurrentlyPlaying } from '../../core/utils/types/spotify.ts';

async function getCurrentlyPlaying(
  _req: Request,
  res: Response<ApiResponse<CurrentlyPlaying>>
): Promise<void> {
  const currentlyPlaying = await SpotifyService.getCurrentlyPlaying();

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

export const SpotifyController = {
  getCurrentlyPlaying,
  getCurrentlyPlayingSSE
};
