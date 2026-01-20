type HttpErrorOptions = {
  message: string;
  details?: string[];
};

export class HttpError extends Error {
  public statusCode: number;
  public details: string[];

  public constructor(
    statusCode: number,
    { message, details = [] }: HttpErrorOptions
  ) {
    super(message);

    this.details = details;
    this.statusCode = statusCode;
  }
}

export class AppError extends Error {
  public constructor(message: string) {
    super(message);
  }
}

export class FatalError extends Error {
  public constructor(message: string) {
    super(message);
  }
}

export function errorAs<T extends Error>(
  err: Error,
  targetErr: new (...args: never[]) => T
): T | null {
  let currentErr = err;

  while (currentErr instanceof Error) {
    if (currentErr instanceof targetErr) return currentErr;

    currentErr = currentErr.cause as Error;
  }

  return null;
}
