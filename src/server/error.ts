import { randomUUID } from 'crypto';
import type { Application, NextFunction, Request, Response } from 'express';
import { logger } from '../loaders/pino.ts';
import type { ApiResponse } from '../types/api.ts';
import type { ApiLogContext } from '../types/log.ts';
import { AppError, errorAs, FatalError, HttpError } from '../utils/error.ts';
import { getIpAddressFromRequest } from '../utils/helper.ts';

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

  const logContext: ApiLogContext<LogContext> = {
    context: {
      ip: getIpAddressFromRequest(req),
      url: req.originalUrl,
      error: err,
      method: req.method,
      errorId: errorId
    }
  };

  logger.debug(logContext, 'error handler invoked');

  const fatalError = errorAs(err, FatalError);

  if (fatalError) {
    logger.fatal(logContext, 'fatal error');

    process.exit(1);
  }

  const httpError = errorAs(err, HttpError);

  if (httpError) {
    logger.info(logContext, 'expected error');

    res.status(httpError.statusCode).json({
      error: { id: errorId, message: err.message, details: httpError.details }
    });

    return;
  }

  const appError = errorAs(err, AppError);

  if (appError) {
    logger.warn(logContext, 'application error');

    res.status(500).json({
      error: { id: errorId, message: err.message, details: [] }
    });

    return;
  }

  // Below this point, we treat the error as an unexpected error

  // Any unhandled error
  if (err instanceof Error) {
    logger.error(logContext, 'unexpected error');

    res.status(500).json({
      error: {
        id: errorId,
        message: 'An internal server error occurred.',
        details: []
      }
    });

    return;
  }

  // Fallback for non-Error throwables (e.g., throw 'string')

  logger.error(logContext, 'unknown error');

  res.status(500).json({
    error: {
      id: errorId,
      message: 'An internal server error occurred.',
      details: []
    }
  });
}
