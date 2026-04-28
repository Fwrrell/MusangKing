import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, {
  type LatLngBoundsExpression,
  type LatLngTuple,
  type PathOptions,
} from "leaflet";
import bandungGeoJSON from "@/data/3273-kota-bandung-level-kecamatan.json";
import {
  Plus,
  AlertCircle,
  MapPin,
  Loader2,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

import AddReportModal from "@/components/AddReportModal";
import { useNavigate } from "react-router-dom";

const BANDUNG_CENTER: LatLngTuple = [-6.9147, 107.6098];
const BANDUNG_BOUNDS: LatLngBoundsExpression = [
  [-6.9833, 107.5458],
  [-6.834, 107.7388],
];

type Report = {
  id: string | number;
  slug: string;
  latitude: number | string;
  longitude: number | string;
  image_url?: string[];
  ai_headline?: string | null;
  description?: string | null;
  address?: string | null;
  infrastructure_category?: string | null;
  status?: string | null;
};

const lenteraPinIcon = L.divIcon({
  className: "bg-transparent",
  html: `
    <div class="relative flex h-9 w-9 items-center justify-center">
      <div class="absolute inset-0 rounded-full bg-red-400 opacity-25 animate-ping"></div>
      <div class="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#cfaeae] shadow-lg shadow-red-950/20">
        <div class="h-2.5 w-2.5 rounded-full bg-red-700"></div>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

const getKecamatanName = (feature: any) =>
  feature?.properties?.nama_kecamatan ||
  feature?.properties?.WADMKC ||
  "Tidak Diketahui";

const REPORT_FOCUS_ZOOM = 16;

function ReportMarker({
  report,
  config,
}: {
  report: Report;
  config: { label: string; class: string };
}) {
  const map = useMap();
  const navigate = useNavigate();
  const markerRef = useRef<L.Marker | null>(null);
  const position: LatLngTuple = [
    Number(report.latitude),
    Number(report.longitude),
  ];

  const focusReport = useCallback(() => {
    const marker = markerRef.current;

    map.flyTo(position, Math.max(map.getZoom(), REPORT_FOCUS_ZOOM), {
      animate: true,
      duration: 0.55,
    });

    window.setTimeout(() => {
      marker?.openPopup();

      // popup kebuka, geser viewport ke atas biar pin + popup ditengah.
      const offsetY = window.innerWidth < 640 ? -150 : -120;
      map.panBy([0, offsetY], { animate: true, duration: 0.35 });
    }, 580);
  }, [map, position]);

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={lenteraPinIcon}
      eventHandlers={{ click: focusReport }}
    >
      <Popup
        minWidth={260}
        maxWidth={320}
        closeButton={false}
        autoPan={false}
        keepInView={false}
        className="rounded-2xl"
      >
        <article className="-m-1 overflow-hidden rounded-2xl bg-white">
          {report.image_url && report.image_url.length > 0 ? (
            <img
              src={report.image_url[0]}
              alt={report.ai_headline || "Foto laporan infrastruktur"}
              className="h-32 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-24 w-full items-center justify-center bg-slate-100 text-slate-400">
              <MapPin className="h-6 w-6" />
            </div>
          )}

          <div className="space-y-3 p-3">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 rounded-full bg-amber-50 p-1.5 text-amber-600">
                <AlertCircle size={16} />
              </span>
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900">
                  {report.ai_headline || "Laporan Kerusakan Infrastruktur"}
                </h3>
                {report.infrastructure_category && (
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                    {report.infrastructure_category}
                  </p>
                )}
              </div>
            </div>

            {report.description && (
              <p className="line-clamp-4 text-xs leading-relaxed text-slate-600">
                {report.description}
              </p>
            )}

            {report.address && (
              <div className="flex items-start gap-1.5 rounded-xl bg-slate-50 px-2.5 py-2 text-[11px] leading-snug text-slate-600">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="line-clamp-2">{report.address}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${config.class}`}
              >
                {config.label}
              </span>

              <button
                className="flex rounded-full px-3 py-2 text-[11px] font-bold text-blue-600 transition hover:bg-blue-50 items-center"
                onClick={() => navigate(`/report/${report.slug}`)}
              >
                Keluhan Warga Lainnya
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </article>
      </Popup>
    </Marker>
  );
}

