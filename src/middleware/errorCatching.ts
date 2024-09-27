import express, { Request, Response, NextFunction } from "express";

const app = express();

class ValidationError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: "Error: 500. Unexpected error" });
}

export {errorHandler};
export {app as appErrorCathing};

