import { Router } from "express";
import { authRouter, adminAuthRouter } from "./authRoutes";
import { categoryRouter, adminCategoryRouter } from "./categoryRoutes";
import { reportRouter, adminReportRouter } from "./reportRoutes";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware";
import { userRouter } from "./userRoutes";

const apiRouter = Router();

// public routes
apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reports", reportRouter);

// admin routes
const adminRouter = Router();
adminRouter.use(verifyToken, isAdmin); // middleware di level admin

adminRouter.use("/auth", adminAuthRouter);
adminRouter.use("/categories", adminCategoryRouter);
adminRouter.use("/reports", adminReportRouter);

apiRouter.use("/admin", adminRouter);

export default apiRouter;
