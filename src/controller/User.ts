import { Response } from "express";
import * as UserService from "../services/User";
import { UUID } from "crypto";
import { IUser } from "../interfaces/User";
import { Request } from "../interfaces/auth";
import loggerWithNameSpace from "../utils/logger";
import HttpStatusCodes from "http-status-codes";

const logger = loggerWithNameSpace("UserController");

export async function getUserInfo(req: Request, res: Response) {
  const { id } = req.params;
  logger.info("Called getUserInfo");

  if (!id) {
    logger.error("ID not found in getUserInfo");
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: "id is required as query param",
    });
    return;
  }
  try {
    const service_response = await UserService.getUserInfo(id as UUID);
    if (!service_response) {
      logger.error("User not found in getUserInfo");
      res.status(HttpStatusCodes.NOT_FOUND).json({
        error: "Could not find the user",
      });
      return;
    }
    res.status(HttpStatusCodes.ACCEPTED).json(service_response);
  } catch (e) {
    if (e instanceof Error) {
      logger.error("Internal Error: getUserInfo", e.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: e.message,
      });
    }
  }
}

export async function getAllUser(req: Request, res: Response) {
  logger.info("Called getAllUser");

  try {
    const service_response = await UserService.getAllUser();
    if (!service_response) {
      logger.error("User not found in getAllUser");
      res.status(HttpStatusCodes.NOT_FOUND).json({
        error: "Could not find users",
      });
      return;
    }
    res.status(HttpStatusCodes.ACCEPTED).json(service_response);
  } catch (e) {
    if (e instanceof Error) {
      logger.error("Internal Error: getAllUser", e.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: e.message,
      });
    }
  }
}

export async function createUser(req: Request, res: Response) {
  const { body } = req;
  const { email, password, name } = body;
  logger.info("Called createUser");

  if (!email || !password || !name) {
    logger.error("BAD request in createUser");
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: "At least one of email, password, name is missing",
    });
    return;
  }
  try {
    const data = await UserService.createuser(body);
    if (data) {
      logger.info("User Created");
      res.status(HttpStatusCodes.CREATED).json({
        message: "User created Successfully",
        data,
      });
    }
    throw Error("Could not create user");
  } catch (e) {
    if (e instanceof Error) {
      logger.error("Internal Error: createUser", e.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: e.message,
      });
    }
  }
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.query;
  const { body } = req;
  logger.info("Called updateUser");
  
  if (!id) {
    logger.error("ID not present: updateUser");
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: "ID not present in the request query params",
    });
    return;
  }
  try {
    const data = await UserService.updateUser(id as UUID, body);
    if (data) {
      res.status(HttpStatusCodes.ACCEPTED).json(data);
    }
    
    throw Error("Could not update User");
  } catch (e) {
    if (e instanceof Error) {
      logger.error("Internal Error: updateUser", e.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: e.message,
      });
    }
  }
}

export async function deleteUser(req: Request, res: Response) {
  logger.info("Called deleteUser");
  const { id } = req.query;
  if (!id) {
    logger.error("ID missing in deleteuser");
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: "ID not present in the request query params",
    });
    return;
  }
  try {
    const service_response = await UserService.deleteUser(id as UUID);
    res.status(HttpStatusCodes.ACCEPTED).json(service_response);
  } catch (e) {
    if (e instanceof Error) {
      logger.error("Internal Error: deleteUser", e.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: e.message,
      });
    }
  }
}
