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

    const user = await prisma.user.findUnique({
      where: { device_id: reporter_device_id },
    });

    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Device ID not valid or not registered.",
      });
      return;
    }

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
      (report: any) =>
        getDistance(latNum, lonNum, report.latitude, report.longitude) <= 250,
    );

    // kalo ada laporan terdekat (merge data nya)
    if (existingReport) {
      const [updateReport, newEntry] = await prisma.$transaction([
        // push gambar ke array image_url
        prisma.report.update({
          where: { id: existingReport.id },
          data: { image_url: { push: imageUrl } },
        }),
        // bikin thread pake user.id
        prisma.report_Entry.create({
          data: {
            reportId: existingReport.id,
            userId: user.id,
            description: aiResult.filtered_description,
          },
        }),
      ]);
      res.status(200).json({
        status: "success",
        data: { report: updateReport, new_thread: newEntry },
        message: "Report successfully merged with report nearby there.",
      });
      return;
    }

    // jika tidak ada laporan terdekat bikin pin baru
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
        entries: {
          create: {
            userId: user.id,
            description: aiResult.filtered_description,
          },
        },
      },
      include: {
        entries: true,
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
        entries: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: reports,
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

export const getReportBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string };
    const report = await prisma.report.findUnique({
      where: { slug },
      include: {
        category: true,
        votes: true,
        entries: {
          include: { user: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!report) {
      res.status(404).json({ status: "error", message: "Report not found." });
      return;
    }

    res
      .status(200)
      .json({ status: "success", data: report, message: "Report found." });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateReportStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { status, notes } = req.body;

    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized. ID user not found.",
      });
      return;
    }

    const existingReport = await prisma.report.findUnique({ where: { id } });
    if (!existingReport) {
      res.status(404).json({ status: "error", message: "Report not found." });
      return;
    }

    // mencegah execute kosong
    if (!status && !notes) {
      res.status(400).json({
        status: "error",
        message: "Please provide either status or notes to update.",
      });
      return;
    }

    let updateData: any = {};
    if (status) {
      updateData.status = status;
    }

    // jika status kosong, gunakan status yang udah ada
    const statusToLog = status ?? existingReport.status;
    const logNotes = notes ?? "";

    // pake transaction => jika log gagal, status laporan batal berubah
    const [updatedReport, newLog] = await prisma.$transaction([
      prisma.report.update({
        where: { id },
        data: updateData,
      }),

      prisma.report_Log.create({
        data: {
          reportId: id,
          userId: userId,
          notes: logNotes,
          new_status: statusToLog,
        },
      }),
    ]);

    res.status(200).json({
      status: "success",
      message: "Report status and log successfully updated.",
      data: { report: updatedReport, log: newLog },
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};
