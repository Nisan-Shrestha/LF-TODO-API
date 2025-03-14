import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { BadRequest } from "../error/BadRequest";

export function validateReqQuery(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      next(new BadRequest(error.message));
    }
    req.query = value;
  };
}

export function validateReqBody(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      next(new BadRequest(error.message));
    }
    req.body = value;
  };
}

export function validateReqParams(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params);

    if (error) {
      next(new BadRequest(error.message));
    }
    req.params = value;
  };
}
export function validateReqHeader(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.headers);

    if (error) {
      next(new BadRequest(error.message));
    }
    req.headers = value;
  };
}
export function validateAuthenticatedUser(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.headers);

    if (error) {
      next(new BadRequest(error.message));
    }
    req.headers = value;
  };
}
