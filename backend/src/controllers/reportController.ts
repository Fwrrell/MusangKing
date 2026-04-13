import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { getDistance } from "../utils/geoutils";
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
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);

    const imageUrl = await upImageReport(file!); // upload ke storage supabase (link public)
    const aiResult = await analyzeReport(raw_description, imageUrl); // hasil validasi oleh Gemini AI

    // jika ai mendeteksi bukan laporan yang valid
    if (!aiResult.is_valid) {
      const uniqueSlug = `rejected-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newReport = await prisma.report.create({
        data: {
          categoryId,
          raw_description,
          latitude: latNum,
          longitude: lonNum,
          image_url: [imageUrl],
          reporter_device_id,
          slug: uniqueSlug,
          ai_headline: "Report rejected by System",
          description: aiResult.reason,
          estimated_cost: 0,
          moderation_status: "rejected",
          status: "rejected",
        },
      });

      res.status(400).json({
        status: "rejected",
        newReport,
        message: "Report rejected by system.",
      });
      return;
    }

    // cek laporan yang udah di approved, untuk keperluan cek jarak
    const cekReports = await prisma.report.findMany({
      where: {
        categoryId,
        moderation_status: "approved",
      },
    });

    // dengan jarak max 250m
    const existingReport = cekReports.find(
      (report) =>
        getDistance(latNum, lonNum, report.latitude, report.longitude) <= 250,
    );

    // kalo ada laporan terdekat (merge data nya)
    if (existingReport) {
      const currDescription = existingReport.description
        .split("\n")
        .filter((d) => d.trim() !== "");
      const nextNum = currDescription.length + 1;
      const appendDesc = `${existingReport.description}\n${nextNum}. ${aiResult.filtered_description}`;

      const updateReport = await prisma.report.update({
        where: { id: existingReport.id },
        data: {
          image_url: { push: imageUrl },
          description: appendDesc,
        },
      });

      res.status(200).json({
        status: "success",
        data: { report: updateReport },
        message: "Report successfully merged with report nearby there.",
      });
    }

    // jika lolos maka simpan laporannya ke database
    const uniqueSlug = `${aiResult.headline.toLowerCase().replace(/ /g, "-")}-${Date.now()}`;

    const newReport = await prisma.report.create({
      data: {
        categoryId,
        raw_description,
        latitude: latNum,
        longitude: lonNum,
        image_url: [imageUrl],
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

export const getPublicReports = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reports = await prisma.report.findMany({
      where: {
        moderation_status: "approved",
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: { reports },
      message: "Reports successfully displayed.",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getAdminReports = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: { reports },
      message: "Reports successfully displayed.",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateAdminReport = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const {
      ai_headline,
      description,
      estimated_cost,
      status,
      moderation_status,
    } = req.body;

    const existingReport = await prisma.report.findUnique({ where: { id } });
    if (!existingReport) {
      res.status(404).json({ status: "error", message: "Report not found." });
      return;
    }

    let updateData: any = {
      description: description ?? existingReport.description,
      estimated_cost: estimated_cost ?? existingReport.estimated_cost,
      status: status ?? existingReport.status,
      moderation_status: moderation_status ?? existingReport.moderation_status,
    };

    if (
      moderation_status === "approved" &&
      existingReport.moderation_status !== "approved"
    ) {
      const headline = ai_headline;
      updateData.ai_headline = headline;
      updateData.slug = `${headline.toLowerCase().replace(/ /g, "-")}-${Date.now()}`;
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      status: "success",
      data: { report: updatedReport },
      message: "Report updated.",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};
