import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTaskById,
  updateTaskById,
} from "../controller/Task";
import { authenticate } from "../middleware/auth";

const router = express();

router.get("/", authenticate, getAllTasks);
router.get("/:id", authenticate, getTaskById);

router.post("/", authenticate, createTask);
router.put("/:id", authenticate, updateTaskById);
router.delete("/:id/", authenticate, deleteTaskById);

export default router;
