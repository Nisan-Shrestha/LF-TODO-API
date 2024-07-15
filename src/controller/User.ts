import { NextFunction, Response } from "express";
import * as UserService from "../services/User";
import { UUID } from "crypto";
import { IUser } from "../interfaces/User";
import { Request } from "../interfaces/auth";
import loggerWithNameSpace from "../utils/logger";
import HttpStatusCodes from "http-status-codes";
import { BadRequest } from "../error/BadRequest";
import { NotFound } from "../error/NotFound";
import { Conflict } from "../error/Conflict";
const logger = loggerWithNameSpace("UserController");

export async function getUserInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  logger.info("Called getUserInfo");

  if (!id) {
    logger.error("ID not found in getUserInfo");
    throw new BadRequest("ID is required as query param");
    return;
  }

  const service_response = await UserService.getUserInfo(id as UUID);
  if (!service_response) {
    logger.error("User not found in getUserInfo");
    throw new NotFound("Could not find user with given id");
    return;
  }
  logger.info("200 Response sent from getUserInfo");
  res.status(HttpStatusCodes.ACCEPTED).json(service_response);
}

export async function getAllUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Called getAllUser");

  const service_response = await UserService.getAllUser();
  if (!service_response) {
    logger.warn("User not found in getAllUser");
    throw new NotFound("Could not find users");
  }
  logger.info("200 Response sent from getAllUser");
  res.status(HttpStatusCodes.ACCEPTED).json(service_response);
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body } = req;
  const { email, password, name } = body;
  logger.info("Called createUser");

  if (!email || !password || !name) {
    logger.error("BAD request in createUser");
    throw new BadRequest("At least one of email, password, name is missing");
  }

  const data = await UserService.createuser(body);
  if (data) {
    logger.info("User Created");
    throw new Conflict("User already exists");
  }
  throw Error("Could not create user");
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.query;
  const { body } = req;
  logger.info("Called updateUser");

  if (!id) {
    logger.error("ID not present: updateUser");
    throw new BadRequest("ID is required as query param");
  }

  const data = await UserService.updateUser(id as UUID, body);
  if (data) {
    res.status(HttpStatusCodes.ACCEPTED).json(data);
  }

  throw Error("Could not update User");
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Called deleteUser");
  const { id } = req.query;
  if (!id) {
    logger.error("ID missing in deleteuser");
    throw new BadRequest("ID is required as query param");
  }

  const service_response = await UserService.deleteUser(id as UUID);
  res.status(HttpStatusCodes.ACCEPTED).json(service_response);
}
