import { Router } from "express";
import { createReport } from "../controllers/reportController";
import { upload } from "../middlewares/uploadMiddleware";
import { toggleVote } from "../controllers/voteController"; //upvote

const reportRouter = Router();
reportRouter.post("/", upload.single("image"), createReport);
reportRouter.post("/:id", toggleVote);

export default reportRouter;
