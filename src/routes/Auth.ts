import express from "express";
import { login, refresh } from "../controller/Auth";
import { validateReqBody, validateReqHeader } from "../middleware/validator";
import { loginSchema, refreshSchema } from "../schema/auth";
import { requestHandler } from "../utils/reqHandler";

const router = express();
router.post("/login", requestHandler([validateReqBody(loginSchema), login]));
router.get(
  "/refresh",
  requestHandler([validateReqHeader(refreshSchema), refresh])
);

export default router;
