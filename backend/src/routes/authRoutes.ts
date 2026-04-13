import { Router } from "express";
import { login, register } from "../controllers/authController";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const authRouter = Router();

const adminRouter = Router();
adminRouter.post("/login", login);
adminRouter.post("/register", verifyToken, isAdmin, register);

authRouter.use("/admin", adminRouter);

export default authRouter;
