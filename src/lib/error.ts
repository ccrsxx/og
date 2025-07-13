type HttpErrorOptions = {
  message: string;
  errors?: Record<string, string>;
};

export class HttpError extends Error {
  public statusCode: number;
  public errors?: Record<string, string>;

  public constructor(
    statusCode: number,
    { message, errors }: HttpErrorOptions
  ) {
    super(message);

    this.errors = errors;
    this.statusCode = statusCode;
  }
}
