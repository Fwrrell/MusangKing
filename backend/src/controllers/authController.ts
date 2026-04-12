import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // cari user di db
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(401).json({ message: "Email not found." });
      return;
    }

    // cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Wrong Password" });
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
      message: "Login Success",
      token,
      data: {
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred on the server" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 16);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  res.status(201).json({ message: "User Created", newUser });
};

module.exports = { login, register };
