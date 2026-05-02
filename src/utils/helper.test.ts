import type { Request } from 'express';
import { describe, expect, it } from 'vitest';
import { getIpAddressFromRequest } from './helper.ts';

function createMockRequest(
  headers: Record<string, string> = {},
  ip?: string
): Request {
  return { get: (name: string) => headers[name], ip } as Request;
}

describe('getIpAddressFromRequest', () => {
  it('returns cf-connecting-ip header when present', () => {
    const req = createMockRequest({ 'cf-connecting-ip': '1.2.3.4' });

    expect(getIpAddressFromRequest(req)).toBe('1.2.3.4');
  });

  it('returns x-real-ip when cf-connecting-ip is missing', () => {
    const req = createMockRequest({ 'x-real-ip': '5.6.7.8' });

    expect(getIpAddressFromRequest(req)).toBe('5.6.7.8');
  });

  it('returns first ip from x-forwarded-for', () => {
    const req = createMockRequest({
      'x-forwarded-for': '10.0.0.1, 10.0.0.2, 10.0.0.3'
    });

    expect(getIpAddressFromRequest(req)).toBe('10.0.0.1');
  });

  it('falls back to req.ip', () => {
    const req = createMockRequest({}, '192.168.1.1');

    expect(getIpAddressFromRequest(req)).toBe('192.168.1.1');
  });

  it('returns empty string when no ip available', () => {
    const req = createMockRequest({});

    expect(getIpAddressFromRequest(req)).toBe('');
  });
});
