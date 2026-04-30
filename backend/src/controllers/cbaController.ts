import { Request, Response } from "express";
import prisma from "../lib/prisma";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { readFileSync } from "fs";
import { join } from "path";

const bandungGeoJSON = JSON.parse(
  readFileSync(
    join(__dirname, "../data/3273-kota-bandung-level-kecamatan.json"),
    "utf8",
  ),
) as any;
const populasiBandung = JSON.parse(
  readFileSync(join(__dirname, "../data/pendudukBandung.json"), "utf8"),
) as any;

// STEP 2: helper normalisasi: (X - X_min) / (X_max - X_min)
const normalize = (value: number, min: number, max: number) => {
  if (max === min) return 0;
  return (value - min) / (max - min);
};

export const getKecamatanRanking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Ambil semua laporan yang sudah di validasi tapi belum di resolved
    const reports = await prisma.report.findMany({
      where: {
        moderation_status: "approved",
        status: { not: "resolved" },
      },
      include: {
        assessment: true,
        entries: true,
      },
    });

    if (reports.length === 0) {
      res.status(200).json({ status: "success", data: [] });
      return;
    }

    // Cari nilai min, max untuk normalize level kasus
    const now = new Date().getTime();
    let cbaMin = Infinity,
      cbaMax = -Infinity;
    let reportMin = Infinity,
      reportMax = -Infinity;
    let ageMin = Infinity,
      ageMax = -Infinity;

    const reportsData = reports.map((r) => {
      const cba = r.assessment?.cba_score || 0;
      const reportCount = r.entries.length;
      const ageHours =
        (now - new Date(r.createdAt).getTime()) / (1000 * 60 * 60);

      if (cba < cbaMin) cbaMin = cba;
      if (cba > cbaMax) cbaMax = cba;
      if (reportCount < reportMin) reportMin = reportCount;
      if (reportCount > reportMax) reportMax = reportCount;
      if (ageHours < ageMin) ageMin = ageHours;
      if (ageHours > ageMax) ageMax = ageHours;

      return { ...r, cba, reportCount, ageHours };
    });

    // STEP 3: Hitung Priority Score tiap kasus n group by kecamatan
    const kecamatanMap: Record<
      string,
      {
        id: string;
        totalCost: number;
        totalBenefit: number;
        totalScore: number;
        count: number;
        criticalCount: number;
      }
    > = {};

    reportsData.forEach((r) => {
      // Normalisasi
      const cbaNorm = normalize(r.cba, cbaMin, cbaMax);
      const reportNorm = normalize(r.reportCount, reportMin, reportMax);
      const ageNorm = normalize(r.ageHours, ageMin, ageMax);

      // Priority Score dasar
      let priorityScore = (cbaNorm + reportNorm + ageNorm) / 3;

      // STEP 4: Critical Override (Kalo AI bilang ini kritis, paksa skor jadi 1.0 / CRITICAL)
      if (r.assessment?.is_critical_rule) {
        priorityScore = 1.0;
      }

      // Cari kecamatannya
      const pt = point([r.longitude, r.latitude]);
      let kecamatanName = "Luar Bandung";
      let kecamatanId = "000";

      for (const feature of (bandungGeoJSON as any).features) {
        if (booleanPointInPolygon(pt, feature)) {
          kecamatanName =
            feature.properties?.nama_kecamatan || feature.properties?.WADMKC;
          kecamatanId = feature.properties?.id_kecamatan || "000";
          break;
        }
      }

      if (!kecamatanMap[kecamatanName]) {
        kecamatanMap[kecamatanName] = {
          id: kecamatanId,
          totalScore: 0,
          count: 0,
          criticalCount: 0,
          totalBenefit: 0,
          totalCost: 0,
        };
      }

      const benefit =
        (r.assessment?.baseline_cost || 0) - (r.assessment?.residual_cost || 0);
      const cost = r.assessment?.implementation_cost || 0;

      kecamatanMap[kecamatanName].totalScore += priorityScore;
      kecamatanMap[kecamatanName].count += 1;
      kecamatanMap[kecamatanName].totalBenefit += benefit;
      kecamatanMap[kecamatanName].totalCost += cost;

      if (priorityScore >= 0.75) {
        kecamatanMap[kecamatanName].criticalCount += 1;
      }
    });

    // STEP 6: Hitung Avg Priority & Critical Density per kecamatan
    let avgPriMin = Infinity,
      avgPriMax = -Infinity;
    let critDenMin = Infinity,
      critDenMax = -Infinity;
    let repDenMin = Infinity,
      repDenMax = -Infinity;

    const kecamatanStats = Object.keys(kecamatanMap).map((name) => {
      const data = kecamatanMap[name];
      const populasi = populasiBandung[name];

      const avgPriority = data.totalScore / data.count;
      const criticalDensity = data.criticalCount / data.count;
      const reportDensity = (data.count / populasi) * 1000;

      const cbaKecamatan =
        data.totalCost > 0 ? data.totalBenefit / data.totalCost : 0;

      if (avgPriority < avgPriMin) avgPriMin = avgPriority;
      if (avgPriority > avgPriMax) avgPriMax = avgPriority;
      if (criticalDensity < critDenMin) critDenMin = criticalDensity;
      if (criticalDensity > critDenMax) critDenMax = criticalDensity;
      if (reportDensity < repDenMin) repDenMin = reportDensity;
      if (reportDensity > repDenMax) repDenMax = reportDensity;

      return {
        id: data.id,
        name,
        avgPriority,
        criticalDensity,
        reportDensity,
        cbaKecamatan,
        totalCases: data.count,
        populasi,
        totalBenefit: data.totalBenefit,
        totalImplementation: data.totalCost,
      };
    });

    // STEP 7: Final ranking kecamatan (Normalisasi Fase 2)
    const finalRanking = kecamatanStats.map((k) => {
      const avgPriNorm = normalize(k.avgPriority, avgPriMin, avgPriMax);
      const critDenNorm = normalize(k.criticalDensity, critDenMin, critDenMax);
      const repDenNorm = normalize(k.reportDensity, repDenMin, repDenMax);

      // STEP 9: CBA kumulatif per kecamatan
      const priorityKecamatan = (avgPriNorm + critDenNorm + repDenNorm) / 3;
      return { ...k, priorityKecamatan };
    });

    // Urutkan dari skor tertinggi (Rank 1) ke terendah
    finalRanking.sort((a, b) => b.priorityKecamatan - a.priorityKecamatan);

    res.status(200).json({
      status: "success",
      data: finalRanking,
      message: "CBA successfully calculated.",
    });
  } catch (err) {
    console.error("CBA Calculation Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
