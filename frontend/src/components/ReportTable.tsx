import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  X,
  MapPin,
  AlertTriangle,
  Calculator,
} from "lucide-react";

const reports = [
  {
    id: "K-12",
    name: "Traffic Light Mati Simpang Soekarno Hatta",
    location: "Kec. Bojongloa Kaler",
    score: 0.82,
    level: "CRITICAL",
    desc: "Lampu lalu lintas mati total sejak 2 hari lalu, menyebabkan kemacetan parah dan rawan kecelakaan di jam sibuk.",
    cost: "Rp 10.000.000",
    cba: 1.5,
    age: "25 Hari",
    latlng: "-6.9382, 107.5938",
  },
  {
    id: "K-25",
    name: "Jalan Berlubang Dalam",
    location: "Kec. Bandung Kulon",
    score: 0.76,
    level: "CRITICAL",
    desc: "Lubang sedalam 15cm dengan diameter 1 meter di jalur utama angkutan umum.",
    cost: "Rp 40.000.000",
    cba: 1.5,
    age: "20 Hari",
    latlng: "-6.9211, 107.5642",
  },
  {
    id: "K-18",
    name: "Sambungan Jembatan Retak",
    location: "Kec. Babakan Ciparay",
    score: 0.68,
    level: "HIGH",
    desc: "Retakan memanjang di sisi kiri jembatan, butuh penanganan sebelum meluas.",
    cost: "Rp 150.000.000",
    cba: 0.67,
    age: "30 Hari",
    latlng: "-6.8904, 107.6115",
  },
  {
    id: "K-15",
    name: "Sambungan Jembatan Retak Sebagian",
    location: "Kec. Coblong",
    score: 0.48,
    level: "HIGH",
    desc: "Retakan memanjang di sisi kiri jembatan, butuh penanganan sebelum meluas.",
    cost: "Rp 150.000.000",
    cba: 0.67,
    age: "30 Hari",
    latlng: "-6.8904, 107.6115",
  },
  {
    id: "K-10",
    name: "Lampu penerangan mati",
    location: "Kec. Lengkong",
    score: 0.28,
    level: "Low",
    desc: "Retakan memanjang di sisi kiri jembatan, butuh penanganan sebelum meluas.",
    cost: "Rp 5.000.000",
    cba: 0.67,
    age: "20 Hari",
    latlng: "-6.8904, 107.6115",
  },
];
export const ReportTable = () => {
  const [selectedReport, setReport] = useState<any | null>(null);
  const getBadgeColor = (level: string) => {
    if (level === "critical") return "bg-red-100 text-red-700 border-red-200";
    if (level === "high")
      return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };
  return (
    <>
      <div className="w-full relative bg-slate-50 mt-10 p-8">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="text-center p-6 border-b border-gray-100">
            <h3 className="font-bold text-2xl capitalize leading-[2]">
              Ranking prioritas Laporan
            </h3>
            <p className="text-md text-gray-500 font-medium">
              diurutkan dari skor prioritas tertinggi hingga terendah
            </p>
          </div>
          {/* table */}
          <div className="overflow-x-auto p-8">
            <table className="w-full text-center ">
              <thead>
                <tr className="bg-slate-50 text-gray-500 text-sm p-4">
                  <th className="py-4 px-6 font-semibold w-16">No</th>
                  <th className="py-4 px-6 font-semibold">Nama Laporan</th>
                  <th className="py-4 px-6 font-semibold">Lokasi</th>
                  <th className="py-4 px-6 font-semibold ">Skor Prioritas</th>
                  <th className="py-4 px-6 font-semibold ">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report, index) => (
                  <tr
                    key={report.id}
                    className="hover:bg-blue-50/80 transition-colors group cursor-pointer"
                    onClick={() => setReport(report)}
                  >
                    <td>{index + 1}</td>
                    <td className="py-4 px-6 text-black-500 font-medium">
                      {report.name}
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {report.location}
                    </td>
                    <td className="py-4 px-6 text-gray-500">{report.score}</td>
                    <td className="py-4 px-6 text-center">
                      <button className="p-2 bg-gray-50 rounded-full text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <AnimatePresence>
          {selectedReport && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setReport(null)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                {/* pop up card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-[2rem] shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
                >
                  <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-slate-50">
                    <div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-3 ${getBadgeColor(selectedReport.level)}`}
                      >
                        {selectedReport.level} (Score: {selectedReport.score})
                      </span>
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        {selectedReport.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <AlertTriangle size={14} /> ID Laporan:{" "}
                        {selectedReport.id}
                      </p>
                    </div>
                    <button
                      onClick={() => setReport(null)}
                      className="p-2 bg-white rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* description */}
                  <div className="p-6 flex flex-col gap-5">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Deskripsi Kasus
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {selectedReport.desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <MapPin size={14} /> Titik Lokasi
                        </h4>
                        <p className="font-semibold text-sm text-gray-800">
                          {selectedReport.location}
                        </p>
                        <p className="text-xs text-blue-500 cursor-pointer hover:underline mt-1">
                          {selectedReport.latlng}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Calculator size={14} /> Estimasi Lentera AI
                        </h4>
                        <p className="text-sm text-gray-600">
                          Estimasi:{" "}
                          <span className="font-semibold text-gray-900">
                            {selectedReport.cost}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Skor CBA:{" "}
                          <span className="font-semibold text-gray-900">
                            {selectedReport.cba}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* button */}
                  <div className="p-6 pt-0 mt-2">
                    <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-200 transition-colors">
                      Tindak Lanjuti Sekarang
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
export default ReportTable;
