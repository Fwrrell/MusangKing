import { Router } from "express";
import { login, register } from "../controllers/authController";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", verifyToken, isAdmin, register);

export default authRouter;
