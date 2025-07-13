import cors from './cors.js';
import pino from './pino.js';
import json from './json.js';

import type { Application } from 'express';
import type { Server } from 'http';

export default (app: Application, _server: Server): void => {
  cors(app);
  pino(app);
  json(app);
};
