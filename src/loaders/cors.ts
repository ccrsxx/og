import cors, { type CorsOptions } from 'cors';
import type { Application } from 'express';
import { appEnv } from '../config/env.ts';

const ALLOWED_ORIGINS = appEnv.VALID_ORIGINS.split(',');

export const corsOptions: CorsOptions = {
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true
};

export default (app: Application): void => {
  app.use(cors(corsOptions));
};
