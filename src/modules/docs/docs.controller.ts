import { apiReference } from '@scalar/express-api-reference';
import { getPublicUrlFromRequest } from '../../core/utils/helper.ts';
import openApiDocument from '../../core/docs/openapi.json' with { type: 'json' };
import type { Request, Response } from 'express';
import type { OpenAPIV3 } from 'openapi-types';

export function getDocs(req: Request, res: Response): void {
  const servers: OpenAPIV3.ServerObject[] = [
    {
      url: getPublicUrlFromRequest(req),
      description: 'Production server'
    }
  ];

  return apiReference({
    theme: 'elysiajs',
    servers: servers,
    content: openApiDocument,
    pageTitle: 'Main API'
  })(req, res);
}

export const DocsController = {
  getDocs
};
