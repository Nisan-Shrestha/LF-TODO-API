import { ITask } from "../interfaces/Task";
import * as taskModel from "../models/Task";

export function getAllTasks() {
  return taskModel.getAllTasks();
}

export function getTaskById(id: string) {
  const data = taskModel.getTaskById(id);
  if (!data) {
    return { error: `Task with id:${id} not found` };
  }
  return data;
}

export function createTask(detail: string) {
  return taskModel.createTask(detail);
}

export function updateTaskById(
  id: string,
  body: { detail: string; status: string }
) {
  return taskModel.updateTaskById(id, body);
}
export function deleteTaskById(id: string) {
  return taskModel.deleteTaskById(id);
}
