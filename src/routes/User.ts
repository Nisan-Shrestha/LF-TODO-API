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
} from "../schema/user";
import { requestHandler } from "../utils/reqHandler";

const router = express();

router.get(
  "/:id",
  requestHandler([
    authenticate,
    authorize("users.get"),
    validateReqParams(getUserByIDQuerySchema),
    getUserInfo,
  ])
);
router.get(
  "/",
  requestHandler([authenticate, authorize("users.get"), getAllUser])
);
router.post(
  "/",
  requestHandler([
    authenticate,
    authorize("users.post"),
    validateReqBody(createUserSchema),
    createUser,
  ])
);

// // TODO: authenticate routes properly (Out of scope of day2)
router.put(
  "/",
  requestHandler([
    authenticate,
    authorize("users.put"),
    validateReqQuery(DeleteUserByIDQuerySchema),
    validateReqBody(updateUserByIDBodySchema),
    updateUser,
  ])
);

router.delete(
  "/",
  requestHandler([
    authenticate,
    authorize("users.delete"),
    validateReqQuery(DeleteUserByIDQuerySchema),
    deleteUser,
  ])
);
// router.put("/", authenticate, authorize("users.putSelf"), updateUserSelf);
// router.delete("/", authenticate, authorize("users.deleteSelf"), deleteUserSelf);

export default router;
