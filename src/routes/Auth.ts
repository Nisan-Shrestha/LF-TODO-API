import express from "express";
import { login, refresh } from "../controller/Auth";

const router = express();
router.post("/login", login);
router.get("/refresh", refresh);

export default router;
