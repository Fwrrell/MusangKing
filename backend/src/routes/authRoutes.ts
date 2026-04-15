import { Router } from "express";
import { login, register } from "../controllers/authController";

export const authRouter = Router();
authRouter.post("/login", login);

export const adminAuthRouter = Router();
adminAuthRouter.post("/register", register);
