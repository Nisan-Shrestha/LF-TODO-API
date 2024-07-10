import express from "express";
import todoRouter from "./Task";
import userRouter from "./User";
import authRouter from "./Auth";

const router = express();
router.use("/auth", authRouter);
router.use("/task", todoRouter);
router.use("/users", userRouter);

export default router;
