import cors from './cors.ts';
import pino from './pino.ts';
import json from './json.ts';
import rateLimit from './rate-limit/index.ts';
import type { Application } from 'express';
import type { Server } from 'http';

export default (app: Application, _server: Server): void => {
  rateLimit(app);
  cors(app);
  pino(app);
  json(app);
};
