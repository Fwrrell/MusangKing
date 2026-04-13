import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const categoryRouter = Router();

const publicRouter = Router();
categoryRouter.get("/", getAllCategories);

const adminRouter = Router();
adminRouter.use(verifyToken, isAdmin);
adminRouter.post("/create", createCategory);
adminRouter.patch("/:id", updateCategory);
adminRouter.delete("/:id", deleteCategory);

categoryRouter.use("/public", publicRouter);
categoryRouter.use("/admin", adminRouter);

export default categoryRouter;
