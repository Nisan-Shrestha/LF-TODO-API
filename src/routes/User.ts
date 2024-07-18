import express from "express";

import {
  getUserInfo,
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
} from "../controller/User";
import { authenticate, authorize } from "../middleware/auth";
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from "../middleware/validator";
import {
  createUserSchema,
  getUserByIDQuerySchema,
  updateUserByIDBodySchema,
  updateUserByIDQuerySchema as DeleteUserByIDQuerySchema,
  getAllUsersSchema,
} from "../schema/user";
import { requestHandler } from "../utils/reqHandler";

const router = express();

router.get(
  "/:id",
  requestHandler([
    authenticate,
    authorize("isAdmin"),
    validateReqParams(getUserByIDQuerySchema),
    getUserInfo,
  ])
);
router.get(
  "/",
  requestHandler([
    authenticate,
    authorize("isAdmin"),
    validateReqQuery(getAllUsersSchema),
    getAllUser,
  ])
);
router.post(
  "/",
  requestHandler([
    authenticate,
    authorize("isAdmin"),
    validateReqBody(createUserSchema),
    createUser,
  ])
);

// // TODO: authenticate routes properly (Out of scope of day2)
router.put(
  "/",
  requestHandler([
    authenticate,
    authorize("isAdmin"),
    validateReqQuery(DeleteUserByIDQuerySchema),
    validateReqBody(updateUserByIDBodySchema),
    updateUser,
  ])
);

router.delete(
  "/",
  requestHandler([
    authenticate,
    authorize("isAdmin"),
    validateReqQuery(DeleteUserByIDQuerySchema),
    deleteUser,
  ])
);
// router.put("/", authenticate, authorize("users.putSelf"), updateUserSelf);
// router.delete("/", authenticate, authorize("users.deleteSelf"), deleteUserSelf);

export default router;
