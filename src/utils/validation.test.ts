import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { formatZodError } from './validation.ts';

function createZodError(
  issues: { message: string; path?: (string | number)[] }[]
): z.ZodError {
  return new z.ZodError(
    issues.map(({ message, path = [] }) => ({
      code: 'custom',
      message,
      path,
      input: undefined
    }))
  );
}

describe('formatZodError', () => {
  it('formats multiple issues with default message', () => {
    const error = createZodError([
      { message: 'is required', path: ['name'] },
      { message: 'must be a number', path: ['age'] }
    ]);

    const result = formatZodError(error);

    expect(result.message).toBe('Invalid body');
    expect(result.details).toEqual([
      'name is required',
      'age must be a number'
    ]);
  });

  it('uses custom error message', () => {
    const error = createZodError([{ message: 'is required', path: ['email'] }]);

    const result = formatZodError(error, {
      errorMessage: 'Invalid query parameters'
    });

    expect(result.message).toBe('Invalid query parameters');
  });

  it('returns single error when preferSingleError is true', () => {
    const error = createZodError([
      { message: 'is required', path: ['name'] },
      { message: 'too short', path: ['bio'] }
    ]);

    const result = formatZodError(error, { preferSingleError: true });

    expect(result.message).toBe('name is required');
    expect(result).not.toHaveProperty('details');
  });

  it('includes path in error details', () => {
    const error = createZodError([
      { message: 'is required', path: ['address', 'street'] }
    ]);

    const result = formatZodError(error);

    expect(result.details).toEqual(['address.street is required']);
  });

  it('handles issues without path', () => {
    const error = createZodError([{ message: 'Invalid input' }]);

    const result = formatZodError(error);

    expect(result.details).toEqual(['Invalid input']);
  });
});
