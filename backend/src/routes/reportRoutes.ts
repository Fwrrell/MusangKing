import { Router } from "express";
import {
  createReport,
  getAdminReports,
  getPublicReports,
  updateAdminReport,
} from "../controllers/reportController";
import { upload } from "../middlewares/uploadMiddleware";
import { toggleVote } from "../controllers/voteController"; //upvote
import { isAdmin, verifyToken } from "../middlewares/authMiddleware";

const reportRouter = Router();

const publicRouter = Router();
publicRouter.get("/", getPublicReports);
publicRouter.post("/", upload.single("image"), createReport);
publicRouter.post("/:id/vote", toggleVote);

const adminRouter = Router();
adminRouter.use(verifyToken, isAdmin);
adminRouter.get("/", getAdminReports);
adminRouter.patch("/:id/update", updateAdminReport);

reportRouter.use("/public", publicRouter);
reportRouter.use("/admin", adminRouter);

export default reportRouter;
