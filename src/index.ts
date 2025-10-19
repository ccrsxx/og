import { createServer } from 'http';
import express from 'express';
import { appEnv } from './core/utils/env.ts';
import { logger } from './core/loaders/pino.ts';
import loaders from './core/loaders/index.ts';
import routes from './core/routes/index.ts';
import errorHandler from './core/middlewares/error.ts';

function main(): void {
  const app = express();
  const server = createServer(app);

  loaders(app, server);

  routes(app);

  errorHandler(app);

  server.listen(appEnv.PORT, () => {
    logger.info(`Server running on port ${appEnv.PORT}`);
  });
}

/** Listen for termination signal */
process.on('SIGTERM', () => {
  // Clean up resources on shutdown
  logger.info('Caught SIGTERM.');
  logger.flush();
});

main();
