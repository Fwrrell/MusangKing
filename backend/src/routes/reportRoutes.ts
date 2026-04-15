import { Router } from "express";
import {
  createReport,
  getAdminReports,
  getPublicReports,
  updateAdminReport,
} from "../controllers/reportController";
import { upload } from "../middlewares/uploadMiddleware";
import { toggleVote } from "../controllers/voteController"; //upvote

export const reportRouter = Router();
reportRouter.get("/", getPublicReports);
reportRouter.post("/", upload.single("image"), createReport);
reportRouter.post("/:id/vote", toggleVote);

export const adminReportRouter = Router();
adminReportRouter.get("/", getAdminReports);
adminReportRouter.patch("/:id", updateAdminReport);
