import { rateLimit, type Options } from 'express-rate-limit';
import { type Application } from 'express';
import { HttpError } from '../utils/error.ts';

/**
 * * --- EDGE LAYER: CLOUDFLARE ---
 * Cloudflare acts as the first line of defense at the network edge.
 * Its primary role is to absorb and block high-volume, short-burst attacks
 * before they ever reach our server.
 *
 * - Path: All paths ("*")
 * - Rate: 100 requests / 10 seconds (equivalent to a 600 requests/minute burst)
 * - Action: Block the user for 10 seconds.

/**
 * Common rate-limit options to be reused across different limiters.
 * This promotes consistency and adheres to modern standards.
 */
const commonRateLimitOptions = {
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers (RFC 6585)
  legacyHeaders: false, // Disable the deprecated `X-RateLimit-*` headers
  handler: (_req, _res, next) => {
    const rateLimitError = new HttpError(429, {
      message: 'Too many requests, please try again later.'
    });

    next(rateLimitError);
  }
} as const satisfies Partial<Options>;

export function createRateLimit(
  options: Parameters<typeof rateLimit>[0]
): ReturnType<typeof rateLimit> {
  return rateLimit({
    ...commonRateLimitOptions,
    ...options
  });
}

/**
 * * --- APPLICATION LAYER: GLOBAL SERVER-SIDE LIMIT ---
 * This is the second layer of protection, enforced directly on our server.
 * Its purpose is to prevent sustained abuse from a single IP that might not be
 * aggressive enough to trigger Cloudflare's burst protection.
 *
 * While Cloudflare allows a high burst rate (600 req/min), this server-side
 * limit is stricter for sustained traffic (100 req/min), protecting application
 * resources like database connections.
 */
const globalRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // Limit each IP to 100 requests per `windowMs`.
});

export default (app: Application): void => {
  // Trust the first two proxies. First is Google Cloud and second is Cloudflare.
  app.set('trust proxy', 2);

  app.use(globalRateLimit);
};
