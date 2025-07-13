import { randomUUID } from 'crypto';
import { HttpError } from '../lib/error.js';
import { logger } from '../loaders/pino.js';
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
  res: Response,
  _next: NextFunction
): void {
  const randomId = randomUUID();

  if (err instanceof HttpError) {
    logger.info(err, `Expected error handler - ${err.message}`);
    res.status(err.statusCode).json({
      error: { id: randomId, message: err.message, errors: err.errors }
    });
    return;
  }

  if (err instanceof Error) {
    logger.error(err, `Unexpected error handler - ${err.message}`);
    res.status(500).json({ error: { id: randomId, message: err.message } });
    return;
  }

  logger.error(err, 'Unknown error handler');
  res
    .status(500)
    .json({ error: { id: randomId, message: 'Internal server error' } });
}
