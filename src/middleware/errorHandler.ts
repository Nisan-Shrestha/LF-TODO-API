import { Internal } from "./../error/Internal";
import { NextFunction, Response } from "express";

import { Request } from "../interfaces/auth";

import HttpStatusCodes from "http-status-codes";
import { Forbidden } from "../error/Forbidden";
import loggerWithNameSpace from "../utils/logger";
import { Unauthorized } from "../error/Unauthorized";
import { BadRequest } from "../error/BadRequest";
import { NotFound } from "../error/NotFound";
import { Conflict } from "../error/Conflict";

const logger = loggerWithNameSpace("ErrorHandler");

export function notFoundError(req: Request, res: Response) {
  return res.status(HttpStatusCodes.NOT_FOUND).json({
    message: "Not Found",
  });
}

export function genericErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.stack) {
    logger.error(error.stack);
  }
  let statusCode: number;
  let errorMsg: string;

  switch (true) {
    case error instanceof Unauthorized:
      statusCode = HttpStatusCodes.UNAUTHORIZED;
      errorMsg = error.message;
      break;
    case error instanceof Forbidden:
      statusCode = HttpStatusCodes.FORBIDDEN;
      errorMsg = error.message;
      break;
    case error instanceof BadRequest:
      statusCode = HttpStatusCodes.BAD_REQUEST;
      errorMsg = error.message;
      break;
    case error instanceof NotFound:
      statusCode = HttpStatusCodes.NOT_FOUND;
      errorMsg = error.message;
      break;
    case error instanceof Conflict:
      statusCode = HttpStatusCodes.CONFLICT;
      errorMsg = error.message;
      break;
    default:
      statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
      errorMsg = "Internal Server Error" + error.message;
  }

  return res.status(statusCode).json({
    message: errorMsg,
  });
  return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
  });
}
