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

export class FatalError extends Error {
  public constructor(message: string) {
    super(message);
  }
}
