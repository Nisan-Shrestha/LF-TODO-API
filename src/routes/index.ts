import express from "express";

import taskRoutes from "./Task";
const router = express();

router.use("/task", taskRoutes);

router.get("/", (req, res) => {
  res.redirect("/task")
});

export default router;
