import { type Application } from 'express';
import { RateLimitRoute } from './routes.ts';

/**
 * * Configures a layered rate-limiting strategy for the application.
 *
 * This implementation uses a defense-in-depth approach with two primary layers:
 * 1. An Edge Layer handled by a reverse proxy (Cloudflare).
 * 2. An Application Layer enforced by this server.
 */

// -----------------------------------------------------------------------------

/**
 * * EDGE LAYER: CLOUDFLARE
 *
 * Cloudflare acts as the first line of defense at the network edge.
 * Its primary role is to absorb and block high-volume, short-burst attacks
 * before they ever reach our server.
 *
 * - Path: All paths ("*")
 * - Rate: 100 requests / 10 seconds (equivalent to a 600 requests/minute burst)
 * - Action: Block the user for 10 seconds.
 */

// -----------------------------------------------------------------------------

/**
 * * APPLICATION LAYER: GLOBAL SERVER-SIDE LIMIT
 *
 * This is the second layer of protection, enforced directly on our server.
 * Its purpose is to prevent sustained abuse from a single IP that might not be
 * aggressive enough to trigger Cloudflare's burst protection.
 *
 * While Cloudflare allows a high burst rate (600 req/min), this server-side
 * limit is stricter for sustained traffic (100 req/min), protecting application
 * resources like database connections.
 */

export default (app: Application): void => {
  // Trust the first two proxies. First is Google Cloud and second is Cloudflare.
  app.set('trust proxy', 2);

  app.use(RateLimitRoute.global);
};
