import { createRateLimit } from './common.ts';

const ONE_SECOND_MS = 1000;

const TEN_SECONDS_MS = 10 * ONE_SECOND_MS;

const ONE_MINUTE_MS = 60 * ONE_SECOND_MS;

const global = createRateLimit({
  windowMs: ONE_MINUTE_MS,
  max: 100
});

const og = createRateLimit({
  windowMs: ONE_MINUTE_MS,
  max: 60
});

const sse = createRateLimit({
  windowMs: TEN_SECONDS_MS,
  max: 10
});

export const RateLimitRoute = {
  og,
  sse,
  global
};
