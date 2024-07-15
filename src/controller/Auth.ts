import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import config from "../config";
import { Unauthorized } from "../error/Unauthorized";
import { IUser } from "../interfaces/User";
import * as AuthService from "../services/Auth";

import HttpStatusCodes from "http-status-codes";
import loggerWithNameSpace from "../utils/logger";

interface LoginInfo extends Pick<IUser, "email" | "password"> {}
const logger = loggerWithNameSpace("AuthController");

export async function login(
  req: Request<any, any, LoginInfo>,
  res: Response,
  next: NextFunction
) {
  logger.info("Attempted login: ");
  const data = req.body;

  const response = await AuthService.login(data);
  // return;
  if (response) {
    logger.info("Login Successfull");
    res.status(HttpStatusCodes.ACCEPTED).json({
      message: "Login successfull",
      payload: response,
    });
    return;
  }

  // logger.error("Login Failed:");
  // throw new Unauthorized("Login Failed");
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  logger.info("Called refresh to refresh Token");
  const { authorization } = req.headers;

  if (!authorization) {
    logger.error("Refresh token not found in authorization header");
    throw new Unauthorized("Refresh token not found in authorization header");
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    logger.error("Refresh token incorrect.");
    throw new Unauthorized("Refresh token incorrect.");
  }

  verify(token[1], config.jwt.secret!, (error, data) => {
    if (error) {
      logger.error("Token verification error: ", error.message);
      throw new Unauthorized(error.message);
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
