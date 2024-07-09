import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTaskById,
  updateTaskById,
} from "../controller/Task";

const router = express();

router.get("/", getAllTasks);
router.get("/:id", getTaskById);

router.post("/", createTask);

router.put("/:id", updateTaskById);

// router.put("/:id/detail", updateTaskDetailById);
// router.put("/:id/status", updateTaskStatusById);

router.delete("/:id/", deleteTaskById);

export default router;
