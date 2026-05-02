import express from 'express';
import { createServer } from 'http';
import { appEnv } from './config/env.ts';
import loaders from './loaders/index.ts';
import { logger } from './loaders/pino.ts';
import errorHandler from './server/error.ts';
import { handlers } from './server/handlers.ts';

async function main(): Promise<void> {
  const app = express();
  const server = createServer(app);

  loaders(app, server);

  await handlers(app);

  errorHandler(app);

  server.listen(appEnv.PORT, () => {
    logger.info(`server running on port ${appEnv.PORT}`);
  });
}

/**
 * Handle graceful shutdown.
 * Triggered by process managers (like systemd, PM2) or container orchestrators (like Docker, Cloud Run).
 */
process.on('SIGTERM', () => {
  logger.info('caught sigterm');

  // Force pending asynchronous logs to write to disk/console before the process dies.
  // Prevents the loss of critical logs during a restart or crash.
  logger.flush();
});

main().catch((err) => {
  logger.fatal(err, 'server failed to start');
  process.exit(1);
});
