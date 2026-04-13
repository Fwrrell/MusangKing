import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { upImageReport } from "../services/storageService";
import { analyzeReport } from "../services/geminiService";

export const createReport = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      categoryId,
      raw_description,
      latitude,
      longitude,
      reporter_device_id,
    } = req.body;
    const file = req.file;

    if (!file) {
      res.status(404).json({ status: "error", message: "Photo is required." });
      return;
    }

    const imageUrl = await upImageReport(file); // upload ke storage supabase (link public)
    const aiResult = await analyzeReport(raw_description, imageUrl); // hasil validasi oleh Gemini AI

    // TODO: DELETE DEBUG
    console.log("udah sampe sini cuy");

    // jika ai mendeteksi bukan laporan yang valid
    if (!aiResult.is_valid) {
      res.status(400).json({
        status: "rejected",
        message: "Report rejected by system.",
        reason: aiResult.reason,
      });
      return;
    }

    // jika lolos maka simpan laporannya ke database
    const uniqueSlug = `${aiResult.headline.toLowerCase().replace(/ /g, "-")}-${Date.now()}`;

    const newReport = await prisma.report.create({
      data: {
        categoryId,
        raw_description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        image_url: imageUrl,
        reporter_device_id,
        slug: uniqueSlug,
        ai_headline: aiResult.headline,
        description: aiResult.filtered_description,
        estimated_cost: aiResult.estimated_cost,
        moderation_status: "approved", // ini status yang dihasilkan dari ai, artinya validasi report aja
        status: "pending", // ini status yang dihasilkan dari pemerintah/admin (verified/in_progres/resolved/rejected)
      },
    });

    res.status(201).json({
      status: "success",
      newReport,
      message: "Report successfully created.",
    });
  } catch (err) {
    // TODO: DELETE DEBUG
    console.log(err);
    res.status(500).json({ error: "Internal server error." });
  }
};
