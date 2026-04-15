import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

export const categoryRouter = Router();
categoryRouter.get("/", getAllCategories);

export const adminCategoryRouter = Router();
adminCategoryRouter.post("/", createCategory);
adminCategoryRouter.patch("/:id", updateCategory);
adminCategoryRouter.delete("/:id", deleteCategory);
