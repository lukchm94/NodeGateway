import { HttpStatusCode } from "axios";

export class HttpError extends Error {
  message: any;

  status?: number;

  internalError?: Error;

  public static fromError(error: Error): HttpError {
    if (error instanceof HttpError) {
      return error;
    }
    return new HttpError(
      error.message,
      HttpStatusCode.InternalServerError,
      error
    );
  }

  constructor(message: any, status?: number, error?: Error) {
    super(message);
    this.status = status ? status : HttpStatusCode.InternalServerError;
    this.message = message;
    this.internalError = error ? error : new Error("Default error msg");
    if (error?.stack) this.stack = error.stack;
  }
}

export class InternalError extends HttpError {
  constructor(error?: Error) {
    super("Internal error", HttpStatusCode.InternalServerError, error);
  }
}

export class NotFoundError extends HttpError {
  constructor(message?: any) {
    super(message || "No object found", HttpStatusCode.NotFound, undefined);
  }
}

export class ValidationError extends HttpError {
  constructor(error: Error, customMessage?: string) {
    super(customMessage || error.message, HttpStatusCode.BadRequest, error);
  }
}
