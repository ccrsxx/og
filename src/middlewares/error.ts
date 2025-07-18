import { randomUUID } from 'crypto';
import { HttpError } from '../utils/error.ts';
import { logger } from '../loaders/pino.ts';
import { getIpAddressFromRequest } from '../utils/helper.ts';
import type { ApiResponse } from '../utils/types/api.ts';
import type { Request, Response, Application, NextFunction } from 'express';

export default (app: Application): void => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};

function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const notFoundError = new HttpError(404, {
    message: `Route not found - ${req.originalUrl}`
  });

  next(notFoundError);
}

function errorHandler(
  err: Error,
  req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void {
  const errorId = randomUUID();

  type LogContext = {
    ip: string;
    url: string;
    error: Error;
    method: string;
    errorId: string;
  };

  const logContext: LogContext = {
    ip: getIpAddressFromRequest(req),
    url: req.originalUrl,
    error: err,
    method: req.method,
    errorId: errorId
  };

  logger.debug(logContext, 'Error handler invoked');

  if (err instanceof HttpError) {
    if (err.statusCode === 429) {
      logger.warn(
        `Handled rate limit error from ${req.ip} on ${req.originalUrl}`,
        logContext
      );
    } else {
      logger.info(logContext, `Handled expected error - ${err.message}`);
    }

    res.status(err.statusCode).json({
      error: { id: errorId, message: err.message, details: err.details }
    });
    return;
  }

  if (err instanceof Error) {
    logger.error(`Handled unexpected error - ${err.message}`, logContext);
    res.status(500).json({
      error: {
        id: errorId,
        message: 'An internal server error occurred.',
        details: []
      }
    });
    return;
  }

  logger.error('Handled unknown error', logContext);
  res.status(500).json({
    error: {
      id: errorId,
      message: 'An internal server error occurred.',
      details: []
    }
  });
}
