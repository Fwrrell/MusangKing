import { Router } from "express";
import { initUser } from "../controllers/userController";

export const userRouter = Router();
userRouter.post("/init", initUser);
