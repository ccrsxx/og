import { SpotifyService } from '../services/spotify.ts';
import { SpotifySSEService } from '../services/spotify-sse.ts';
import type { Request, Response } from 'express';
import type { ApiResponse } from '../utils/types/api.ts';
import type { CurrentlyPlaying } from '../utils/types/spotify.ts';

async function getCurrentlyPlaying(
  _req: Request,
  res: Response<ApiResponse<CurrentlyPlaying>>
): Promise<void> {
  const currentlyPlaying = await SpotifyService.getCurrentlyPlaying();
  res.status(200).json({
    data: currentlyPlaying
  });
}

function getCurrentlyPlayingSSE(req: Request, res: Response): void {
  SpotifySSEService.handleConnection(req, res);
}

export const SpotifyController = {
  getCurrentlyPlaying,
  getCurrentlyPlayingSSE
};
