import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { OgController } from './og.controller.ts';
import type { IOgService } from './og.service.ts';

describe('OgController', () => {
  describe('getOg', () => {
    it('returns png buffer with correct content type', async () => {
      const pngBuffer = Buffer.from('fake-png');

      // Pure DI — no vi.mock(), no `as any`. IOgService satisfied structurally.
      const mockService: IOgService = {
        getOg: vi.fn().mockResolvedValue(pngBuffer)
      };

      const controller = new OgController(mockService, {
        isProduction: false
      });

      const req = { query: { title: 'Test' } } as unknown as Request;
      const res = {
        set: vi.fn().mockReturnThis(),
        contentType: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis()
      };

      await controller.getOg(req, res as unknown as Response<Buffer>);

      expect(res.contentType).toHaveBeenCalledWith('image/png');
      expect(res.send).toHaveBeenCalledWith(pngBuffer);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockService.getOg).toHaveBeenCalledWith(req.query);
    });

    it('sets cache-control header in production mode', async () => {
      const mockService: IOgService = {
        getOg: vi.fn().mockResolvedValue(Buffer.from('png'))
      };

      const controller = new OgController(mockService, {
        isProduction: true
      });

      const req = { query: {} } as unknown as Request;
      const res = {
        set: vi.fn().mockReturnThis(),
        contentType: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis()
      };

      await controller.getOg(req, res as unknown as Response<Buffer>);

      expect(res.set).toHaveBeenCalledWith(
        'Cache-Control',
        'public, immutable, no-transform, max-age=31536000'
      );
    });

    it('does not set cache-control header in non-production mode', async () => {
      const mockService: IOgService = {
        getOg: vi.fn().mockResolvedValue(Buffer.from('png'))
      };

      const controller = new OgController(mockService, {
        isProduction: false
      });

      const req = { query: {} } as unknown as Request;
      const res = {
        set: vi.fn().mockReturnThis(),
        contentType: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis()
      };

      await controller.getOg(req, res as unknown as Response<Buffer>);

      expect(res.set).not.toHaveBeenCalled();
    });
  });
});
