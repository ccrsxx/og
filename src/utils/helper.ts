import { type Request } from 'express';

export function getIpAddressFromRequest(req: Request): string {
  const cfIp = req.get('cf-connecting-ip');

  if (cfIp) {
    return cfIp;
  }

  const realIp = req.get('x-real-ip');

  if (realIp) {
    return realIp;
  }

  const forwardedFor = req.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return req.ip ?? '';
}
