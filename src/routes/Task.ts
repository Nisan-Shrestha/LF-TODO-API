import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTaskById,
  updateTaskById,
} from "../controller/Task";
import { authenticate } from "../middleware/auth";
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from "../middleware/validator";
import {
  createTaskSchema,
  deleteTaskByIDSchema,
  getTaskByIDSchema,
  updateTaskByIDBodySchema,
  updateTaskByIDParamsSchema,
  updateTaskByIDQuerySchema,
} from "../schema/task";
import { requestHandler } from "../utils/reqHandler";

const router = express();

router.get("/", requestHandler([authenticate, getAllTasks]));
router.get(
  "/:id",
  authenticate,
  validateReqParams(getTaskByIDSchema),
  getTaskById
);

router.post("/", authenticate, validateReqBody(createTaskSchema), createTask);
import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";

router.put(
  "/:id",
  requestHandler([
    authenticate,
    validateReqBody(updateTaskByIDBodySchema),
    validateReqQuery(updateTaskByIDQuerySchema),
    validateReqParams(updateTaskByIDParamsSchema),
    updateTaskById,
  ])
);
router.delete(
  "/:id/",
  authenticate,
  validateReqParams(deleteTaskByIDSchema),
  deleteTaskById
);

export default router;
