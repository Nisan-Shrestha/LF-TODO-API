import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";
import { verify } from "jsonwebtoken";
import config from "../config";
import { IUser } from "../interfaces/User";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new Error("Unauthenticated");
    return;
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    throw new Error("Unauthenticated");
    return;
  }

  verify(token[1], config.jwt.secret!, (error, data) => {
    if (error) {
      throw new Error(error.message);
    }

    req.user = data as IUser;
  });
}

export function authorize(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;
    console.log("aksndkansdknasd: " + user.permissions + user.permissions.split(",").includes(permission));
    if (!user.permissions.split(",").includes(permission)) {
      console.log("qweqweyquwe")
      next(new Error("Forbidden"));
    }

  };
}
