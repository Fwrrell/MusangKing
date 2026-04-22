import type { Request, Response } from "express";
import prisma from "../lib/prisma";

export const initUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { device_id, name, avatar_url } = req.body;

    if (!device_id || !name) {
      res.status(400).json({
        status: "success",
        message: "Device ID and name are required.",
      });
      return;
    }

    const exisistingUser = await prisma.user.findUnique({
      where: { device_id },
    });

    if (exisistingUser) {
      res.status(200).json({
        status: "success",
        message: "User is already registered.",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        device_id,
        name,
        avatar_url,
      },
    });

    res.status(201).json({
      status: "success",
      data: { user: newUser },
      message: "User successfully created.",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server Error." });
  }
};
