import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { randomUUID } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // cari user di db
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user || !user.password) {
      res
        .status(401)
        .json({ status: "Error", message: "Email or Password is wrong." });
      return;
    }

    // cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ status: "Error", message: "Email or Password is wrong." });
      return;
    }

    // generate jwt token (expired 1 day)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        categoryId: user.categoryId,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      status: "success",
      token,
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
        categoryId: user.categoryId,
      },
      message: "Login Success",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server Error.", err });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role, categoryId } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res
        .status(400)
        .json({ status: "error", message: "Email already exist." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 16);

    const adminDeviceId = `musang-${randomUUID()}`;

    const newUser = await prisma.user.create({
      data: {
        device_id: adminDeviceId,
        name,
        email,
        password: hashedPassword,
        role,
        categoryId: categoryId || null,
      },
      include: { category: true },
    });

    res.status(201).json({
      status: "success",
      newUser,
      message: "User successfully created.",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error.", err });
  }
};
