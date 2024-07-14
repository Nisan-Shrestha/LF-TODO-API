import { UUID } from "crypto";
import { ITask, TaskStatus } from "../interfaces/Task";
import fs from "fs/promises";
import path from "node:path";
import e from "express";

const pathToTasks = path.join(__dirname, "../data/tasks.json");

export async function getAllTasks(userID: UUID): Promise<ITask[]> {
  const tasks = await readTasksFromFile();
  return tasks.filter(({ userID: uid }) => uid === userID);
}

export async function getTaskById(taskID: UUID, userID: UUID) {
  try {
    const tasks = await readTasksFromFile();
    const data = tasks.find(
      ({ userID: uid, id: tid }) => uid === userID && tid === taskID
    );
    if (!data) {
      throw new Error(`Task with id:${taskID} not found`);
    }
    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
}

export async function createTask(task: ITask) {
  const tasks = await readTasksFromFile();
  tasks.push(task);
  await writeTasksToFile(tasks);
  return task;
}

export async function updateTask(tid: UUID, detail: string, uid: UUID) {
  const tasks = await readTasksFromFile();
  const task = tasks.find((task) => task.id === tid && task.userID === uid);
  if (!task) return null;
  task.detail = detail;
  return task;
}

export async function updateTaskStatus(tid: UUID, status: string, uid: UUID) {
  const tasks = await readTasksFromFile();
  const task = tasks.find((task) => task.id === tid && task.userID === uid);
  if (!task) return null;
  if (status == "done") task.status = TaskStatus.done;
  if (status == "pending") task.status = TaskStatus.pending;
  if (task.status == TaskStatus.done) {
    task.completedAt = new Date();
  }
  await writeTasksToFile(tasks);
  return task;
}

export async function deleteTask(id: UUID, uid: UUID) {
  const tasks = await readTasksFromFile();
  const taskIndex = tasks.findIndex(
    (task) => task.id === id && task.userID === uid
  );
  if (taskIndex === -1) {
    return null;
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);
  await writeTasksToFile(tasks);

  return deletedTask;
}

async function readTasksFromFile() {
  try {
    const taskData = await fs.readFile(pathToTasks, "utf8");
    const parsedData: ITask[] = JSON.parse(taskData);
    return parsedData;
  } catch (error) {
    throw new Error("Error reading task data");
  }
}

async function writeTasksToFile(task: ITask[]) {
  try {
    const data = JSON.stringify(task);
    await fs.writeFile(pathToTasks, data, "utf8");
  } catch (error) {
    throw new Error("Error Writing task data to file");
  }
}
