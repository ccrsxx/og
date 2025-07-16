import { type Application } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import openApiDocument from '../docs/openapi.json' with { type: 'json' };

export default (app: Application): void => {
  app.use(
    '/docs',
    apiReference({
      theme: 'elysiajs',
      content: openApiDocument,
      pageTitle: 'Main API'
    })
  );
};
