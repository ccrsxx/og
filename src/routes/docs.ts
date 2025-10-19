import { apiReference } from '@scalar/express-api-reference';
import { type Application } from 'express';
import openApiDocument from '../docs/openapi.json' with { type: 'json' };
import { appConfig } from '../config/index.ts';
import { getPublicUrlFromRequest } from '../utils/helper.ts';
import type { OpenAPIV3 } from 'openapi-types';

export default (app: Application): void => {
  app.use('/docs', (req, res) => {
    const servers: OpenAPIV3.ServerObject[] = [
      {
        url: getPublicUrlFromRequest(req),
        description: 'Production server'
      }
    ];

    if (appConfig.isDevelopment) {
      servers.push({
        url: 'http://localhost:4000',
        description: 'Development server'
      });
    }

    return apiReference({
      theme: 'elysiajs',
      servers: servers,
      content: openApiDocument,
      pageTitle: 'Main API'
    })(req, res);
  });
};