export default function MapDashboard() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchValidatedReports = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reports?moderation_status=approved`,
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Gagal mengambil laporan.");
      }

      setReports(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      console.error("Gagal mengambil data laporan:", err);
      setErrorMessage("Laporan belum bisa dimuat. Coba refresh peta.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchValidatedReports();
  }, [fetchValidatedReports]);

  const validReports = useMemo(
    () =>
      reports.filter((report) => {
        const lat = Number(report.latitude);
        const lng = Number(report.longitude);
        return Number.isFinite(lat) && Number.isFinite(lng);
      }),
    [reports],
  );

  const reportCount = useMemo(() => {
    const counts = new Map<string, number>();

    (bandungGeoJSON as any).features.forEach((feature: any) => {
      const name = getKecamatanName(feature);
      counts.set(name, 0);
    });

    validReports.forEach((report) => {
      const lat = Number(report.latitude);
      const lng = Number(report.longitude);

      const pt = point([lng, lat]);

      for (const feature of (bandungGeoJSON as any).features) {
        if (booleanPointInPolygon(pt, feature)) {
          const name = getKecamatanName(feature);
          counts.set(name, (counts.get(name) || 0) + 1);
          break;
        }
      }
    });

    return counts;
  }, [validReports]);

  const getColorByCount = (count: number) => {
    if (count === 0) return "#93c5fd"; // 0 Laporan: Biru (Aman/Default)
    if (count < 10) return "#fcd34d"; // 1-9 Laporan: Kuning (Waspada)
    if (count < 25) return "#fb923c"; // 10-24 Laporan: Orange (Perhatian)
    if (count < 50) return "#ea580c"; // 25-49 Laporan: Orange Kemerahan (Bahaya)
    return "#dc2626"; // 50+ Laporan: Merah Gelap (Kritis!)
  };

  const styleKecamatan = useCallback(
    (feature: any): PathOptions => {
      const name = getKecamatanName(feature);
      const totalReports = reportCount.get(name) ?? 0;

      return {
        fillColor: getColorByCount(totalReports),
        weight: 1,
        opacity: 1,
        color: "#ffffff",
        fillOpacity: totalReports > 0 ? 0.45 : 0.28,
      };
    },
    [reportCount],
  );

  const onEachKecamatan = useCallback(
    (feature: any, layer: any) => {
      const name = getKecamatanName(feature);
      const totalReports = reportCount.get(name) ?? 0;

      layer.bindTooltip(
        `<strong>${name}</strong><br/>${totalReports} Laporan`,
        { direction: "top", sticky: true },
      );

      layer.on({
        mouseover: (event: any) => {
          event.target.setStyle({ fillOpacity: 0.72, weight: 2 });
          event.target.bringToFront?.();
        },
        mouseout: (event: any) => {
          event.target.setStyle(styleKecamatan(feature));
        },
      });
    },
    [reportCount, styleKecamatan],
  );

  const status_laporan: Record<string, { label: string; class: string }> = {
    pending: {
      label: "Pending",
      class: "bg-amber-50 text-amber-700",
    },
    verified: {
      label: "Tervalidasi",
      class: "bg-emerald-50 text-emerald-700",
    },
    in_progress: {
      label: "Proses Perbaikan",
      class: "bg-yellow-50 text-yellow-700",
    },
    resolved: {
      label: "Berhasil Diperbaiki",
      class: "bg-emerald-50 text-emerald-700",
    },
    rejected: {
      label: "Ditolak",
      class: "bg-red-50 text-red-700",
    },
  };

  return (
    <section className="relative h-full min-h-[520px] w-full overflow-hidden bg-slate-100">
      <MapContainer
        center={BANDUNG_CENTER}
        zoom={13}
        minZoom={12}
        maxZoom={18}
        maxBounds={BANDUNG_BOUNDS}
        maxBoundsViscosity={1}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <GeoJSON
          key={`geojson-${validReports.length}`}
          data={bandungGeoJSON as any}
          style={styleKecamatan}
          onEachFeature={onEachKecamatan}
        />

        {validReports.map((report) => {
          const reportStatus = report.status || "pending";
          const config = status_laporan[reportStatus] || status_laporan.pending;

          return (
            <ReportMarker key={report.id} report={report} config={config} />
          );
        })}
      </MapContainer>

      <div className="absolute bottom-[calc(76px+env(safe-area-inset-bottom)+1rem)] left-0 right-0 z-40 px-4 pt-12 sm:left-auto sm:right-6 sm:bottom-6 sm:z-[900] sm:w-auto sm:bg-none sm:p-0">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-3 sm:block">
          <div className="min-w-0 sm:hidden">
            {isLoading ? (
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" /> Memuat laporan...
              </p>
            ) : errorMessage ? (
              <button
                onClick={fetchValidatedReports}
                className="flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 text-xs font-bold text-red-600 shadow-md"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            ) : null}
          </div>

          <button
            onClick={() => setIsReportOpen(true)}
            className="group flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-white shadow-2xl shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 sm:h-16 sm:px-5"
          >
            <Plus className="h-7 w-7 transition group-hover:rotate-90" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[900] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-600 shadow-xl shadow-slate-900/10 backdrop-blur">
          <Loader2 className="h-4 w-4 animate-spin" /> Memuat peta
        </div>
      )}

      {errorMessage && !isLoading && (
        <div className="absolute left-4 right-4 top-28 z-[950] mx-auto max-w-md rounded-2xl border border-red-100 bg-white/95 p-3 text-sm font-medium text-red-600 shadow-xl shadow-red-950/10 backdrop-blur sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
          {errorMessage}
        </div>
      )}

      <AddReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </section>
  );
}
