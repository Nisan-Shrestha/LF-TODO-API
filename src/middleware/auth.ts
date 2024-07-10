import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";
import config from "../config";

export function auth(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new Error("Unauthenticated"));
    return;
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    next(new Error("Unauthenticated"));
    return;
  }

  verify(token[1], config.jwt.secret!, (error, data) => {
    if (error) {
      next( new Error(error.message));
    }

    (req as any).user = data;
    next();
  });
}
