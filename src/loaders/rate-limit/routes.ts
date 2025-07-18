import { createRateLimit } from './common.ts';

const ONE_MINUTE_MS = 60 * 1000;

const global = createRateLimit({
  windowMs: ONE_MINUTE_MS,
  max: 100
});

const og = createRateLimit({
  windowMs: ONE_MINUTE_MS,
  max: 60
});

const spotifyCurrentlyPlayingSSE = createRateLimit({
  windowMs: ONE_MINUTE_MS,
  max: 5
});

export const RateLimitRoute = {
  og,
  global,
  spotifyCurrentlyPlayingSSE
};
