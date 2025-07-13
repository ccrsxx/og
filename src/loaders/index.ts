import cors from './cors.ts';
import pino from './pino.ts';
import json from './json.ts';
import type { Application } from 'express';
import type { Server } from 'http';

export default (app: Application, _server: Server): void => {
  cors(app);
  pino(app);
  json(app);
};
