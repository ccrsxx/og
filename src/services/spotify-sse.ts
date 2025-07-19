import { randomUUID } from 'crypto';
import { SpotifyService } from '../services/spotify.ts';
import { logger } from '../loaders/pino.ts';
import { FatalError } from '../utils/error.ts';
import { enforceKillSwitch } from '../utils/kill-switch.ts';
import { getIpAddressFromRequest } from '../utils/helper.ts';
import type { NextFunction, Request, Response } from 'express';
import type { ApiLogContext } from '../utils/types/log.ts';

type SSEClient = {
  id: string;
  ip: string;
  res: Response;
};

type SSEState = {
  clients: SSEClient[];
  pollingIntervalId: NodeJS.Timeout | null;
};

export const SSEStates: SSEState = {
  clients: [],
  pollingIntervalId: null
};

const SSEStatesLogContext: ApiLogContext<SSEState> = {
  context: SSEStates
};

const SSE_INTERVAL_MS = 1000;

async function pollAndBroadcast(
  next: NextFunction,
  SSEClient?: SSEClient
): Promise<void> {
  try {
    await enforceKillSwitch();

    logger.debug(
      SSEStatesLogContext,
      'Polling Spotify for currently playing track.'
    );

    const currentlyPlaying = await SpotifyService.getCurrentlyPlaying();

    const jsonString = JSON.stringify({
      data: currentlyPlaying
    });

    const eventString = `data: ${jsonString}\n\n`;

    // If SSEClient is provided, send the event only to that client. Happens when a new client connects.
    if (SSEClient) {
      logger.debug('Broadcasting first event to new client.');
      SSEClient.res.write(eventString);
    } else {
      if (!SSEStates.clients.length) {
        logger.info('No clients connected. Skipping broadcast.');
        return;
      }

      logger.debug(
        `Broadcasting event to ${SSEStates.clients.length} clients.`
      );

      SSEStates.clients.forEach((client) => client.res.write(eventString));
    }
  } catch (err) {
    if (err instanceof FatalError) next(err);

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    logger.error(
      err,
      `Error during Spotify poll and broadcast: ${errorMessage}`
    );
  }
}

function handleConnection(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  res.flushHeaders();

  const SSEClient: SSEClient = {
    id: randomUUID(),
    ip: getIpAddressFromRequest(req),
    res: res
  };

  SSEStates.clients.push(SSEClient);

  logger.info(
    SSEStatesLogContext,
    `Client connected: ${SSEClient.id}. Total clients: ${SSEStates.clients.length}`
  );

  // If this new client, we send send thh first event immediately.
  void pollAndBroadcast(next, SSEClient);

  if (!SSEStates.pollingIntervalId) {
    logger.info('First client connected. Starting polling interval.');

    SSEStates.pollingIntervalId = setInterval(
      () => void pollAndBroadcast(next),
      SSE_INTERVAL_MS
    );
  }

  res.on('close', () => {
    SSEStates.clients = SSEStates.clients.filter(
      (client) => client.id !== SSEClient.id
    );

    logger.info(
      SSEStatesLogContext,
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
