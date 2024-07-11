import { Unauthorized } from "../error/Unauthorized";
import { NextFunction, Request, Response } from "express";
import * as AuthService from "../services/Auth";
import { IUser } from "../interfaces/User";
import { sign, verify } from "jsonwebtoken";
import config from "../config";
import { BaseError } from "../error/BaseError";
import { Forbidden } from "../error/Forbidden";
import HttpStatusCodes from "http-status-codes";
import { error } from "console";
import loggerWithNameSpace from "../utils/logger";

interface LoginInfo extends Pick<IUser, "email" | "password"> {}
const logger = loggerWithNameSpace("AuthController");

export async function login(
  req: Request<any, any, LoginInfo>,
  res: Response,
  next: NextFunction
) {
  logger.info("Called login");
  const data = req.body;

  try {
    const response = await AuthService.login(data);

    if (response) {
      logger.info("Login Successfull");
      res.status(HttpStatusCodes.ACCEPTED).json({
        message: "Login successfull",
        payload: response,
      });
      return;
    }

    logger.error("Login Failed:");
    next(new Unauthorized("Unauthenticated"));
    return;
  } catch (e) {
    if (e instanceof Error) {
      logger.error("Internal Error:", e.message);
      next(e);
    }
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  logger.info("Called refresh to refresh Token");
  const { authorization } = req.headers;

  if (!authorization) {
    logger.error("Refresh token not found in authorization header");
    next(new Unauthorized("Refresh token not found in authorization header"));
    return;
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    logger.error("Refresh token incorrect.");
    next(new Unauthorized("Refresh token incorrect."));

    return;
  }

  verify(token[1], config.jwt.secret!, (error, data) => {
    if (error) {
      logger.error("Token verification error: ", error.message);
      next(new Unauthorized(error.message));
    }

    if (typeof data !== "string" && data) {
      const payload = {
        id: data.id,
        name: data.name,
        email: data.email,
        permissions: data.permissions,
      };
      const accessToken = sign(payload, config.jwt.secret!);
      const refreshToken = token[1];

      logger.info("Token Refresh successfull:");
      res.status(HttpStatusCodes.ACCEPTED).json({
        accessToken,
        refreshToken,
      });
    }
  });
}
