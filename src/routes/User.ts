import express from "express";

import {
  getUserInfo,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/User";
import { auth } from "../middleware/auth";

const router = express();

router.get("/", getUserInfo);
router.post("/", createUser);

// TODO: authenticate routes properly (Out of scope of day2)
router.put("/", updateUser);
router.delete("/", deleteUser);

export default router;
