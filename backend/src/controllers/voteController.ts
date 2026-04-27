import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const toggleVote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { device_id } = req.body;

    if (!device_id) {
      res
        .status(400)
        .json({ status: "error", message: "device_id is required." });
      return;
    }

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) {
      res.status(404).json({ status: "error", message: "Report not found." });
      return;
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        reportId: id,
        device_id: device_id,
      },
    });

    if (existingVote) {
      await prisma.vote.delete({
        where: { id: existingVote.id },
      });
      res.status(200).json({
        status: "success",
        data: existingVote,
        message: "Vote removed.",
      });
    } else {
      const newVote = await prisma.vote.create({
        data: {
          reportId: id,
          device_id: device_id,
        },
      });
      res.status(200).json({
        status: "success",
        data: newVote,
        message: "Vote added.",
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};
