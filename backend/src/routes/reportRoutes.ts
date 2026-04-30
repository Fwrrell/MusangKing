import { Router } from "express";
import {
  createReport,
  getAdminReports,
  getMyReports,
  getPublicReports,
  getReportBySlug,
  getReportStats,
  updateAdminReport,
  updateReportStatus,
} from "../controllers/reportController";
import { upload } from "../middlewares/uploadMiddleware";
import { toggleVote } from "../controllers/voteController"; //upvote
import { getKecamatanRanking } from "../controllers/cbaController";
import { verifyToken } from "../middlewares/authMiddleware";

export const reportRouter = Router();
reportRouter.get("/", getPublicReports);
reportRouter.get("/stats", getReportStats);
reportRouter.get("/my-reports", getMyReports);
reportRouter.get("/rank-kecamatan", getKecamatanRanking);
reportRouter.get("/:slug", getReportBySlug);
reportRouter.post("/", upload.single("image"), createReport);
reportRouter.post("/:id/vote", toggleVote);
reportRouter.patch("/:id", verifyToken, updateReportStatus); // khusus admin/pemerintah

export const adminReportRouter = Router();
adminReportRouter.get("/", getAdminReports);
adminReportRouter.patch("/:id", updateAdminReport);
