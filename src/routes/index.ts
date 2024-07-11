import express from "express";
import taskRouter from "./Task";
import userRouter from "./User";
import authRouter from "./Auth";

const router = express();
router.use("/auth", authRouter);
router.use("/task", taskRouter);
router.use("/users", userRouter);

export default router;
