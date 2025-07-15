import { HttpError } from '../lib/error.ts';

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

export const AuthService = {
  getAuthorizationBearerToken
};
