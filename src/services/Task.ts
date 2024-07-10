import { ITask, TaskStatus } from "../interfaces/Task";
import * as taskModel from "../models/Task";
import { UUID } from "node:crypto";
import crypto from "crypto";

export async function getAllTasks(userID: UUID) {
  return await taskModel.getAllTasks(userID);
}

export async function getTaskById(tid: UUID, uid: UUID) {
  const data = taskModel.getTaskById(tid, uid);
  if (!data) {
    return { error: `Task with id:${tid} not found for current user` };
  }
  return data;
}

export async function createTask(detail: string, uid: UUID) {
  const task: ITask = {
    id: crypto.randomUUID(),
    detail: detail,
    userID: uid,
    createdAt: new Date(),
    status: TaskStatus.pending,
    completedAt: null,
  };
  const data = await taskModel.createTask(task);
  if (data) {
    return {
      message: "Task created successfully",
      data,
    };
  } else {
    return {
      message: "Failed to create Task",
      data,
    };
  }
}

export async function updateTaskById(
  tid: UUID,
  query: string,
  uid: UUID,
  detail?: string,
  status?: string
): Promise<{ message: string; data: ITask | null }> {
  let data: ITask | null = null;
  if (
    query === "status" &&
    status &&
    (status === "done" || status == "pending")
  ) {
    data = await taskModel.updateTaskStatus(tid, status, uid);
  } else if (query === "detail" && typeof detail === "string") {
    data = await taskModel.updateTask(tid, detail, uid);
  }
  if (data) {
    return {
      message: "Update Sucessfull",
      data,
    };
  } else {
    return {
      message: "Update Failed",
      data,
    };
  }
}

export async function deleteTaskById(
  tid: UUID,
  uid: UUID
): Promise<{
  message: string;
  data: ITask | null;
}> {
  const data = await taskModel.deleteTask(tid, uid);
  if (data) {
    return {
      message: "Successfully deleted",
      data,
    };
  } else {
    return {
      message: "Failed to Delete",
      data,
    };
  }
}
