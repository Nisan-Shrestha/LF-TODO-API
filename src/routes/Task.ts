import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTaskById,
  updateTaskById,
} from "../controller/Task";
import { auth } from "../middleware/auth";

const router = express();

router.get("/", auth, getAllTasks);
router.get("/:id", auth, getTaskById);

router.post("/", auth, createTask);
router.put("/:id", auth, updateTaskById);
router.delete("/:id/", auth, deleteTaskById);

export default router;
