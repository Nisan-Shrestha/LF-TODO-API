import { Request, Response } from "express";
import * as taskService from "../services/Task";
import { UUID } from "node:crypto";
import { IUser } from "../interfaces/User";
import crypto from "crypto";
export async function getAllTasks(req: any, res: Response) {
  const user = req.user;
  const data = await taskService.getAllTasks(user.id);
  if (!data) {
    res.status(404).json({
      message: "No tasks found",
    });
  } else {
    res.status(200).json([...data]);
  }
}

export async function getTaskById(req: any, res: Response) {
  const user = req.user;
  const { id: tid } = req.params;

  const data = await taskService.getTaskById(tid, user.id);
  if (!data) {
    res.status(404).json({
      message: `Task with id: ${tid} not found in current user`,
    });
  } else {
    res.status(200).json(data);
  }
}

export async function createTask(req: any, res: Response) {
  const { body } = req;
  if (!req.body.detail) {
    res.status(404).json({
      message: "Task detail missing",
    });
  }
  const { detail } = body;
  const { user } = req;

  const data = await taskService.createTask(detail as string, user.id);
  if (data.data) {
    res.status(200).json(data);
  } else {
    res.status(404).json(data);
  }
}

export async function updateTaskById(req: any, res: Response) {
  const { id } = req.params;
  const {
    user: { id: userID },
  } = req;
  if (!id) {
    res.status(404).json({
      error: "Id is required",
    });
    return;
  }
  const { query } = req;
  const { detail: detail, status: status } = req.body;
  const result = await taskService.updateTaskById(
    id as UUID,
    String(query.update),
    userID,
    detail,
    status
  );
  if (result.data) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
}

export async function deleteTaskById(req: any, res: Response) {
  const { id } = req.params;
  const { user } = req;
  if (!id) {
    res.status(404).json({
      error: "Id is needed",
    });
    return;
  }
  const result = await taskService.deleteTaskById(id, user.id);
  if (result.data) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
}
