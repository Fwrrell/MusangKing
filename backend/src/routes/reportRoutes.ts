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

reportRouter.get("/", getPublicReports);
reportRouter.post("/", upload.single("image"), createReport);
reportRouter.post("/:id", toggleVote);

reportRouter.get("/admin/report", verifyToken, isAdmin, getAdminReports);
reportRouter.get("/admin/report/:id", verifyToken, isAdmin, updateAdminReport);

export default reportRouter;
