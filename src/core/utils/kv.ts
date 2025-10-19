import { z } from 'zod';
import { logger } from '../loaders/pino.ts';
import { appEnv } from './env.ts';
import { HttpError, FatalError } from './error.ts';

const cloudflareKVSchema = z.object({
  'api:state:kill-switch': z.boolean()
});

type CloudflareKVSchema = z.infer<typeof cloudflareKVSchema>;

type CloudflareKVSchemaKey = keyof CloudflareKVSchema;

type GenericCloudflareKVReturn<
  T extends string = CloudflareKVSchemaKey,
  U = unknown
> = T extends CloudflareKVSchemaKey ? CloudflareKVSchema[T] : U;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createCloudflareKVClient() {
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${appEnv.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${appEnv.CLOUDFLARE_KV_NAMESPACE_ID}`;

  async function get<T extends string = CloudflareKVSchemaKey, U = unknown>(
    key: T
  ): Promise<GenericCloudflareKVReturn<T, U> | null> {
    const response = await fetchCloudflareKV(`${baseUrl}/values/${key}`);

    if (response.status === 404) return null;

    if (!response.ok) {
      logger.error(
        `Cloudflare KV API get error for key "${key}": ${response.status} ${response.statusText}`
      );

      throw new HttpError(503, {
        message: `Cloudflare KV API get error: ${response.status} ${response.statusText}`
      });
    }

    const rawValue = (await response.json()) as CloudflareKVSchema;

    const keyParser = cloudflareKVSchema.shape[key as CloudflareKVSchemaKey];

    if (!keyParser) {
      logger.debug(
        `Cloudflare KV get: Key "${key}" is not in the schema. Returning raw value.`
      );

      return rawValue as GenericCloudflareKVReturn<T, U>;
    }

    const parsedValue = keyParser.safeParse(rawValue);

    if (!parsedValue.success) {
      logger.warn(
        `Cloudflare KV API parse error for key "${key}": ${parsedValue.error.message}`
      );

      return null;
    }

    return parsedValue.data as GenericCloudflareKVReturn<T, U>;
  }

  async function set<T extends string = CloudflareKVSchemaKey, U = unknown>(
    key: T,
    value: GenericCloudflareKVReturn<T, U>,
    ttlSeconds?: number
  ): Promise<void> {
    if (ttlSeconds && ttlSeconds < 60) {
      throw new FatalError(
        `Cloudflare KV set error for key "${key}" called with ttlSeconds < 60: ${ttlSeconds}. TTL must be at least 60 seconds.`
      );
    }

    const formData = new FormData();

    formData.append('value', JSON.stringify(value));

    const url = new URL(`${baseUrl}/values/${key}`);

    if (ttlSeconds) {
      url.searchParams.append('expiration_ttl', ttlSeconds.toString());
    }

    const response = await fetchCloudflareKV(url.toString(), {
      method: 'PUT',
      body: formData
    });

    if (!response.ok) {
      logger.error(
        `Cloudflare KV API set error for key "${key}": ${response.status} ${response.statusText}`
      );

      throw new HttpError(503, {
        message: `Cloudflare KV API set error: ${response.status} ${response.statusText}`
      });
    }
  }

  async function del<T extends string = CloudflareKVSchemaKey>(
    key: T
  ): Promise<void> {
    const response = await fetchCloudflareKV(`${baseUrl}/values/${key}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      logger.error(
        `Cloudflare KV API delete error for key "${key}": ${response.status} ${response.statusText}`
      );

      throw new HttpError(503, {
        message: `Cloudflare KV API delete error: ${response.status} ${response.statusText}`
      });
    }
  }

  const client = {
    get: get,
    set: set,
    delete: del
  };

  return client;
}

async function fetchCloudflareKV(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${appEnv.CLOUDFLARE_KV_TOKEN}`
  };

  return fetch(url, { ...options, headers });
}

export const kv = createCloudflareKVClient();
