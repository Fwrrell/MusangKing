import { Router } from "express";
import authRouter from "./authRoutes";
import categoryRouter from "./categoryRoutes";
import reportRouter from "./reportRoutes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reports", reportRouter);

export default apiRouter;
