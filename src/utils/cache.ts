import { logger } from '../loaders/pino.ts';
import { kv } from './kv.ts';

type CacheClient = {
  get<T>(key: string): Promise<CacheItem<T> | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
};

type CacheItem<T = unknown> = {
  data: T;
  expiredAt: Date;
};

class InMemoryCache implements CacheClient {
  private cache = new Map<string, CacheItem>();

  public get<T>(key: string): Promise<CacheItem<T> | null> {
    const item = this.cache.get(key);

    if (!item) {
      return Promise.resolve(null);
    }

    if (item.expiredAt <= new Date()) {
      this.cache.delete(key);
      return Promise.resolve(null);
    }

    return Promise.resolve(item as CacheItem<T>);
  }

  public set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const expiredAt = new Date(Date.now() + ttlSeconds * 1000);

    this.cache.set(key, { data: value, expiredAt });

    return Promise.resolve();
  }
}

class CloudflareKVCache implements CacheClient {
  public get<T>(key: string): Promise<CacheItem<T> | null> {
    return kv.get<string, CacheItem<T>>(key);
  }

  public set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    return kv.set<string, T>(key, value, ttlSeconds);
  }
}

const inMemoryCacheClient = new InMemoryCache();
const cloudflareKVCacheClient = new CloudflareKVCache();

type CacheProvider = 'memory' | 'cloudflare-kv';

type GetCachedDataOptions<T> = {
  key: string;
  provider: CacheProvider;
  fetcher: () => Promise<T>;
  expiryInSeconds: number | ((data: T) => number);
};

export async function getCachedData<T>({
  key,
  provider,
  expiryInSeconds,
  fetcher
}: GetCachedDataOptions<T>): Promise<T> {
  logger.debug(`getCachedData called with key: ${key}, provider: ${provider}`);

  const cacheClient =
    provider === 'cloudflare-kv'
      ? cloudflareKVCacheClient
      : inMemoryCacheClient;

  const cachedValue = await cacheClient.get<T>(key);

  if (cachedValue) {
    const cacheExpirySeconds =
      (cachedValue.expiredAt.getTime() - Date.now()) / 1000;

    logger.debug(
      `Cache hit for key: ${key}. Data will expire in: ${cacheExpirySeconds} seconds`
    );

    return cachedValue.data;
  }

  const newData = await fetcher();

  const parsedExpiryInSeconds =
    typeof expiryInSeconds === 'function'
      ? expiryInSeconds(newData)
      : expiryInSeconds;

  logger.debug(
    `Cache miss for key: ${key}. Setting new data with expiry: ${parsedExpiryInSeconds} seconds`
  );

  // Set the new data in the cache, but don't wait for it to complete.
  cacheClient.set(key, newData, parsedExpiryInSeconds).catch((err) => {
    logger.error(err, `Failed to set cache for key: ${key}`);
  });

  return newData;
}
