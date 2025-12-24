import { access } from 'fs/promises';
import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '../loaders/pino.ts';
import { appConfig } from '../config/index.ts';
import { validStringSchema } from './validation.ts';

const envSchema = z.object({
  PORT: validStringSchema,
  SECRET_KEY: validStringSchema,
  BACKEND_URL: validStringSchema,
  JELLYFIN_URL: validStringSchema,
  IPINFO_TOKEN: validStringSchema,
  VALID_ORIGINS: validStringSchema,
  JELLYFIN_API_KEY: validStringSchema,
  JELLYFIN_USERNAME: validStringSchema,
  SPOTIFY_CLIENT_ID: validStringSchema,
  JELLYFIN_IMAGE_URL: validStringSchema,
  CLOUDFLARE_CDN_URL: validStringSchema,
  CLOUDFLARE_KV_TOKEN: validStringSchema,
  SPOTIFY_CLIENT_SECRET: validStringSchema,
  SPOTIFY_REFRESH_TOKEN: validStringSchema,
  CLOUDFLARE_ACCOUNT_ID: validStringSchema,
  CLOUDFLARE_KV_NAMESPACE_ID: validStringSchema
});

type EnvSchema = z.infer<typeof envSchema>;

function validateEnv(): EnvSchema {
  const PORT = process.env.PORT ?? process.env.HOST_PORT;

  const mergedEnv = {
    ...process.env,
    PORT
  };

  let { data, error } = envSchema.safeParse(mergedEnv);

  const runningOnCi = process.env.CI === 'true';

  if (runningOnCi) {
    data = process.env as EnvSchema;
  }

  const shouldThrowError = error && !runningOnCi;

  if (shouldThrowError) {
    throw new Error(`Environment validation error: ${error.message}`);
  }

  return data as EnvSchema;
}

async function loadEnv(): Promise<void> {
  let envPath = undefined;

  if (appConfig.isDevelopment) {
    const isLocalEnvExists = await access('.env.local')
      .then(() => true)
      .catch(() => false);

    if (!isLocalEnvExists) {
      throw new Error('Local environment file (.env.local) is missing');
    }

    envPath = '.env.local';

    logger.info(`Loading environment variables from ${envPath}`);
  } else {
    logger.info('Loading environment variables from .env or process.env');
  }

  dotenv.config({ path: envPath, quiet: true });
}

await loadEnv();

export const appEnv = validateEnv();
