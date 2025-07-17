import { SpotifyService } from '../services/spotify.ts';
import { logger } from '../loaders/pino.ts';
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

function getCurrentlyPlayingSSE(_req: Request, res: Response): void {
  // Interval for refreshing the currently playing track
  const SSE_INTERVAL = 3000;

  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  async function handleSendServerSentEvent(): Promise<void> {
    try {
      const currentlyPlaying = await SpotifyService.getCurrentlyPlaying();

      const jsonString = JSON.stringify({
        data: currentlyPlaying
      });

      const eventString = `data: ${jsonString}\n\n`;

      res.write(eventString);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      logger.error(
        err,
        `Error while fetching currently playing track: ${errorMessage}`
      );
    }
  }

  void handleSendServerSentEvent();

  const intervalId = setInterval(
    () => void handleSendServerSentEvent(),
    SSE_INTERVAL
  );

  res.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
}

export const SpotifyController = {
  getCurrentlyPlaying,
  getCurrentlyPlayingSSE
};
