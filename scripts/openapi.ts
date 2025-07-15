import { writeFile } from 'fs/promises';
import { z } from 'zod';
import { transpile } from 'postman2openapi';
import { validStringSchema } from '../src/utils/validation.ts';
import type { OpenAPIV3 } from 'openapi-types';

async function main(): Promise<void> {
  const postmanEnvSchema = z.object({
    BACKEND_URL: validStringSchema,
    POSTMAN_API_KEY: validStringSchema,
    POSTMAN_COLLECTION_ID: validStringSchema
  });

  const { data: postmanEnv, error } = postmanEnvSchema.safeParse(process.env);

  if (error) {
    throw new Error(`Invalid environment variables: ${error.message}`);
  }

  const postmanCollectionResponse = await fetch(
    `https://api.getpostman.com/collections/${postmanEnv.POSTMAN_COLLECTION_ID}`,
    {
      headers: {
        'x-api-key': postmanEnv.POSTMAN_API_KEY
      }
    }
  );

  if (!postmanCollectionResponse.ok) {
    throw new Error(
      `Failed to fetch Postman collection: ${postmanCollectionResponse.statusText}`
    );
  }

  type PostmanCollection = {
    collection: {
      info: Record<string, unknown>;
      item: Record<string, unknown>[];
    };
  };

  const data = (await postmanCollectionResponse.json()) as PostmanCollection;

  const openapi = transpile(data.collection) as OpenAPIV3.Document;

  openapi.info = {
    title: 'Main APIs',
    description: 'API documentation generated from Postman collection',
    version: '1.0.0'
  };

  openapi.servers = [
    {
      url: postmanEnv.BACKEND_URL,
      description: 'Production server'
    },
    {
      url: 'http://localhost:4000',
      description: 'Local development server'
    }
  ];

  const stringifiedOpenapi = JSON.stringify(openapi, null, 2);

  await writeFile('./src/docs/openapi.json', stringifiedOpenapi);
}

void main();
