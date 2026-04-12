import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { verifyToken } from "../middlewares/authMiddleware";

const categoryRouter = Router();

categoryRouter.post("/create", verifyToken, createCategory);
categoryRouter.get("/", verifyToken, getAllCategories);
categoryRouter.patch("/:id", verifyToken, updateCategory);
categoryRouter.delete("/:id", verifyToken, deleteCategory);

export default categoryRouter;
