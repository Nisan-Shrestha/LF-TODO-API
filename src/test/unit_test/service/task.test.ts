import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTaskById,
  deleteTaskById,
} from "../../../services/Task";
import expect from "expect";
import sinon from "sinon";

import { TaskModel } from "../../../models/Task";
import { ITask, TaskStatus } from "../../../interfaces/Task";
import { UUID } from "crypto";
import { NotFound } from "../../../error/NotFound";
import { Internal } from "../../../error/Internal";

describe("Task Service Test Suite", () => {
  describe("getAllTasks", () => {
    let taskModelGetAllTasksStub: sinon.SinonStub;
    let taskModelCountStub: sinon.SinonStub;

    beforeEach(() => {
      taskModelGetAllTasksStub = sinon.stub(TaskModel, "getAllTasks");
      taskModelCountStub = sinon.stub(TaskModel, "count");
    });

    afterEach(() => {
      taskModelGetAllTasksStub.restore();
      taskModelCountStub.restore();
    });

    it("Should return all tasks for a user", async () => {
      const tasks: ITask[] = [
        {
          taskId: "1" as UUID,
          detail: "Task 1",
          userID: "123456" as UUID,
          createdAt: new Date(),
          status: TaskStatus.pending,
          updatedAt: null,
        },
      ];
      taskModelGetAllTasksStub.returns([...tasks]);
      taskModelCountStub.returns(1);
      const res = await getAllTasks("123456" as UUID, { page: 1, size: 16 });
      expect(res).toStrictEqual({
        data: [...tasks],
        meta: { page: 1, size: 1, total: 1},
      });
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

      await expect(() =>
        getTaskById("100" as UUID, "123456" as UUID)
      ).rejects.toThrow(
        new NotFound("Task with id: 100 not found for current user")
      );
    });

    it("Should return the task when task is found", async () => {
      const task: ITask = {
        taskId: "1" as UUID,
        detail: "Task 1",
        userID: "123456" as UUID,
        createdAt: new Date(),
        status: TaskStatus.pending,
        updatedAt: null,
      };
      taskModelGetTaskByIdStub.returns(task);
      const res = await getTaskById("1" as UUID, "123456" as UUID);
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
        taskId: "1" as UUID,
        detail: "Task 1",
        userID: "123456" as UUID,
        createdAt: new Date(),
        status: TaskStatus.pending,
        updatedAt: null,
      };
      taskModelCreateTaskStub.returns(task);
      const res = await createTask("Task 1", "123456" as UUID);
      expect(res).toStrictEqual({
        message: "Task created successfully",
        data: task,
      });
    });

    it("Should throw an error if task creation fails", async () => {
      taskModelCreateTaskStub.returns(null);

      await expect(() =>
        createTask("Task 1", "123456" as UUID)
      ).rejects.toThrow(new Internal("Failed to create Task"));
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
        taskId: "1" as UUID,
        detail: "Updated Task 1",
        userID: "123456" as UUID,
        createdAt: new Date(),
        status: TaskStatus.pending,
        updatedAt: null,
      };
      taskModelUpdateTaskStub.returns(task);
      const res = await updateTaskById(
        "1" as UUID,
        "detail",
        "123456" as UUID,
        "Updated Task 1"
      );
      expect(res).toStrictEqual({
        message: "Task updated successfully",
        data: task,
      });
    });

    it("Should update task status and return updated task", async () => {
      const task: ITask = {
        taskId: "1" as UUID,
        detail: "Task 1",
        userID: "123456" as UUID,
        createdAt: new Date(),
        status: TaskStatus.done,
        updatedAt: new Date(),
      };
      taskModelUpdateTaskStatusStub.returns(task);
      const res = await updateTaskById(
        "1" as UUID,
        "status",
        "123456" as UUID,
        undefined,
        "done"
      );
      expect(res).toStrictEqual({
        message: "Task updated successfully",
        data: task,
      });
    });

    it("Should throw an error when task is not found", async () => {
      taskModelUpdateTaskStub.returns(null);

      await expect(() =>
        updateTaskById(
          "100" as UUID,
          "detail",
          "123456" as UUID,
          "Updated Task 1"
        )
      ).rejects.toThrow(
        new NotFound("Task with id: 100 not found for current user")
      );
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
        taskId: "1" as UUID,
        detail: "Task 1",
        userID: "123456" as UUID,
        createdAt: new Date(),
        status: TaskStatus.pending,
        updatedAt: null,
      };
      taskModelDeleteTaskStub.returns(task);

      const res = await deleteTaskById("1" as UUID, "123456" as UUID);

      expect(res).toStrictEqual({
        message: "Successfully deleted",
        data: task,
      });
    });

    it("Should throw an error when task is not found", async () => {
      taskModelDeleteTaskStub.returns(null);

      await expect(() =>
        deleteTaskById("100" as UUID, "123456" as UUID)
      ).rejects.toThrow(
        new NotFound("Task with id: 100 not found for current user")
      );
    });
  });
});
