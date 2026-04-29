import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ExternalLink, FileText, X, MapPin } from "lucide-react";

import { useEffect, useState } from "react";

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  pending: {
    label: "Pending",
    class: "bg-amber-50 text-amber-700 border-amber-200",
  },
  verified: {
    label: "Tervalidasi",
    class: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  in_progress: {
    label: "Proses Perbaikan",
    class: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  resolved: {
    label: "Berhasil Diperbaiki",
    class: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Ditolak",
    class: "bg-red-50 text-red-700 border-red-200",
  },
};

const MODERATION_MAP: Record<string, { label: string; class: string }> = {
  pending: {
    label: "Proses Validasi",
    class: "bg-slate-100 text-slate-700 border-slate-200",
  },
  approved: {
    label: "Lolos Validasi",
    class: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Spam / Fiktif",
    class: "bg-red-50 text-red-700 border-red-200",
  },
  flagged_for_review: {
    label: "Dipertimbangkan",
    class: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export function LaporanPage() {
  const [reports, setReports] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    const fetchMyReports = async () => {
      const deviceId = localStorage.getItem("device_id");
      console.log(deviceId);
      if (!deviceId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/reports/my-reports?deviceId=${deviceId}`,
        );
        const result = await response.json();

        if (response.ok) {
          setReports(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyReports();
  }, []);

  const getReportImages = (report: any) => {
    if (!report || !report.image_url) return [];

    if (Array.isArray(report.image_url)) {
      return report.image_url;
    }

    return [report.image_url];
  };

  const openMaps = (report: any) => {
    const mapsUrl = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="min-h-full bg-[#fbfef9] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#276fbf]">
            Lentera Bandung
          </p>
          <h1 className="text-2xl font-black tracking-tight text-[#23395b] sm:text-3xl">
            Laporanku
          </h1>
          <p className="max-w-2xl text-sm font-medium leading-6 text-slate-500 sm:text-base">
            Pantau status dan perkembangan laporan yang pernah kamu kirim.
          </p>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-[#276fbf]/10 bg-white shadow-xl shadow-[#23395b]/5">
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f6fbff] hover:bg-[#f6fbff]">
                  <TableHead className="w-[110px] py-5 font-bold text-[#23395b]">
                    ID Kasus
                  </TableHead>
                  <TableHead className="font-bold text-[#23395b]">
                    Kategori
                  </TableHead>
                  <TableHead className="font-bold text-[#23395b]">
                    Status Validasi
                  </TableHead>
                  <TableHead className="font-bold text-[#23395b]">
                    Status Kasus
                  </TableHead>
                  <TableHead className="font-bold text-[#23395b]">
                    Deskripsi
                  </TableHead>
                  <TableHead className="text-right font-bold text-[#23395b]">
                    Sisipan
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-56 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#276fbf]" />
                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        Memuat laporan...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-56 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-[#276fbf]/10">
                          <FileText className="h-7 w-7 text-[#276fbf]" />
                        </div>
                        <p className="font-bold text-[#23395b]">
                          Kamu belum pernah membuat laporan.
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Laporan yang kamu buat akan muncul di halaman ini.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report: any) => {
                    const modStatus =
                      MODERATION_MAP[report.moderation_status] ||
                      MODERATION_MAP.pending;
                    const reqStatus =
                      STATUS_MAP[report.status] || STATUS_MAP.pending;

                    return (
                      <TableRow
                        key={report.id}
                        className="transition-colors hover:bg-[#f8fbff]"
                      >
                        <TableCell className="py-5 font-black text-[#23395b]">
                          #{report.id.split("-")[0]}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700">
                          {report.category?.name || "-"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${modStatus.class}`}
                          >
                            {modStatus.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${reqStatus.class}`}
                          >
                            {reqStatus.label}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[320px] truncate text-sm font-medium text-slate-500">
                          {report.raw_description}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 rounded-xl border-[#276fbf]/20 font-bold text-[#276fbf] hover:bg-[#276fbf] hover:text-white"
                            onClick={() => setSelectedReport(report)}
                          >
                            Lihat Detail <ExternalLink size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="block md:hidden">
            {isLoading ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#276fbf]" />
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  Memuat laporan...
                </p>
              </div>
            ) : reports.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-[#276fbf]/10">
                  <FileText className="h-7 w-7 text-[#276fbf]" />
                </div>
                <p className="font-bold text-[#23395b]">
                  Kamu belum pernah membuat laporan.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Laporan yang kamu buat akan muncul di halaman ini.
                </p>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {reports.map((report: any) => {
                  const modStatus =
                    MODERATION_MAP[report.moderation_status] ||
                    MODERATION_MAP.pending;
                  const reqStatus =
                    STATUS_MAP[report.status] || STATUS_MAP.pending;

                  return (
                    <div
                      key={report.id}
                      className="rounded-3xl border border-slate-100 bg-white p-4 shadow-lg shadow-[#23395b]/5"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#276fbf]">
                            ID Kasus
                          </p>
                          <p className="mt-1 text-lg font-black text-[#23395b]">
                            #{report.id.split("-")[0]}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#276fbf]/10 px-3 py-2 text-right">
                          <p className="text-xs font-bold text-[#276fbf]">
                            {report.category?.name || "-"}
                          </p>
                        </div>
                      </div>

                      <p className="line-clamp-3 text-sm font-medium leading-6 text-slate-600">
                        {report.ai_headline || report.raw_description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${modStatus.class}`}
                        >
                          {modStatus.label}
                        </span>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${reqStatus.class}`}
                        >
                          {reqStatus.label}
                        </span>
                      </div>

                      <div className="mt-5">
                        {report.moderation_status === "rejected" ? (
                          <span className="text-xs font-semibold italic text-slate-400">
                            Dibatalkan
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-11 w-full gap-2 rounded-2xl border-[#276fbf]/20 font-bold text-[#276fbf] hover:bg-[#276fbf] hover:text-white"
                            onClick={() => setSelectedReport(report)}
                          >
                            Lihat Detail <ExternalLink size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:max-w-2xl sm:rounded-[2rem]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#276fbf]">
                  Detail Laporan
                </p>
                <h2 className="mt-1 text-xl font-black text-[#23395b]">
                  #{selectedReport.id?.split("-")[0]}
                </h2>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-80px)] overflow-y-auto p-5">
              <div className="mb-5">
                {getReportImages(selectedReport).length > 0 ? (
                  <div className="grid gap-3">
                    <img
                      src={getReportImages(selectedReport)[0]}
                      alt="Foto laporan"
                      className="h-64 w-full rounded-3xl object-cover shadow-md sm:h-80"
                    />

                    {getReportImages(selectedReport).length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {getReportImages(selectedReport)
                          .slice(1, 5)
                          .map((image: string, index: number) => (
                            <img
                              key={`${image}-${index}`}
                              src={image}
                              alt={`Foto laporan ${index + 2}`}
                              className="h-20 w-full rounded-2xl object-cover"
                            />
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-52 flex-col items-center justify-center rounded-3xl bg-slate-100 text-center">
                    <FileText className="mb-3 size-8 text-slate-400" />
                    <p className="text-sm font-bold text-slate-500">
                      Tidak ada gambar laporan.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Kategori
                  </p>
                  <p className="mt-1 font-bold text-[#23395b]">
                    {selectedReport.category?.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Deskripsi
                  </p>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                    {selectedReport.ai_headline ||
                      selectedReport.raw_description ||
                      "-"}
                  </p>
                </div>

                <div className="rounded-3xl border border-[#276fbf]/10 bg-[#f6fbff] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="size-5 text-[#276fbf]" />
                    <p className="font-black text-[#23395b]">Lokasi Laporan</p>
                  </div>

                  <p className="text-sm font-medium text-slate-600">
                    Latitude: {selectedReport.latitude}
                  </p>
                  <p className="text-sm font-medium text-slate-600">
                    Longitude: {selectedReport.longitude}
                  </p>

                  <Button
                    className="mt-4 h-11 w-full rounded-2xl bg-[#276fbf] font-bold text-white hover:bg-[#23395b]"
                    onClick={() => openMaps(selectedReport)}
                  >
                    Buka di Google Maps <ExternalLink className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
