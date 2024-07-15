import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
} from "../../../services/Task";
import expect from "expect";
import sinon from "sinon";

import * as TaskModel from "../../../models/Task";
import { ITask, TaskStatus } from "../../../interfaces/Task";
import { UUID } from "crypto";
import { NotFound } from "../../../error/NotFound";
import { Internal } from "../../../error/Internal";

describe("Task Service Test Suite", () => {
  describe("getAllTasks", () => {
    let taskModelGetAllTasksStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelGetAllTasksStub = sinon.stub(TaskModel, "getAllTasks");
    });

    afterEach(() => {
      taskModelGetAllTasksStub.restore();
    });

    it("Should return all tasks for a user", async () => {
      const tasks: ITask[] = [
        {
          id: "1" as UUID,
          detail: "Task 1",
          userID: "user1" as UUID,
          createdAt: new Date(),
          status: TaskStatus.pending,
          completedAt: null,
        },
      ];
      taskModelGetAllTasksStub.returns(tasks);
      const res = await getAllTasks("user1" as UUID);
      expect(res).toStrictEqual(tasks);
    });
  });

  describe("getTaskById", () => {
    let taskModelGetTaskByIdStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelGetTaskByIdStub = sinon.stub(TaskModel, "getTaskById");
    });

    afterEach(() => {
      taskModelGetTaskByIdStub.restore();
    });

    it("Should throw error when task is not found", async () => {
      taskModelGetTaskByIdStub.returns(undefined);

      await expect(() => getTaskById("100" as UUID, "user1" as UUID)).rejects.toThrow(
        new NotFound("Task with id: 100 not found for current user")
      );
    });

    it("Should return the task when task is found", async () => {
      const task: ITask = {
        id: "1" as UUID,
        detail: "Task 1",
        userID: "user1" as UUID,
        createdAt: new Date(),
        status: TaskStatus.pending,
        completedAt: null,
      };
      taskModelGetTaskByIdStub.returns(task);
      const res = await getTaskById("1" as UUID, "user1" as UUID);
      expect(res).toStrictEqual(task);
    });
  });

  describe("createTask", () => {
    let taskModelCreateTaskStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelCreateTaskStub = sinon.stub(TaskModel, "createTask");
    });

    afterEach(() => {
      taskModelCreateTaskStub.restore();
    });

    it("Should create and return a new task", async () => {
      const task: ITask = {
        id: "1" as UUID,
        detail: "Task 1",
        userID: "user1" as UUID,
        createdAt: new Date(),
        status: TaskStatus.pending,
        completedAt: null,
      };
      taskModelCreateTaskStub.returns(task);
      const res = await createTask("Task 1", "user1" as UUID);
      expect(res).toStrictEqual({ message: "Task created successfully", data: task });
    });

    it("Should throw an error if task creation fails", async () => {
      taskModelCreateTaskStub.returns(null);

      await expect(() => createTask("Task 1", "user1" as UUID)).rejects.toThrow(
        new Internal("Failed to create Task")
      );
    });
  });

  describe("updateTaskById", () => {
    let taskModelUpdateTaskStub: sinon.SinonStub;
    let taskModelUpdateTaskStatusStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelUpdateTaskStub = sinon.stub(TaskModel, "updateTask");
      taskModelUpdateTaskStatusStub = sinon.stub(TaskModel, "updateTaskStatus");
    });

    afterEach(() => {
      taskModelUpdateTaskStub.restore();
      taskModelUpdateTaskStatusStub.restore();
    });

    it("Should update task detail and return updated task", async () => {
      const task: ITask = {
        id: "1" as UUID,
        detail: "Updated Task 1",
        userID: "user1" as UUID,
        createdAt: new Date(),
        status: TaskStatus.pending,
        completedAt: null,
      };
      taskModelUpdateTaskStub.returns(task);
      const res = await updateTaskById("1" as UUID, "detail", "user1" as UUID, "Updated Task 1");
      expect(res).toStrictEqual({ message: "Task updated successfully", data: task });
    });

    it("Should update task status and return updated task", async () => {
      const task: ITask = {
        id: "1" as UUID,
        detail: "Task 1",
        userID: "user1" as UUID,
        createdAt: new Date(),
        status: TaskStatus.done,
        completedAt: new Date(),
      };
      taskModelUpdateTaskStatusStub.returns(task);
      const res = await updateTaskById("1" as UUID, "status", "user1" as UUID, undefined, "done");
      expect(res).toStrictEqual({ message: "Task updated successfully", data: task });
    });

    it("Should throw an error when task is not found", async () => {
      taskModelUpdateTaskStub.returns(null);

      await expect(() =>
        updateTaskById("100" as UUID, "detail", "user1" as UUID, "Updated Task 1")
      ).rejects.toThrow(new NotFound("Task with id: 100 not found for current user"));
    });
  });

  describe("deleteTaskById", () => {
    let taskModelDeleteTaskStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelDeleteTaskStub = sinon.stub(TaskModel, "deleteTask");
    });

    afterEach(() => {
      taskModelDeleteTaskStub.restore();
    });

    it("Should delete task when task is found", async () => {
      const task: ITask = {
        id: "1" as UUID,
        detail: "Task 1",
        userID: "user1" as UUID,
        createdAt: new Date(),
        status: TaskStatus.pending,
        completedAt: null,
      };
      taskModelDeleteTaskStub.returns(task);
  
      const res = await deleteTaskById("1" as UUID, "user1" as UUID);
  
      expect(res).toStrictEqual({
        message: "Successfully deleted",
        data: task,
      });
    });

    it("Should throw an error when task is not found", async () => {
      taskModelDeleteTaskStub.returns(null);

      await expect(() => deleteTaskById("100" as UUID, "user1" as UUID)).rejects.toThrow(
        new NotFound("Task with id: 100 not found for current user")
      );
    });
  });
});
