import type { Application } from 'express';
import { pino as Pino, type LoggerOptions } from 'pino';
import { pinoHttp as PinoHttp, type Options } from 'pino-http';
import pretty from 'pino-pretty';
import { appConfig } from '../config/config.ts';

type CombinedLoggerOptions = {
  pinoOptions: LoggerOptions;
  pinoHttpOptions?: Options;
};

const developmentLoggerOptions: CombinedLoggerOptions = {
  pinoOptions: {},
  pinoHttpOptions: {
    autoLogging: false
  }
};

const productionLoggerOptions: CombinedLoggerOptions = {
  pinoOptions: {
    level: 'trace',
    formatters: {
      level(label) {
        return { severity: label };
      }
    },
    messageKey: 'message'
  }
};

const { pinoOptions, pinoHttpOptions } = appConfig.isProduction
  ? productionLoggerOptions
  : developmentLoggerOptions;

export const logger = appConfig.isProduction
  ? Pino(pinoOptions)
  : Pino(pinoOptions, pretty());

const pinoHttp = PinoHttp({
  ...pinoHttpOptions,
  logger
});

export default (app: Application): void => {
  app.use(pinoHttp);
};
