import { rateLimit, type Options } from 'express-rate-limit';
import { type Application } from 'express';
import { HttpError } from '../utils/error.ts';

/**
 * @file This file configures the application's rate-limiting strategy.
 * It uses a layered defense approach:
 * 1. Cloudflare at the edge handles massive, short-burst DDoS attacks.
 * 2. This server-side limiter handles sustained, application-level abuse.
 */

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
export const commonRateLimitOptions = {
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers (RFC 6585)
  legacyHeaders: false, // Disable the deprecated `X-RateLimit-*` headers
  handler: (_req, _res, next) => {
    const rateLimitError = new HttpError(429, {
      message: 'Too many requests, please try again later.'
    });

    next(rateLimitError);
  }
} as const satisfies Partial<Options>;

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
const globalRateLimit = rateLimit({
  ...commonRateLimitOptions,
  windowMs: 60 * 1000, // 1 minute
  max: 5 // Limit each IP to 100 requests per `windowMs`.
});

export default (app: Application): void => {
  app.set('trust proxy', 2);

  app.use(globalRateLimit);
};
