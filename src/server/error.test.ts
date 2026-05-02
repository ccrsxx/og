import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import type { ApiResponse } from '../types/api.ts';
import { AppError, FatalError, HttpError } from '../utils/error.ts';

// Mock the logger to isolate side-effects. Equivalent to Go's `io.Discard` logger.
vi.mock('../loaders/pino.ts', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn()
  }
}));

// Mock crypto.randomUUID for deterministic error IDs in assertions.
vi.mock('crypto', () => ({
  randomUUID: (): string => 'test-error-id'
}));

// Import after mocks are set up.
const { default: registerErrorHandler } = await import('./error.ts');

type Handler = (...args: unknown[]) => void;

type ErrorHandler = (
  err: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => void;

type MockApp = {
  handlers: Handler[];
  use(...handlers: Handler[]): void;
};

function createMockApp(): MockApp {
  const handlers: Handler[] = [];

  return {
    handlers,
    use(...fns: Handler[]): void {
      handlers.push(...fns);
    }
  };
}

function getHandlers(app: MockApp): {
  notFoundHandler: Handler;
  errorHandler: ErrorHandler;
} {
  registerErrorHandler(app as never);

  return {
    notFoundHandler: app.handlers[0],
    errorHandler: app.handlers[1] as ErrorHandler
  };
}

function createMockRequest(url = '/test'): Request {
  return {
    originalUrl: url,
    method: 'GET',
    get: (): undefined => undefined,
    ip: '127.0.0.1'
  } as unknown as Request;
}

function createMockResponse(): {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
} {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  };

  return res;
}

describe('notFoundHandler', () => {
  it('calls next with 404 HttpError containing route path', () => {
    const { notFoundHandler } = getHandlers(createMockApp());

    const req = { originalUrl: '/api/missing' } as Request;
    const res = createMockResponse();
    const next = vi.fn();

    notFoundHandler(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    const err = next.mock.calls[0][0] as HttpError;

    expect(err).toBeInstanceOf(HttpError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Route not found - /api/missing');
  });
});

describe('errorHandler', () => {
  it('returns correct status and message for HttpError', () => {
    const { errorHandler } = getHandlers(createMockApp());

    const err = new HttpError(400, { message: 'Bad request' });
    const req = createMockRequest();
    const res = createMockResponse();

    errorHandler(err, req, res as unknown as Response<ApiResponse>, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { id: 'test-error-id', message: 'Bad request', details: [] }
    });
  });

  it('returns 500 with error message for AppError', () => {
    const { errorHandler } = getHandlers(createMockApp());

    const err = new AppError({ message: 'Something went wrong' });
    const req = createMockRequest();
    const res = createMockResponse();

    errorHandler(err, req, res as unknown as Response<ApiResponse>, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        id: 'test-error-id',
        message: 'Something went wrong',
        details: []
      }
    });
  });

  it('exits process for FatalError', () => {
    const { errorHandler } = getHandlers(createMockApp());

    const err = new FatalError({ message: 'disk full' });
    const req = createMockRequest();
    const res = createMockResponse();

    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);

    errorHandler(err, req, res as unknown as Response<ApiResponse>, vi.fn());

    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });

  it('returns 500 with generic message for unexpected Error', () => {
    const { errorHandler } = getHandlers(createMockApp());

    const err = new Error('unexpected crash');
    const req = createMockRequest();
    const res = createMockResponse();

    errorHandler(err, req, res as unknown as Response<ApiResponse>, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        id: 'test-error-id',
        message: 'An internal server error occurred.',
        details: []
      }
    });
  });

  it('returns 500 with generic message for non-Error throwable', () => {
    const { errorHandler } = getHandlers(createMockApp());

    const req = createMockRequest();
    const res = createMockResponse();

    // Simulate `throw 'string'` — err is not an Error instance.
    errorHandler(
      'string error' as unknown as Error,
      req,
      res as unknown as Response<ApiResponse>,
      vi.fn()
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        id: 'test-error-id',
        message: 'An internal server error occurred.',
        details: []
      }
    });
  });
});
