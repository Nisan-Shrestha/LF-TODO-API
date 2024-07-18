import { NotFound } from "./../error/NotFound";
import { Response } from "express";
import * as taskService from "../services/Task";
import { UUID } from "node:crypto";
import loggerWithNameSpace from "../utils/logger";
import { BadRequest } from "../error/BadRequest";
import { Request } from "../interfaces/auth";
import { Internal } from "../error/Internal";
import { GetTaskQuery } from "../interfaces/Task";
const logger = loggerWithNameSpace("TaskController");

export async function getAllTasks(
  req: Request<any, any, any, GetTaskQuery>,
  res: Response
) {
  logger.info("Getting all tasks");
  const user = req.user;
  const { query } = req;

  if (!user) {
    logger.info("Getting all tasks");
    throw new Internal("User not forwarded by authenticator found");
  }
  const data = await taskService.getAllTasks(user.id, query);
  if (!data) {
    logger.error("Unable to find tasks");
    throw new NotFound("Unable to find tasks");
  }
  if (data.data.length == 0) logger.warn("Tasks empty");
  else logger.info("Tasks found");

  res.status(200).json([...data.data]);
  return;
}

export async function getTaskById(req: Request, res: Response) {
  const user = req.user;
  const { id } = req.params;
  logger.info(`Getting task with id: ${id}`);
  if (!user) {
    logger.info("Getting all tasks");
    throw new Internal("User not forwarded by authenticator found");
  }
  const data = await taskService.getTaskById(id as UUID, user.id);
  if (!data) {
    logger.error(`Task with id: ${id} not found in current user`);
    throw new NotFound(`Task with id: ${id} not found in current user`);
  } else {
    logger.info(`Task with id: ${id} found`);
    res.status(200).json(data);
  }
}

export async function createTask(req: Request, res: Response) {
  const { detail } = req.body;
  const { user } = req;
  if (!user) {
    logger.info("Getting all tasks");
    throw new Internal("User not forwarded by authenticator found");
  }
  const data = await taskService.createTask(detail, user.id);
  if (data.data) {
    logger.info("Task created successfully");
    res.status(200).json(data);
    return;
  } else {
    logger.error("Failed to create task");
    throw new Error("Failed to create task");
  }
}

export async function updateTaskById(req: Request, res: Response) {
  const { id } = req.params;

  const { user } = req;
  if (!user) {
    logger.info("Getting all tasks");
    throw new Internal("User not forwarded by authenticator found");
  }
  const userId = user.id;
  if (!id) {
    logger.error("Id is required");
    throw new BadRequest("Id is required");
  }
  const { update } = req.query;
  const { detail, status } = req.body;
  logger.info(`Updating task with id: ${id}`);
  const result = await taskService.updateTaskById(
    id as UUID,
    update as string,
    userId,
    detail,
    status
  );
  if (result.data) {
    logger.info(`Task with id: ${id} updated successfully`);
    res.status(200).json(result);
    return;
  } else {
    logger.error(`Failed to update task with id: ${id}`);
    throw new Error(`Failed to update task with id: ${id}`);
  }
}

export async function deleteTaskById(req: Request, res: Response) {
  const { id } = req.params;
  const { user } = req;
  if (!user) {
    logger.info("Getting all tasks");
    throw new Internal("User not forwarded by authenticator found");
  }
  if (!id) {
    logger.error("Id is needed to delete task");
    throw new BadRequest("Id is needed");
  }
  logger.info(`Deleting task with id: ${id}`);
  const result = await taskService.deleteTaskById(id as UUID, user.id);
  if (result.data) {
    logger.info(`Task with id: ${id} deleted successfully`);
    res.status(200).json(result);
    return;
  } else {
    logger.error(`Failed to delete task with id: ${id}`);
    throw new Error(`Failed to delete task with id: ${id}`);
  }
}
