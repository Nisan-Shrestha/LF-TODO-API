import express from "express";

import {
  getUserInfo,
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
} from "../controller/User";
import { authenticate, authorize } from "../middleware/auth";

const router = express();

router.get("/:id", authenticate, authorize("users.get"), getUserInfo);
router.get("/", authenticate, authorize("users.get"), getAllUser);
router.post("/", authenticate, authorize("users.post"), createUser);

// // TODO: authenticate routes properly (Out of scope of day2)
router.put("/", authenticate, authorize("users.put"), updateUser);
router.delete("/", authenticate, authorize("users.delete"), deleteUser);
// router.put("/", authenticate, authorize("users.putSelf"), updateUserSelf);
// router.delete("/", authenticate, authorize("users.deleteSelf"), deleteUserSelf);

export default router;
