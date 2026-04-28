import {
  BookOpenText,
  FileBox,
  BadgeCheck,
  Pickaxe,
  Activity,
  MapPinCheck,
  ArrowUp,
  BarChart3,
  MapPin,
  ArrowRight,
} from "lucide-react";

import megaMendung from "@/assets/mega_mendung.jpeg";
import { CounterUp } from "@/components/ui/counterup";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const RecapSection = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    verifiedReports: 0,
    resolvedReports: 0,
    inProgressReports: 0,
    reportsToday: 0,
    topCategoryName: "Memuat...",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/reports/stats`,
        );
        const result = await response.json();

        if (response.ok) {
          setStats(result.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data recap", err);
      }
    };
    fetchStats();
  }, []);

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <>
      <div className="w-full bg-[#fbfef9]">
        <section className="relative flex flex-col items-center overflow-hidden bg-gradient-to-b from-[#fbfef9] via-slate-50 to-white px-4 py-14 sm:px-6 md:py-20">
          <motion.div
            animate={{
              x: [0, 15, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -right-48 top-8 opacity-[0.08] md:right-0 md:opacity-[0.1]"
          >
            <img src={megaMendung} className="w-72 md:w-100" />
          </motion.div>

          <motion.div
            animate={{
              x: [0, 20, 0],
              y: [10, 0, -0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -left-44 bottom-20 opacity-[0.08] md:left-0 md:bottom-90 lg:bottom-70 md:opacity-[0.1]"
          >
            <img src={megaMendung} className="w-72 md:w-100" />
          </motion.div>

          <div className="relative z-10 flex w-full max-w-7xl flex-col items-center">
            <div className="mb-8 max-w-2xl text-center md:mb-10">
              <h2 className="text-2xl font-black tracking-tight text-[#23395b] sm:text-3xl md:text-4xl">
                Rekap Laporan
              </h2>

              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500 md:text-base">
                Ringkasan perkembangan laporan warga berdasarkan status,
                aktivitas, dan kategori laporan terbanyak.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group flex min-h-[150px] items-center gap-4 rounded-3xl border border-white bg-white/90 p-5 shadow-[0_12px_35px_rgba(35,57,91,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(35,57,91,0.12)]">
                {/* header card section */}
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-blue-50 md:size-16">
                  <BookOpenText
                    color="#306ECA"
                    className="h-6 w-6 md:h-8 md:w-8"
                  />
                </div>

                {/* text section */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-500 md:text-base">
                    Total Laporan Masuk
                  </span>

                  <span className="text-2xl font-black text-[#23395b] md:text-3xl">
                    <CounterUp
                      key={stats.totalReports}
                      from={0}
                      to={stats.totalReports}
                    />
                  </span>

                  <div className="flex flex-wrap items-center gap-1 text-xs font-bold text-green-600 md:text-sm">
                    <ArrowUp size={14} />
                    <span>12.5%</span>
                    <span className="font-semibold text-gray-400">
                      bulan lalu
                    </span>
                  </div>
                </div>
              </div>

              <div className="group flex min-h-[150px] items-center gap-4 rounded-3xl border border-white bg-white/90 p-5 shadow-[0_12px_35px_rgba(35,57,91,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(35,57,91,0.12)]">
                {/* header card section */}
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-green-50 md:size-16">
                  <BadgeCheck
                    color="#48A111"
                    className="h-6 w-6 md:h-8 md:w-8"
                  />
                </div>

                {/* text section */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-500 md:text-base">
                    Laporan Diverifikasi
                  </span>

                  <span className="text-2xl font-black text-[#23395b] md:text-3xl">
                    <CounterUp
                      key={stats.verifiedReports}
                      from={0}
                      to={stats.verifiedReports}
                    />
                  </span>

                  <span className="text-xs font-semibold text-gray-400 md:text-sm">
                    {getPercentage(stats.verifiedReports, stats.totalReports)}%
                    dari total laporan
                  </span>
                </div>
              </div>

              <div className="group flex min-h-[150px] items-center gap-4 rounded-3xl border border-white bg-white/90 p-5 shadow-[0_12px_35px_rgba(35,57,91,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(35,57,91,0.12)]">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[rgba(255,215,134,0.22)] md:size-16">
                  <MapPinCheck
                    color="rgb(255, 190, 70)"
                    className="h-6 w-6 md:h-8 md:w-8"
                  />
                </div>

                {/* text section */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-500 md:text-base">
                    Total Diselesaikan
                  </span>

                  <span className="text-2xl font-black text-[#23395b] md:text-3xl">
                    <CounterUp
                      key={stats.resolvedReports}
                      from={0}
                      to={stats.resolvedReports}
                    />
                  </span>

                  <span className="text-xs font-semibold text-gray-400 md:text-sm">
                    {getPercentage(stats.resolvedReports, stats.totalReports)}%
                    dari total laporan{" "}
                  </span>
                </div>
              </div>

              <div className="group flex min-h-[150px] items-center gap-4 rounded-3xl border border-white bg-white/90 p-5 shadow-[0_12px_35px_rgba(35,57,91,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(35,57,91,0.12)]">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gray-50 md:size-16">
                  <Pickaxe color="#57595b" className="h-6 w-6 md:h-8 md:w-8" />
                </div>

                {/* text section */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-500 md:text-base">
                    Total Ditindaklanjuti
                  </span>

                  <span className="text-2xl font-black text-[#23395b] md:text-3xl">
                    <CounterUp
                      key={stats.inProgressReports}
                      from={0}
                      to={stats.inProgressReports}
                    />
                  </span>

                  <span className="text-xs font-semibold text-gray-400 md:text-sm">
                    60% dari total laporan
                  </span>
                </div>
              </div>

              <div className="group flex min-h-[150px] items-center gap-4 rounded-3xl border border-white bg-white/90 p-5 shadow-[0_12px_35px_rgba(35,57,91,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(35,57,91,0.12)]">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-orange-50 md:size-16">
                  <Activity color="#F45B26" className="h-6 w-6 md:h-8 md:w-8" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-500 md:text-base">
                    Laporan per Hari
                  </span>

                  <span className="text-2xl font-black text-[#23395b] md:text-3xl">
                    <CounterUp
                      key={stats.reportsToday}
                      from={0}
                      to={stats.reportsToday}
                    />{" "}
                    <span className="text-base md:text-lg">laporan</span>
                  </span>

                  <div className="flex flex-wrap items-center gap-1 text-xs font-bold text-green-600 md:text-sm">
                    <ArrowUp color="#6FCF97" size={14} />
                    <span>10%</span>
                    <span className="font-semibold text-gray-400">
                      bulan lalu
                    </span>
                  </div>
                </div>
              </div>

              <div className="group flex min-h-[150px] items-center gap-4 rounded-3xl border border-white bg-white/90 p-5 shadow-[0_12px_35px_rgba(35,57,91,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(35,57,91,0.12)]">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-purple-50 md:size-16">
                  <FileBox color="#7c3aed" className="h-6 w-6 md:h-8 md:w-8" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-500 md:text-base">
                    Jenis Kasus Terbanyak
                  </span>

                  <span className="text-xl font-black text-[#23395b] md:text-2xl">
                    {stats.topCategoryName}{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <section className="relative z-10 w-full max-w-7xl px-0 pt-10 md:pt-14">
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              {/* card statistik */}
              <motion.div
                whileHover={{ y: -8 }}
                className="group relative flex h-full min-h-[260px] w-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-[0_16px_45px_rgba(39,111,191,0.10)] md:p-8"
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-white shadow-sm md:size-16">
                    <BarChart3 className="h-8 w-8 text-blue-600 md:h-10 md:w-10" />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <h3 className="mb-3 text-2xl font-black text-[#23395b] md:text-3xl">
                      Statistik Laporan
                    </h3>

                    <p className="mb-8 text-sm font-medium leading-relaxed text-gray-600 md:text-base">
                      Pantau hasil dan respon pemerintah terhadap laporan hingga
                      transparansi anggaran perbaikan.
                    </p>

                    <a
                      href="#"
                      className="mt-auto inline-flex items-center text-sm font-black text-blue-600 transition-all group-hover:gap-2 md:text-base"
                    >
                      Lihat statistik lebih lanjut
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -8,
                }}
                className="group relative flex h-full min-h-[260px] w-full flex-col overflow-hidden rounded-[2rem] border border-green-100 bg-gradient-to-br from-green-50 to-white p-6 shadow-[0_16px_45px_rgba(34,197,94,0.10)] md:p-8"
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-white shadow-sm md:size-16">
                    <MapPin className="h-8 w-8 text-green-600 md:h-10 md:w-10" />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <h3 className="mb-3 text-2xl font-black text-[#23395b] md:text-3xl">
                      Peta Laporan
                    </h3>

                    <p className="mb-8 text-sm font-medium leading-relaxed text-gray-600 md:text-base">
                      Telusuri & berikan dukungan titik lokasi laporan dari
                      masyarakat secara real-time di seluruh kecamatan.
                    </p>

                    <a
                      href="#"
                      className="mt-auto inline-flex items-center text-sm font-black text-green-600 transition-all group-hover:gap-2 md:text-base"
                    >
                      Lihat peta <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </section>
      </div>
    </>
  );
};

export default RecapSection;
