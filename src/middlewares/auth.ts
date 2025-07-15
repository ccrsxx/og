import { appEnv } from '../lib/env.ts';
import { HttpError } from '../lib/error.ts';
import { AuthService } from '../services/auth.ts';
import type { Request, Response, NextFunction } from 'express';

function isAuthorized(req: Request, _res: Response, next: NextFunction): void {
  const token = AuthService.getAuthorizationBearerToken(req);

  const validSecretKey = appEnv.SECRET_KEY === token;

  if (!validSecretKey) {
    throw new HttpError(401, { message: 'Invalid token' });
  }

  next();
}

export const AuthMiddleware = {
  isAuthorized
};
