import { appEnv } from '../../core/utils/env.ts';
import { HttpError } from '../../core/utils/error.ts';
import { AuthService } from './auth.service.ts';
import type { Request, Response, NextFunction } from 'express';

function isAuthorized(req: Request, _res: Response, next: NextFunction): void {
  const token = AuthService.getAuthorizationBearerToken(req);

  const validSecretKey = appEnv.SECRET_KEY === token;

  if (!validSecretKey) {
    throw new HttpError(401, { message: 'Invalid token' });
  }

  next();
}

function isAuthorizedFromQuery(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const token = AuthService.getAuthorizationBearerTokenFromQuery(req);

  const validSecretKey = appEnv.SECRET_KEY === token;

  if (!validSecretKey) {
    throw new HttpError(401, { message: 'Invalid token' });
  }

  next();
}

export const AuthMiddleware = {
  isAuthorized,
  isAuthorizedFromQuery
};
