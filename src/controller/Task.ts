import { NotFound } from "./../error/NotFound";
import { NextFunction, Request, Response } from "express";
import * as taskService from "../services/Task";
import { UUID } from "node:crypto";
import { IUser } from "../interfaces/User";
import crypto from "crypto";
import loggerWithNameSpace from "../utils/logger";
import { BadRequest } from "../error/BadRequest";

const logger = loggerWithNameSpace("TaskController");

export async function getAllTasks(req: any, res: Response, next: NextFunction) {
  const user = req.user;
  logger.info("Getting all tasks");
  try {
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
  } catch (e) {
    if (e instanceof Error) {
      logger.error("Internal Error: getUserInfo", e.message as string);
      next(new Error(e.message));
    }
  }
}

export async function getTaskById(req: any, res: Response, next: NextFunction) {
  const user = req.user;
  const { id: tid } = req.params;
  logger.info(`Getting task with id: ${tid}`);

  const data = await taskService.getTaskById(tid, user.id);
  try {
    if (!data) {
      logger.warn(`Task with id: ${tid} not found in current user`);
      next(new NotFound(`Task with id: ${tid} not found in current user`));
    } else {
      logger.info(`Task with id: ${tid} found`);
      res.status(200).json(data);
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Internal Error: getUserInfo", err.message as string);
      next(new Error(err.message));
    }
  }
}

export async function createTask(req: any, res: Response, next: NextFunction) {
  const { body } = req;
  if (!req.body.detail) {
    logger.error("Task detail missing");
    next(new BadRequest("Task detail is required"));
  }

  const { detail } = body;
  const { user } = req;

  try {
    const data = await taskService.createTask(detail as string, user.id);

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
  req: any,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const {
    user: { id: userID },
  } = req;
  if (!id) {
    logger.error("Id is required");
    next(new BadRequest("Id is required"));
    return;
  }
  const { query } = req;
  const { detail, status } = req.body;
  logger.info(`Updating task with id: ${id}`);
  try {
    const result = await taskService.updateTaskById(
      id as UUID,
      String(query.update),
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
  req: any,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { user } = req;
  if (!id) {
    logger.error("Id is needed to delete task");
    next(new BadRequest("Id is needed"));
    return;
  }
  logger.info(`Deleting task with id: ${id}`);
  try {
    const result = await taskService.deleteTaskById(id, user.id);
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
