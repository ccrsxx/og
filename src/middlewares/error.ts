import { randomUUID } from 'crypto';
import { HttpError } from '../utils/error.ts';
import { logger } from '../loaders/pino.ts';
import type { ApiResponse } from '../utils/types/api.ts';
import type { Request, Response, Application, NextFunction } from 'express';

export default (app: Application): void => {
  app.use(notFound);
  app.use(errorHandler);
};

function notFound(req: Request, _res: Response, next: NextFunction): void {
  const notFoundError = new HttpError(404, {
    message: `Route not found - ${req.originalUrl}`
  });

  next(notFoundError);
}

function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void {
  const errorId = randomUUID();

  if (err instanceof HttpError) {
    logger.info(err, `Expected error handler - ${err.message}`);
    res.status(err.statusCode).json({
      error: { id: errorId, message: err.message, details: err.details }
    });
    return;
  }

  if (err instanceof Error) {
    logger.error(err, `Unexpected error handler - ${err.message}`);
    res
      .status(500)
      .json({ error: { id: errorId, message: err.message, details: [] } });
    return;
  }

  logger.error(err, 'Unknown error handler');
  res.status(500).json({
    error: { id: errorId, message: 'Internal server error', details: [] }
  });
}
