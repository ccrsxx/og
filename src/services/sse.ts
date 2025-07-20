import { randomUUID } from 'crypto';
import { logger } from '../loaders/pino.ts';
import { FatalError } from '../utils/error.ts';
import { enforceKillSwitch } from '../utils/kill-switch.ts';
import { getIpAddressFromRequest } from '../utils/helper.ts';
import { SpotifyService } from './spotify.ts';
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

const SPOTIFY_POLING_INTERVAL_MS = 1000;

const SSEStatesLogContext: ApiLogContext<SSEState> = {
  context: SSEStates
};

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
      SPOTIFY_POLING_INTERVAL_MS
    );
  }

  res.on('close', () => handleClientClose(res, SSEClient));
}

async function pollAndBroadcast(
  next: NextFunction,
  SSEClient?: SSEClient
): Promise<void> {
  // If there are no more clients connected, stop the polling interval.
  if (!SSEStates.clients.length && SSEStates.pollingIntervalId) {
    logger.info('Last client disconnected. Stopping polling interval.');

    clearInterval(SSEStates.pollingIntervalId);

    SSEStates.pollingIntervalId = null;
  }

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

    const spotifyDataString = `event: spotify\ndata: ${jsonString}\n\n`;

    // If SSEClient is provided, send the event only to that client. Happens when a new client connects.
    if (SSEClient) {
      logger.debug(
        SSEStatesLogContext,
        'Broadcasting first event to new client.'
      );

      const welcomeDataString = `data: ${JSON.stringify({
        data: {
          message: 'Connection established. Waiting for updates...'
        }
      })}\n\n`;

      SSEClient.res.write(welcomeDataString);
      SSEClient.res.write(spotifyDataString);

      return;
    }

    logger.debug(
      SSEStatesLogContext,
      `Broadcasting event to ${SSEStates.clients.length} clients.`
    );

    for (const client of SSEStates.clients) {
      client.res.write(spotifyDataString, (err) => {
        if (err) {
          logger.error(
            err,
            `Error sending data to client ${client.id}: ${err.message}`
          );

          handleClientClose(client.res, client);

          return;
        }

        logger.debug(
          SSEStatesLogContext,
          `Successfully sent data to client ${client.id}`
        );
      });
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

function handleClientClose(res: Response, sseClient: SSEClient): void {
  SSEStates.clients = SSEStates.clients.filter(
    (client) => client.id !== sseClient.id
  );

  logger.info(
    SSEStatesLogContext,
    `Client disconnected. Total clients: ${SSEStates.clients.length}`
  );

  res.end();
}

export const SSEService = {
  handleConnection
};
