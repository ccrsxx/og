import { logger } from '../../core/loaders/pino.ts';
import { getIpAddressFromRequest } from '../../core/utils/helper.ts';
import { HttpError } from '../../core/utils/error.ts';
import { SSEStates } from './sse.service.ts';
import type { NextFunction, Request, Response } from 'express';

const MAX_GLOBAL_CLIENTS = 100;
const MAX_CLIENTS_PER_IP = 10;

function isConnectionAuthorized(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const isGlobalClientLimitReached =
    SSEStates.clients.length >= MAX_GLOBAL_CLIENTS;

  if (isGlobalClientLimitReached) {
    logger.warn(
      `Maximum global clients reached: ${MAX_GLOBAL_CLIENTS}. Rejecting new connection.`
    );

    throw new HttpError(503, {
      message: 'Maximum number of clients reached. Try again later.'
    });
  }

  const clientIp = getIpAddressFromRequest(req);

  const isClientIpLimitReached =
    SSEStates.clients.filter((client) => client.ip === clientIp).length >=
    MAX_CLIENTS_PER_IP;

  if (isClientIpLimitReached) {
    logger.warn(
      `Maximum clients for IP ${clientIp} reached: ${MAX_CLIENTS_PER_IP}. Rejecting new connection.`
    );

    throw new HttpError(429, {
      message: 'Maximum number of clients for your IP reached. Try again later.'
    });
  }

  next();
}

export const SSEMiddleware = {
  isConnectionAuthorized
};
