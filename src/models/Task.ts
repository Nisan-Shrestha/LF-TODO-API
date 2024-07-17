import { UUID } from "crypto";
import { GetTaskQuery, ITask, TaskStatus } from "../interfaces/Task";
import fs from "fs/promises";
import path from "node:path";
import e from "express";
import { NotFound } from "../error/NotFound";
import { BaseModel } from "./base";
import { IUser } from "../interfaces/User";
import { BadRequest } from "../error/BadRequest";

const pathToTasks = path.join(__dirname, "../data/tasks.json");

export class TaskModel extends BaseModel {
  // static async create(user: IUser) {
  //   const userToCreate = {
  //     name: user.name,
  //     email: user.email,
  //     password: user.password,
  //   };

  // }
  static count(userId: UUID) {
    const query = this.queryBuilder()
      .count("*")
      .table("tasks")
      .where("userId", userId)
      .first();
    return query;
  }

  static async getAllTasks(userId: UUID, filter: GetTaskQuery) {
    let query = this.queryBuilder()
      .select("*")
      .table("tasks")
      .limit(filter.size)
      .offset((filter.page - 1) * filter.size)
      .where("userId", userId);
    return query;
  }

  static async getTaskById(taskId: UUID, userId: UUID) {
    let query = this.queryBuilder()
      .select("*")
      .table("tasks")
      .where(`taskId = '${taskId}' AND userId = '${userId}'`)
      .first();
    await query;
    if (!query) {
      throw new NotFound(`Task with id: ${taskId} not found`);
    }
    return query;
  }

  static async createTask(task: ITask) {
    await this.queryBuilder().insert(task).table("tasks");
    return task;
  }

  static async updateTask(tid: UUID, detail: string, uid: UUID) {
    let taskToUpdate = await this.queryBuilder()
      .select("*")
      .table("tasks")
      .where(`taskId = '${tid}' AND userId = '${uid}'`)
      .first();
    if (!taskToUpdate) {
      throw new BadRequest(`User with id ${tid} not found`);
    }

    taskToUpdate = { ...taskToUpdate, detail: detail, updatedAt: new Date() };

    const query = this.queryBuilder()
      .update(taskToUpdate)
      .table("tasks")
      .where(`taskId = '${tid}' AND userId = '${uid}'`);

    await query;
    return taskToUpdate;
  }

  static async updateTaskStatus(tid: UUID, status: string, uid: UUID) {
    let taskToUpdate = await this.queryBuilder()
      .select("*")
      .table("tasks")
      .where(`taskId = '${tid}' AND userId = '${uid}'`)
      .first();
    if (!taskToUpdate) {
      throw new BadRequest(`User with id ${tid} not found`);
    }
    let changedStatus;
    if (status == "done") changedStatus = TaskStatus.done;
    if (status == "pending") changedStatus = TaskStatus.pending;

    taskToUpdate = {
      ...taskToUpdate,
      status: changedStatus,
      updatedAt: new Date(),
    };
    const query = this.queryBuilder()
      .update(taskToUpdate)
      .table("tasks")
      .where(`taskId = '${tid}' AND userId = '${uid}'`);

    await query;
    return taskToUpdate;
  }
  static async deleteTask(id: UUID, uid: UUID) {
    let taskToDelete = await this.queryBuilder()
      .select("*")
      .table("tasks")
      .first()
      .where(`taskId = '${id}' AND userId = '${uid}'`);
    if (!taskToDelete) return null;
    let Response = await this.queryBuilder()
      .delete()
      .table("tasks")
      .where(`taskId = '${id}' AND userId = '${uid}'`);

    if (!!Response) return taskToDelete;
  }
}
