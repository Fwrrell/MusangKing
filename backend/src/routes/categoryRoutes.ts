import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const categoryRouter = Router();

categoryRouter.post("/create", verifyToken, isAdmin, createCategory);
categoryRouter.get("/", verifyToken, isAdmin, getAllCategories);
categoryRouter.patch("/:id", verifyToken, isAdmin, updateCategory);
categoryRouter.delete("/:id", verifyToken, isAdmin, deleteCategory);

export default categoryRouter;
