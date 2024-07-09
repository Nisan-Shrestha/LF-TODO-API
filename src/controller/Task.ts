import { Request, Response } from "express";
import * as taskService from "../services/Task";

export function getAllTasks(req: Request, res: Response) {
  res.send(taskService.getAllTasks());
}

export function getTaskById(req: Request, res: Response) {
  const id = req.params.id;
  const data = taskService.getTaskById(id);
  res.json(data);
}

export function createTask(req: Request, res: Response) {
  const detail = req.body.detail;
  if (detail == undefined) {
    res
      .status(400)
      .send(
        'Error: Task "detail" was empty, please data in raw json format in body of the request'
      );
    return;
  }
  const data = taskService.createTask(detail);
  res.send(
    `Task created with detail: ${data.detail} and id: ${data.id} with status: ${data.status}`
  );
}

export function updateTaskById(req: Request, res: Response) {
  const body = req.body;
  const id = req.params.id;

  const data = taskService.updateTaskById(id, body);
  if (data && typeof data !== "string") {
    res.send(
      `Task with id: ${data.id} updated with status: ${data.status} and had detail: ${data.detail}`
    );
  } else res.status(400).send(data);
}

export function deleteTaskById(req: Request, res: Response) {
  const id = req.params.id;
  const deleteSuccess = taskService.deleteTaskById(id);
  if (deleteSuccess) {
    res.send(`Task with id: ${id} deleted successfully`);
  } else res.status(404).send(`Error, could not find task with id: ${id}`);
}
