import { NotFound } from "./../error/NotFound";
import { NextFunction, Response } from "express";
import * as taskService from "../services/Task";
import { UUID } from "node:crypto";
import { IUser } from "../interfaces/User";
import crypto from "crypto";
import loggerWithNameSpace from "../utils/logger";
import { BadRequest } from "../error/BadRequest";
import { Request } from "../interfaces/auth";
import { Internal } from "../error/Internal";
const logger = loggerWithNameSpace("TaskController");

export async function getAllTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Getting all tasks");
  const user = req.user;
  if (!user) {
    logger.info("Getting all tasks");
    throw new Internal("User not forwarded by authenticator found");
  }
  const data = await taskService.getAllTasks(user.id);
  if (!data) {
    logger.error("Unable to find tasks");
    next(new NotFound("Unable to find tasks"));
    return;
  }
  if (data.length == 0) {
    logger.warn("Tasks empty");
    res.status(200).json([...data]);
    return;
  }
  logger.info("Tasks found");
  res.status(200).json([...data]);
  return;
}

export async function getTaskById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  const { id } = req.params;
  logger.info(`Getting task with id: ${id}`);
  if (!user) {
    logger.info("Getting all tasks");
    throw new Internal("User not forwarded by authenticator found");
  }
  try {
    const data = await taskService.getTaskById(id as UUID, user.id);
    if (!data) {
      logger.warn(`Task with id: ${id} not found in current user`);
      next(new NotFound(`Task with id: ${id} not found in current user`));
    } else {
      logger.info(`Task with id: ${id} found`);
      res.status(200).json(data);
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Internal Error: getUserInfo", err.message as string);
      next(new Error(err.message));
    }
  }
}

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { detail } = req.body;
  const { user } = req;
  if (!user) {
    logger.info("Getting all tasks");
    throw new Internal("User not forwarded by authenticator found");
  }
  try {
    const data = await taskService.createTask(detail, user.id);

    if (data.data) {
      logger.info("Task created successfully");
      res.status(200).json(data);
      return;
    } else {
      logger.error("Failed to create task");
      next(new Error("Failed to create task"));
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Internal Error: getUserInfo", err.message as string);
      next(new Error(err.message));
    }
  }
}

export async function updateTaskById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const { user } = req;
  if (!user) {
    logger.info("Getting all tasks");
    throw new Internal("User not forwarded by authenticator found");
  }
  const userID = user.id;
  if (!id) {
    logger.error("Id is required");
    next(new BadRequest("Id is required"));
    return;
  }
  const { update } = req.query;
  const { detail, status } = req.body;
  logger.info(`Updating task with id: ${id}`);
  try {
    const result = await taskService.updateTaskById(
      id as UUID,
      update as string,
      userID,
      detail,
      status
    );
    if (result.data) {
      logger.info(`Task with id: ${id} updated successfully`);
      res.status(200).json(result);
      return;
    } else {
      logger.warn(`Failed to update task with id: ${id}`);
      next(new Error(`Failed to update task with id: ${id}`));
      return;
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Internal Error: getUserInfo", err.message as string);
      next(new Error(err.message));
    }
  }
}

export async function deleteTaskById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { user } = req;
  if (!user) {
    logger.info("Getting all tasks");
    throw new Internal("User not forwarded by authenticator found");
  }
  if (!id) {
    logger.error("Id is needed to delete task");
    next(new BadRequest("Id is needed"));
    return;
  }
  logger.info(`Deleting task with id: ${id}`);
  try {
    const result = await taskService.deleteTaskById(id as UUID, user.id);
    if (result.data) {
      logger.info(`Task with id: ${id} deleted successfully`);
      res.status(200).json(result);
      return;
    } else {
      logger.error(`Failed to delete task with id: ${id}`);
      next(new Error(`Failed to delete task with id: ${id}`));
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Internal Error: getUserInfo", err.message as string);
      next(new Error(err.message));
    }
  }
}
