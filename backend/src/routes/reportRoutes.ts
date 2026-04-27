import { Router } from "express";
import {
  createReport,
  getAdminReports,
  getPublicReports,
  getReportBySlug,
  updateAdminReport,
  updateReportStatus,
} from "../controllers/reportController";
import { upload } from "../middlewares/uploadMiddleware";
import { toggleVote } from "../controllers/voteController"; //upvote
import { verifyToken } from "../middlewares/authMiddleware";

export const reportRouter = Router();
reportRouter.get("/", getPublicReports);
reportRouter.get("/:slug", getReportBySlug);
reportRouter.post("/", upload.single("image"), createReport);
reportRouter.post("/:id/vote", toggleVote);
reportRouter.patch("/:id", verifyToken, updateReportStatus); // khusus admin/pemerintah

export const adminReportRouter = Router();
adminReportRouter.get("/", getAdminReports);
adminReportRouter.patch("/:id", updateAdminReport);
