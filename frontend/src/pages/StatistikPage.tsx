import { useEffect, useMemo, useState } from "react";
import { Funnel, Loader2 } from "lucide-react";
import bandungGeoJSON from "@/data/3273-kota-bandung-level-kecamatan.json";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import ReportTable from "@/components/ReportTable";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

import { CounterUp } from "@/components/ui/counterup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

ChartJS.register(
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
);

const stackedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: 10 },
  plugins: { legend: { position: "top" as const } },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      border: { display: false },
    },
    y: {
      stacked: true,
      grid: { color: "#f3f4f6" },
      border: { display: false },
    },
  },
};

const optionsBase = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 10,
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
    },
    y: {
      grid: { color: "#f3f4f6" },
      border: { display: false },
    },
  },
};

const lineOption = {
  Responsive: true,
  maintainAspectRatio: false,
  layout: { padding: 10 },
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, border: { display: false } },
    y: { grid: { color: "#f3f4f6" }, border: { display: false } },
  },
};

export function StatistikPage() {
  const [kecamatan, setKecamatan] = useState("Semua Kecamatan");
  const [rawData, setRawData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/reports`,
        );
        const result = await response.json();

        if (response.ok) {
          setRawData(result.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data laporan:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, []);

  const getKecamatanName = (feature: any) => {
    return (
      feature?.properties?.nama_kecamatan ||
      feature?.properties?.WADMKC ||
      "Tidak Diketahui"
    );
  };

  // selector database
  const currentData = useMemo(() => {
    let filteredReports = rawData;

    if (kecamatan !== "Semua Kecamatan") {
      const targetFeature = (bandungGeoJSON as any).feature.find(
        (f: any) => getKecamatanName(f) === kecamatan,
      );

      if (targetFeature) {
        filteredReports = rawData.filter((r: any) => {
          const pt = point([Number(r.longitude), Number(r.latitudes)]);
          return booleanPointInPolygon(pt, targetFeature);
        });
      }
    }

    //jumlah laporan bulanan
    const jumlahLaporan = Array(12).fill(0);
    const laporanSelesai = Array(12).fill(0);
    const laporanDiproses = Array(12).fill(0);
    const laporanPending = Array(12).fill(0);
    let totalSelesai = 0;

    const kategoriCount: Record<string, number> = {};
    const kategoriCost: Record<string, number> = {};

    // data laporan akan satu per satu di cek
    filteredReports.forEach((r: any) => {
      const date = new Date(r.createdAt);
      const month = date.getMonth(); // 0-11

      jumlahLaporan[month]++;

      if (r.status === "resolved") {
        laporanSelesai[month]++;
        totalSelesai++;
      } else if (r.status === "in_progress") {
        laporanDiproses[month]++;
      } else {
        laporanPending[month]++;
      }

      const catName = r.category?.name || "Belum Dikategorikan";
      kategoriCount[catName] = (kategoriCount[catName] || 0) + 1;

      // ambil estimasi biaya
      const cost = Number(r.estimated_cost || 0);
      kategoriCost[catName] = (kategoriCost[catName] || 0) + cost;
    });

    return {
      jumlahLaporan,
      laporanSelesai,
      laporanDiproses,
      laporanPending,
      totalSelesai,
      kategoriLabels: Object.keys(kategoriCount),
      kategoriValues: Object.values(kategoriCount),
      kategoriCostLabels: Object.keys(kategoriCost),
      kategoriCostValues: Object.values(kategoriCost),
    };
  }, [rawData, kecamatan]); // count ulang saat rawData atau dropdown berubah

  const labelsBulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const dataLaporan = {
    labels: labelsBulan,
    datasets: [
      {
        label: "Jumlah Laporan",
        data: currentData.jumlahLaporan,
        backgroundColor: "#2563EB",
        borderRadius: 4,
      },
    ],
  };

  // data laporan selesai
  const dataDiselesaikan = {
    labels: labelsBulan,
    datasets: [
      {
        label: "Laporan Selesai",
        data: currentData.laporanSelesai,
        borderColor: "#ceaa0d",
        backgroundColor: "#ceaa0d",
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const colors = [
    "rgb(90, 156, 181)",
    "rgb(250, 206, 104)",
    "rgb(250, 172, 104)",
    "rgb(250, 104, 104)",
    "rgb(156, 163, 175)",
  ];

  // data banyak kerusakan tiap jenis
  const banyakKerusakan = {
    labels: currentData.kategoriLabels.length
      ? currentData.kategoriLabels
      : ["Kosong"],
    datasets: [
      {
        label: "Jenis Kerusakan",
        data: currentData.kategoriValues.length
          ? currentData.kategoriValues
          : [1],
        backgroundColor: currentData.kategoriValues.length
          ? colors
          : ["#f3f4f6"],
        borderWidth: 0,
      },
    ],
  };

  // data alokasi dana tiap jenis kerusakan
  const alokasiDana = {
    labels: currentData.kategoriCostLabels.length
      ? currentData.kategoriCostLabels
      : ["Kosong"],
    datasets: [
      {
        label: "Jenis Kerusakan",
        data: currentData.kategoriCostValues.length
          ? currentData.kategoriCostValues
          : [1],
        backgroundColor: currentData.kategoriCostValues.length
          ? colors
          : ["#f3f4f6"],
        borderWidth: 0,
      },
    ],
  };

  const dataStatusLaporan = {
    labels: labelsBulan,
    datasets: [
      {
        label: "Selesai",
        data: currentData.laporanSelesai,
        backgroundColor: "#2563EB",
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 4,
          bottomRight: 4,
        },
      },
      {
        label: "Diproses",
        data: currentData.laporanDiproses,
        backgroundColor: "#F59E0B",
        borderRadius: 0,
      },
      {
        label: "Pending",
        data: currentData.laporanPending,
        backgroundColor: "#9CA3AF",
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    ],
  };

  const optionsDropdown = [
    { value: "Semua Kecamatan", label: "Semua Kecamatan" },
    ...bandungGeoJSON.features.map((feature: any) => ({
      value: getKecamatanName(feature),
      label: getKecamatanName(feature),
    })),
  ];

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-4 md:p-10 bg-slate-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div className="flex flex-col gap-3">
            <h1 className="font-bold text-2xl md:text-[2rem] leading-tight">
              Statistik Laporan
            </h1>
            <p className="text-md font-normal capitalize">
              ingin tahu perkembangannya? <br />
              pilih sesuai posisi kecamatanmu.
            </p>
          </div>
          {/* filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 bg-white px-4 py-2 w-full md:w-auto rounded-xl shadow-sm cursor-pointer">
                <Funnel className="text-gray-700" />
                <span className="text-gray-700 font-medium">
                  {kecamatan || "Semua Kecamatan"}
                </span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white z-50 rounded-xl shadow-sm">
              {optionsDropdown.map((opt: any) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setKecamatan(opt.value)}
                  className="cursor-pointer text-black font-medium text-lg"
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-3 mb-5 mt-5">
          <div className="md:col-span-2 bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-center items-center h-96">
            <h3 className="font-semibold text-[1.2rem] capitalize">
              jumlah laporan Bulanan
            </h3>
            <p className="text-light text-gray-600">per maret 2026</p>
            <div className="flex-1 w-full relative min-h-0">
              <Bar options={optionsBase} data={dataLaporan} />
            </div>
          </div>
          <div className="md:col-span-1 bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center h-96">
            <div className="text-center mb-4 shrink-0">
              <h3 className="font-semibold text-[1.2rem] capitalize">
                total laporan selesai
              </h3>
              <p className="text-light text-gray-600">per maret 2026</p>
            </div>
            <span className="text-2xl font-semibold mb-4 shrink-0">
              <CounterUp from={0} to={currentData.totalSelesai} />
            </span>
            <div className="flex-1 min-h-0 w-full relative ">
              <Line data={dataDiselesaikan} options={lineOption} />
            </div>
          </div>
          <div className="md:col-span-1 bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center h-96">
            <div className="text-center mb-4 shrink-0">
              <h3 className="font-semibold text-[1.2rem] capitalize">
                jenis kerusakan terbanyak
              </h3>
              <p className="text-light text-gray-600">per maret 2026</p>
            </div>
            <div className="flex-1 items-center relative w-full min-h-0 pb-4 ">
              <Pie
                data={banyakKerusakan}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                  },
                }}
              />
            </div>
          </div>
          <div className="md:col-span-1 bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-center h-96 items-center gap-2">
            <div className="text-center mb-4 shrink-0">
              <h3 className="font-semibold text-[1.2rem] capitalize">
                proporsi laporan selesai
              </h3>
              <p className="text-light text-gray-600">per maret 2026</p>
            </div>
            <div className="flex-1 items-center min-h-0 relative pb-4">
              <Bar
                key={`bar-${kecamatan}`}
                options={stackedOptions}
                data={dataStatusLaporan}
              />
            </div>
          </div>
          <div className="md:col-span-1 bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-center h-96 items-center gap-2">
            <div className="text-center mb-2 shrink-0">
              <h3 className="font-semibold text-[1.2rem] capitalize">
                total penggunaan dana
              </h3>
              <p className="text-light text-gray-600">per maret 2026</p>
            </div>
            <div className="flex-1 items-center min-h-0 relative pb-4">
              <Doughnut
                key={`dana-${kecamatan}`}
                data={alokasiDana}
                options={{
                  maintainAspectRatio: false,
                  cutout: "60%",
                  plugins: {
                    legend: { position: "top" },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <ReportTable />
      </div>
    </>
  );
}
