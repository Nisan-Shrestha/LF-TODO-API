import { ITask, ITask as Task, TaskStatus } from "../interfaces/Task";

const tasks = [
  {
    id: "0",
    detail: "Do the laundry",
    status: TaskStatus.pending,
  },
  {
    id: "1",
    detail: "Read Node.js Docs",
    status: TaskStatus.pending,
  },
  {
    id: "2",
    detail: "Push to Docker",
    status: TaskStatus.done,
  },
];

export function getAllTasks() {
  return tasks;
}

export function getTaskById(id: string) {
  return tasks.find((task) => task.id === id);
}

export function createTask(detail: string): ITask {
  let newId = tasks.length.toString();

  while (tasks.find((task) => task.id === newId) !== undefined) {
    newId = Math.trunc(Math.random() * 1000).toString();
  }

  const newTask = { detail: detail, id: newId, status: TaskStatus.pending };
  tasks.push(newTask);

  return newTask;
}

export function updateTaskById(
  id: string,
  body: { detail: string; status: string }
): ITask | string {
  let taskToUpdate = tasks.find((task) => task.id === id);

  if (taskToUpdate === undefined) {
    return `Error, could not find task with id: ${id}`;
  }

  if (body.status) {
    if (body.status === "done") {
      taskToUpdate.status = TaskStatus.done;
    } else if (body.status === "pending") {
      taskToUpdate.status = TaskStatus.pending;
    } else {
      return `Error, invalid status: ${body.status} ,  send 'done' or 'pending' as status in body of the request`;
    }
  }

  if (body.detail) {
    taskToUpdate.detail = body.detail;
  }

  return taskToUpdate;
}

export function deleteTaskById(id: string): boolean {
  let taskToDelete = tasks.find((task) => task.id === id);

  if (taskToDelete === undefined) {
    return false;
  }
  const taskIndex = tasks.indexOf(taskToDelete);
  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  return true;
}
