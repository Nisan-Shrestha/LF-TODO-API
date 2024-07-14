import express from "express";
import { login, refresh } from "../controller/Auth";
import { validateReqBody, validateReqHeader } from "../middleware/validator";
import { loginSchema, refreshSchema } from "../schema/auth";

const router = express();
router.post("/login", validateReqBody(loginSchema), login);
router.get("/refresh", validateReqHeader(refreshSchema), refresh);

export default router;
