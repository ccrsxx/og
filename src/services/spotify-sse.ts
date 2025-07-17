import { randomUUID } from 'crypto';
import { SpotifyService } from '../services/spotify.ts';
import { logger } from '../loaders/pino.ts';
import type { Request, Response } from 'express';

type SSEClient = {
  id: string;
  res: Response;
};

type SSEState = {
  clients: SSEClient[];
  pollingIntervalId: NodeJS.Timeout | null;
};

const SSEStates: SSEState = {
  clients: [],
  pollingIntervalId: null
};

const SSE_INTERVAL = 1000; // 1 seconds

async function pollAndBroadcast(SSEClient?: SSEClient): Promise<void> {
  try {
    const currentlyPlaying = await SpotifyService.getCurrentlyPlaying();

    const jsonString = JSON.stringify({
      data: currentlyPlaying
    });

    const eventString = `data: ${jsonString}\n\n`;

    // If SSEClient is provided, send the event only to that client. Happens when a new client connects.
    if (SSEClient) {
      logger.info('Broadcasting first event to new client.');
      SSEClient.res.write(eventString);
    } else {
      if (!SSEStates.clients.length) {
        logger.info('No clients connected. Skipping broadcast.');
        return;
      }

      logger.info(`Broadcasting event to ${SSEStates.clients.length} clients.`);

      SSEStates.clients.forEach((client) => client.res.write(eventString));
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    logger.error(
      err,
      `Error during Spotify poll and broadcast: ${errorMessage}`
    );
  }
}

function handleConnection(_req: Request, res: Response): void {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  const SSEClient: SSEClient = {
    id: randomUUID(),
    res: res
  };

  SSEStates.clients.push(SSEClient);

  logger.info(
    `Client connected: ${SSEClient.id}. Total clients: ${SSEStates.clients.length}`
  );

  // If this new client, we send send thh first event immediately.
  void pollAndBroadcast(SSEClient);

  if (!SSEStates.pollingIntervalId) {
    logger.info('First client connected. Starting polling interval.');

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    SSEStates.pollingIntervalId = setInterval(pollAndBroadcast, SSE_INTERVAL);
  }

  res.on('close', () => {
    SSEStates.clients = SSEStates.clients.filter(
      (client) => client.id !== SSEClient.id
    );

    logger.info(
      `Client disconnected: ${SSEClient.id}. Total clients: ${SSEStates.clients.length}`
    );

    // If there are no more clients connected, stop the polling interval.
    if (!SSEStates.clients.length && SSEStates.pollingIntervalId) {
      logger.info('Last client disconnected. Stopping polling interval.');

      clearInterval(SSEStates.pollingIntervalId);

      SSEStates.pollingIntervalId = null;
    }

    res.end();
  });
}

export const SpotifySSEService = {
  handleConnection
};
