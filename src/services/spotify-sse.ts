import { randomUUID } from 'crypto';
// import { SpotifyService } from '../services/spotify.ts';
import { logger } from '../loaders/pino.ts';
import { getIpAddressFromRequest } from '../utils/helper.ts';
import type { Request, Response } from 'express';
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

// const SSE_INTERVAL_MS = 1000;

// async function pollAndBroadcast(SSEClient?: SSEClient): Promise<void> {
//   try {
//     const currentlyPlaying = await SpotifyService.getCurrentlyPlaying();

//     const jsonString = JSON.stringify({
//       data: currentlyPlaying
//     });

//     const eventString = `data: ${jsonString}\n\n`;

//     // If SSEClient is provided, send the event only to that client. Happens when a new client connects.
//     if (SSEClient) {
//       logger.debug('Broadcasting first event to new client.');
//       SSEClient.res.write(eventString);
//     } else {
//       if (!SSEStates.clients.length) {
//         logger.info('No clients connected. Skipping broadcast.');
//         return;
//       }

//       logger.debug(
//         `Broadcasting event to ${SSEStates.clients.length} clients.`
//       );

//       SSEStates.clients.forEach((client) => client.res.write(eventString));
//     }
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//     logger.error(
//       err,
//       `Error during Spotify poll and broadcast: ${errorMessage}`
//     );
//   }
// }

function handleConnection(req: Request, res: Response): void {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  const SSEClient: SSEClient = {
    id: randomUUID(),
    ip: getIpAddressFromRequest(req),
    res: res
  };

  SSEStates.clients.push(SSEClient);

  const SSEStatesLogContext: ApiLogContext<SSEState> = {
    context: SSEStates
  };

  logger.info(
    SSEStatesLogContext,
    `Client connected: ${SSEClient.id}. Total clients: ${SSEStates.clients.length}`
  );

  // If this new client, we send send thh first event immediately.
  // void pollAndBroadcast(SSEClient);

  if (!SSEStates.pollingIntervalId) {
    logger.info('First client connected. Starting polling interval.');

    // SSEStates.pollingIntervalId = setInterval(
    //   // eslint-disable-next-line @typescript-eslint/no-misused-promises
    //   pollAndBroadcast,
    //   SSE_INTERVAL_MS
    // );
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
