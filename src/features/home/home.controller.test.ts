import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import type { ApiResponse } from '../../types/api.ts';
import { HomeController } from './home.controller.ts';

describe('HomeController', () => {
  describe('ping', () => {
    it('returns 200 with welcome message and documentation url', () => {
      const controller = new HomeController();

      const req = {} as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis()
      };

      controller.ping(req, res as unknown as Response<ApiResponse>);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          message: 'Welcome! The API is up and running',
          documentationUrl: 'https://api.ccrsxx.com/docs'
        }
      });
    });
  });
});
