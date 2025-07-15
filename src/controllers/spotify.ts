import { SpotifyService } from '../services/spotify.ts';
import type { Request, Response } from 'express';
import type { ApiResponse } from '../lib/types/api.ts';
import type { CurrentlyPlaying } from '../lib/types/spotify/parsed.ts';

export async function getCurrentlyPlaying(
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
