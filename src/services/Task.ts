import { GetTaskQuery, ITask, TaskStatus } from "../interfaces/Task";
import * as taskModel from "../models/Task";
import { UUID } from "node:crypto";
import crypto from "crypto";
import { NotFound } from "../error/NotFound";
import { Internal } from "../error/Internal";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("TaskService");

export async function getAllTasks(userId: UUID, filter: GetTaskQuery) {
  logger.info(`Getting all tasks for user with ID: ${userId}`);
  let data = await taskModel.TaskModel.getAllTasks(userId, filter);
  const count = await taskModel.TaskModel.count(userId);

  const meta = {
    page: filter.page,
    size: data.length,
    total: +count.count,
  };

  logger.info(
    `Retrieved ${data.length} tasks of total ${ count} for user with ID: ${userId}`
  );
  // return data;
  return { data, meta };
}

export async function getTaskById(tid: UUID, uid: UUID) {
  logger.info(`Getting task with ID: ${tid} for user with ID: ${uid}`);
  const data = taskModel.TaskModel.getTaskById(tid, uid);
  if (!data) {
    logger.error(`Task with ID: ${tid} not found for user with ID: ${uid}`);
    throw new NotFound(`Task with id: ${tid} not found for current user`);
  }
  return data;
}

export async function createTask(detail: string, uid: UUID) {
  logger.info(`Creating task for user with ID: ${uid}`);
  const task: ITask = {
    taskId: crypto.randomUUID(),
    detail: detail,
    userID: uid,
    createdAt: new Date(),
    status: TaskStatus.pending,
    updatedAt: null,
  };
  const data = await taskModel.TaskModel.createTask(task);
  if (!!data) {
    logger.info(`Task created successfully with ID: ${data.taskId}`);
    return {
      message: "Task created successfully",
      data,
    };
  } else {
    logger.error("Failed to create Task");
    throw new Internal("Failed to create Task");
  }
}

export async function updateTaskById(
  tid: UUID,
  update: string,
  uid: UUID,
  detail?: string,
  status?: string
): Promise<{ message: string; data: ITask | null }> {
  logger.info(`Updating task with ID: ${tid} for user with ID: ${uid}`);
  let data: ITask | null = null;
  if (
    update === "status" &&
    status &&
    (status === "done" || status == "pending")
  ) {
    data = await taskModel.TaskModel.updateTaskStatus(tid, status, uid);
  } else if (update === "detail" && typeof detail === "string") {
    data = await taskModel.TaskModel.updateTask(tid, detail, uid);
  }
  if (data) {
    logger.info(`Task with ID: ${tid} updated.`);
    if (detail && data.detail != detail) {
      logger.warn(
        `Task detail incorrectly updated or failed to update: sent: ${detail}, set: ${data.detail}`
      );
    }
    if (status && data.status != TaskStatus[status]) {
      logger.warn(
        `Task status incorrectly updated or failed to update:  sent: ${status}, set: ${TaskStatus[status]}`
      );
    }
    return {
      message: "Task updated successfully",
      data,
    };
  } else if (data === null) {
    logger.error(`Task with id: ${tid} not found for current user`);

    logger.error("Failed to delete task");
    throw new NotFound(`Task with id: ${tid} not found for current user`);
  } else {
    logger.error("Failed to update task");
    throw new Internal("Failed to update");
  }
}

export async function deleteTaskById(
  tid: UUID,
  uid: UUID
): Promise<{
  message: string;
  data: ITask | null;
}> {
  logger.info(`Deleting task with ID: ${tid} for user with ID: ${uid}`);
  const data = await taskModel.TaskModel.deleteTask(tid, uid);
  if (data) {
    logger.info(`Task with ID: ${tid} deleted successfully`);
    return {
      message: "Successfully deleted",
      data,
    };
  } else if (data === null) {
    logger.error(`Task with id: ${tid} not found for current user`);

    logger.error("Failed to delete task");
    throw new NotFound(`Task with id: ${tid} not found for current user`);
  } else {
    logger.error("Failed to delete task");
    throw new Internal("Failed to delete");
  }
}
