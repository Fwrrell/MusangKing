import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  AlertTriangle,
  ChevronRight,
  X,
  MapPin,
  Calculator,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper untuk menentukan warna & label berdasarkan Priority Score
const getPriorityBadge = (score: number) => {
  if (score >= 0.75)
    return {
      label: "CRITICAL",
      class: "bg-red-50 text-red-700 border-red-200",
    };
  if (score >= 0.5)
    return {
      label: "HIGH",
      class: "bg-orange-50 text-orange-700 border-orange-200",
    };
  if (score >= 0.25)
    return {
      label: "MEDIUM",
      class: "bg-[#276fbf]/10 text-[#276fbf] border-[#276fbf]/20",
    };
  return {
    label: "LOW",
    class: "bg-slate-100 text-slate-700 border-slate-200",
  };
};

export function ReportTable() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/reports/rank-kecamatan",
        );
        const result = await response.json();

        if (response.ok) {
          setRankings(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data ranking:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-[2rem] border border-[#276fbf]/10 bg-white shadow-xl shadow-[#23395b]/5">
        <div className="flex flex-col gap-4 border-b border-[#276fbf]/10 bg-[#fbfef9] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div>
            <h3 className="text-lg font-black text-[#23395b]">
              Ranking Prioritas Kecamatan
            </h3>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
              Urutan wilayah berdasarkan skor prioritas dan efisiensi biaya
              (CBA).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#f6fbff]">
              <TableRow className="hover:bg-[#f6fbff]">
                <TableHead className="w-[80px] text-center font-extrabold text-[#23395b]">
                  #
                </TableHead>
                <TableHead className="min-w-[180px] font-extrabold text-[#23395b]">
                  Nama Kecamatan
                </TableHead>
                <TableHead className="min-w-[140px] font-extrabold text-[#23395b]">
                  Skor Prioritas
                </TableHead>
                <TableHead className="min-w-[180px] font-extrabold text-[#23395b]">
                  Banyak Kasus
                </TableHead>
                <TableHead className="min-w-[160px] font-extrabold text-[#23395b]">
                  CBA
                </TableHead>
                <TableHead className="min-w-[120px] font-extrabold text-[#23395b]">
                  Status
                </TableHead>
                <TableHead className="min-w-[100px] text-right font-extrabold text-[#23395b]">
                  Detail
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#276fbf]" />
                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      Memuat ranking kecamatan...
                    </p>
                  </TableCell>
                </TableRow>
              ) : rankings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <p className="font-bold text-[#23395b]">
                      Belum ada data ranking.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Data prioritas kecamatan akan muncul setelah laporan
                      tersedia.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                rankings.map((kec, index) => {
                  const priority = getPriorityBadge(kec.priorityKecamatan);
                  const isTop3 = index < 3;

                  return (
                    <TableRow
                      key={kec.name}
                      onClick={() => setSelectedReport(kec)}
                      className="cursor-pointer transition-colors hover:bg-[#f8fbff]"
                    >
                      <TableCell className="text-center">
                        <span
                          className={`inline-grid size-9 place-items-center rounded-full text-sm font-extrabold ${
                            isTop3
                              ? "bg-[#23395b] text-white shadow-md shadow-[#23395b]/20"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-[#23395b]">
                            {kec.name}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            Populasi:{" "}
                            {kec.populasi?.toLocaleString("id-ID") || 0} jiwa
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="font-black text-[#276fbf]">
                        {kec.priorityKecamatan.toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-slate-600">
                            {kec.totalCases} Kasus Aktif
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-black text-[#276fbf]">
                          {kec.cbaKecamatan.toFixed(2)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black ${priority.class}`}
                        >
                          {priority.label === "CRITICAL" && (
                            <AlertTriangle size={12} />
                          )}
                          {priority.label}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedReport(kec);
                          }}
                          className="inline-grid size-9 place-items-center rounded-full bg-[#276fbf]/10 text-[#276fbf] transition hover:bg-[#276fbf] hover:text-white"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReport(null)}
            className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#23395b]/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#276fbf]/10 bg-[#fbfef9] p-5 sm:p-6">
                <div>
                  <span
                    className={`mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-extrabold ${
                      getPriorityBadge(selectedReport.priorityKecamatan).class
                    }`}
                  >
                    {getPriorityBadge(selectedReport.priorityKecamatan).label}{" "}
                    (Score: {selectedReport.priorityKecamatan.toFixed(2)})
                  </span>

                  <h2 className="text-xl font-black leading-tight text-[#23395b]">
                    {selectedReport.name}
                  </h2>

                  <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <AlertTriangle size={14} />
                    ID Kecamatan: {selectedReport.id}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-slate-400 shadow-sm transition hover:bg-red-50 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-5 overflow-y-auto p-5 sm:p-6">
                <div>
                  <h4 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Ringkasan Wilayah
                  </h4>
                  <p className="text-sm leading-7 text-slate-600">
                    Kecamatan{" "}
                    <span className="font-bold text-[#23395b]">
                      {selectedReport.name}
                    </span>{" "}
                    memiliki{" "}
                    <span className="font-bold text-[#23395b]">
                      {selectedReport.totalCases} kasus aktif
                    </span>{" "}
                    dengan skor prioritas{" "}
                    <span className="font-black text-[#276fbf]">
                      {selectedReport.priorityKecamatan.toFixed(2)}
                    </span>
                    .
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#276fbf]/10 bg-[#f6fbff] p-4">
                    <h4 className="mb-1 flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      <MapPin size={14} />
                      Data Kecamatan
                    </h4>

                    <p className="text-sm font-bold text-[#23395b]">
                      {selectedReport.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Populasi:{" "}
                      <span className="font-bold text-[#23395b]">
                        {selectedReport.populasi?.toLocaleString("id-ID") || 0}{" "}
                        jiwa
                      </span>
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Kasus:{" "}
                      <span className="font-bold text-[#23395b]">
                        {selectedReport.totalCases} Aktif
                      </span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#276fbf]/10 bg-[#f6fbff] p-4">
                    <h4 className="mb-1 flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      <Calculator size={14} />
                      Estimasi Lentera AI
                    </h4>

                    <p className="text-sm font-bold text-[#23395b]">
                      Skor CBA: {selectedReport.cbaKecamatan}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Estimasi Kerugian:{" "}
                      <span className="font-bold text-[#23395b]">
                        {formatRupiah(selectedReport.totalBenefit || 0)}{" "}
                      </span>
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Estimasi Perbaikan:{" "}
                      <span className="font-bold text-[#23395b]">
                        {formatRupiah(
                          selectedReport.totalImplementationCost || 0,
                        )}{" "}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ReportTable;
