import { rateLimit, type Options } from 'express-rate-limit';
import { HttpError } from '../../utils/error.ts';
import { logger } from '../pino.ts';

/**
 * Common rate-limit options to be reused across different limiters.
 * This promotes consistency and adheres to modern standards.
 */
const commonRateLimitOptions = {
  legacyHeaders: false, // Disable the deprecated `X-RateLimit-*` headers
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers (RFC 6585)
  handler: (req, _res, next) => {
    logger.warn(
      `Rate limit exceeded for ${req.method} on ${req.originalUrl} from ${req.ip}`
    );

    const rateLimitError = new HttpError(429, {
      message: 'Too many requests, please try again later.'
    });

    next(rateLimitError);
  }
} as const satisfies Partial<Options>;

/**
 * Creates a rate limit middleware with the provided options.
 * @param options - Custom options for the rate limit middleware.
 * @return A configured rate limit middleware function.
 */
export function createRateLimit(
  options: Parameters<typeof rateLimit>[0]
): ReturnType<typeof rateLimit> {
  return rateLimit({
    ...commonRateLimitOptions,
    ...options
  });
}
