import { type Request } from 'express';

export function getRemainingSecondsFromDate(date: Date): number {
  const now = new Date();
  return Math.max(0, Math.floor((date.getTime() - now.getTime()) / 1000));
}

export function getIpAddressFromRequest(req: Request): string {
  return req.ip ?? 'Unknown IP';
}
