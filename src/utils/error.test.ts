import { describe, expect, it } from 'vitest';
import { AppError, errorAs, FatalError, HttpError } from './error.ts';

describe('HttpError', () => {
  it('creates with status code and message', () => {
    const err = new HttpError(400, { message: 'Bad request' });

    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Bad request');
    expect(err.details).toEqual([]);
  });

  it('creates with optional details and cause', () => {
    const cause = new Error('root cause');

    const err = new HttpError(422, {
      message: 'Validation failed',
      details: ['field is required', 'name too short'],
      cause
    });

    expect(err.statusCode).toBe(422);
    expect(err.details).toEqual(['field is required', 'name too short']);
    expect(err.cause).toBe(cause);
  });
});

describe('AppError', () => {
  it('creates with message and optional cause', () => {
    const cause = new Error('original');

    const err = new AppError({ message: 'app failed', cause });

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('app failed');
    expect(err.cause).toBe(cause);
  });
});

describe('FatalError', () => {
  it('creates with message and optional cause', () => {
    const cause = new Error('disk full');

    const err = new FatalError({ message: 'fatal failure', cause });

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('fatal failure');
    expect(err.cause).toBe(cause);
  });
});

describe('errorAs', () => {
  it('returns target error when it matches directly', () => {
    const err = new HttpError(404, { message: 'not found' });

    const result = errorAs(err, HttpError);

    expect(result).toBe(err);
  });

  it('traverses error cause chain to find target', () => {
    const httpErr = new HttpError(400, { message: 'bad request' });
    const appErr = new AppError({ message: 'wrapped', cause: httpErr });
    const outerErr = new Error('outer', { cause: appErr });

    const result = errorAs(outerErr, HttpError);

    expect(result).toBe(httpErr);
  });

  it('returns null when target is not in chain', () => {
    const err = new AppError({ message: 'app error' });
    const outerErr = new Error('outer', { cause: err });

    const result = errorAs(outerErr, HttpError);

    expect(result).toBeNull();
  });

  it('returns null for non-Error values', () => {
    expect(errorAs('string error', HttpError)).toBeNull();
    expect(errorAs(42, HttpError)).toBeNull();
    expect(errorAs(null, HttpError)).toBeNull();
    expect(errorAs(undefined, HttpError)).toBeNull();
  });
});
