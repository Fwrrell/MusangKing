import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, color } = req.body;
    const category = await prisma.category.create({
      data: { name, color },
    });

    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    res.status(201).json({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { name, color } = req.body;

    const categoryExists = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryExists) {
      res.status(404).json({ status: "error", message: "Category not Found." });
      return;
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name ?? categoryExists.name,
        color: color ?? categoryExists.color,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        category: updatedCategory,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };

    const categoryExist = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryExist) {
      res.status(404).json({ status: "error", message: "Category not Found." });
    }

    const deleteCategory = await prisma.category.delete({
      where: { id },
    });

    res.status(200).json({
      status: "success",
      data: {
        deleteCategory,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
