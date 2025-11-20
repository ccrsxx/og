import { SpotifyService } from './spotify.service.ts';
import type { Request, Response } from 'express';
import type { ApiResponse } from '../../core/utils/types/api.ts';
import type { CurrentlyPlaying } from '../../core/utils/types/currently-playing.ts';

async function getCurrentlyPlaying(
  _req: Request,
  res: Response<ApiResponse<CurrentlyPlaying>>
): Promise<void> {
  const currentlyPlaying = await SpotifyService.getCurrentlyPlaying();

  res.status(200).json({
    data: currentlyPlaying
  });
}

export const SpotifyController = {
  getCurrentlyPlaying
};
