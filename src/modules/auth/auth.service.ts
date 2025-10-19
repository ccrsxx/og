import { HttpError } from '../../core/utils/error.ts';

import type { Request } from 'express';

function getAuthorizationBearerToken(req: Request): string {
  const authorization = req.get('authorization');

  if (!authorization) {
    throw new HttpError(401, { message: 'Invalid token' });
  }

  const [type, token] = authorization.split(' ');

  if (type.toLocaleLowerCase() !== 'bearer') {
    throw new HttpError(401, { message: 'Invalid token' });
  }

  return token;
}

function getAuthorizationBearerTokenFromQuery(req: Request): string {
  const token = req.query.token as string;

  if (!token) {
    throw new HttpError(401, { message: 'Invalid token' });
  }

  return token;
}

export const AuthService = {
  getAuthorizationBearerToken,
  getAuthorizationBearerTokenFromQuery
};
