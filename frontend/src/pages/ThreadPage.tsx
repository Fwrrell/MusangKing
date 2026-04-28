import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Clock3,
  Heart,
  MessageCircle,
  Navigation,
  Send,
  Share2,
  UserRound,
  Loader2,
  WalletCards,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const STATUS_MAP: Record<string, { stage: string; label: string }> = {
  pending: { stage: "reported", label: "Menunggu" },
  verified: { stage: "review", label: "Diverifikasi" },
  in_progress: { stage: "action", label: "Dikerjakan" },
  resolved: { stage: "resolved", label: "Selesai" },
  rejected: { stage: "reported", label: "Ditolak" },
};

const steps = [
  { key: "reported", label: "Laporan Masuk", icon: Check },
  { key: "review", label: "Tervalidasi", icon: MessageCircle },
  { key: "action", label: "Tindak Lanjut", icon: UserRound },
  { key: "resolved", label: "Selesai", icon: CheckCheck },
];

function cls(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ThreadPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState("Memuat lokasi...");

  const [voteCount, setVoteCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/reports/${slug}`,
        );
        const result = await response.json();

        if (response.ok) {
          setReportData(result.data);

          const currentDeviceId = localStorage.getItem("device_id");
          setVoteCount(result.data.votes?.length || 0);
          setHasVoted(
            result.data.votes?.some(
              (v: any) => v.device_id === currentDeviceId,
            ),
          );

          // Reverse geocoding untuk dapetin alamat dari lat, long
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${result.data.latitude}&lon=${result.data.longitude}`,
          )
            .then((res) => res.json())
            .then((data) => setAddress(data.display_name))
            .catch(() =>
              setAddress(
                "Koordinat: " +
                  result.data.latitude +
                  ", " +
                  result.data.longitude,
              ),
            );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col">
        <h1 className="text-2xl font-bold text-slate-800">
          Laporan tidak ditemukan
        </h1>
        <button
          onClick={() => navigate("/app")}
          className="mt-4 text-blue-600 underline"
        >
          Kembali ke Peta
        </button>
      </div>
    );
  }

  const currentStatusInfo = STATUS_MAP[reportData.status] || STATUS_MAP.pending;
  const stageIndex = steps.findIndex((s) => s.key === currentStatusInfo.stage);

  const firstEntry = reportData.entries?.[0];
  const reporterName = firstEntry?.user?.name || "Warga Anonim";
  const reporterAvatar =
    firstEntry?.user?.avatar_url ||
    `https://api.dicebear.com/9.x/notionists/svg?seed=${reporterName}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const TopBar = () => (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-slate-50/85 backdrop-blur-xl lg:border-b-0">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-blue-700 transition hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-slate-950 sm:text-lg">
              Detail Laporan
            </p>
          </div>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100"
          onClick={handleCopy}
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </header>
  );

  const ImageGallery = () => {
    const [activeImage, setActiveImage] = useState(0);
    const images = reportData.image_url || [];

    if (images.length === 0) return null;

    return (
      <section className="overflow-hidden bg-white shadow-sm ring-1 ring-slate-200/80 sm:rounded-[2rem]">
        <div className="grid h-[360px] grid-cols-1 gap-1 sm:h-[440px] lg:grid-cols-[1fr_240px] xl:grid-cols-[1fr_260px]">
          <button
            className="group relative min-h-0 overflow-hidden text-left"
            onClick={() => setActiveImage(0)}
          >
            <img
              src={images[activeImage]}
              alt="Foto utama"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          </button>
          <div className="hidden gap-1 lg:grid">
            {images.slice(1, 4).map((img: string, index: number) => (
              <button
                key={index}
                className="group relative overflow-hidden"
                onClick={() => setActiveImage(index + 1)}
              >
                <img
                  src={img}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const HeroCard = () => (
    <article className="overflow-hidden bg-white shadow-sm ring-1 ring-slate-200/80 sm:rounded-[2rem]">
      <ImageGallery />
      <div className="p-5 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-700">
              #{reportData.id.split("-")[0]} {/* ID blok pertama */}
            </p>
            <h1 className="mt-2 max-w-2xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
              {reportData.ai_headline}
            </h1>
          </div>

          <div className="flex w-full items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 sm:w-[190px]">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
              <Clock3 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
                Status:
              </p>
              <p className="mt-1 text-lg font-black leading-none">
                {currentStatusInfo.label}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Indicator */}
        <div className="mt-7 relative grid grid-cols-4 gap-2">
          <div className="absolute left-8 right-8 top-5 h-1 rounded-full bg-slate-200" />
          <div
            className="absolute left-8 top-5 h-1 rounded-full bg-blue-600 transition-all"
            style={{
              width: `calc(${(stageIndex / (steps.length - 1)) * 100}% - 2rem)`,
            }}
          />
          {steps.map((step, index) => {
            const Icon = step.icon;
            const active = index <= Math.max(0, stageIndex);
            return (
              <div
                key={step.key}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <div
                  className={cls(
                    "grid h-11 w-11 place-items-center rounded-full text-white shadow-sm ring-4 ring-white",
                    active ? "bg-blue-700" : "bg-slate-200 text-slate-400",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={cls(
                    "text-[10px] font-extrabold uppercase tracking-wide text-center",
                    active ? "text-blue-700" : "text-slate-400",
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );

  const ContextCard = () => (
    <aside className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/80 lg:sticky lg:top-24 lg:p-7">
      <h2 className="text-xl font-black text-slate-950">Konteks Laporan</h2>
      <div className="mt-7">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
          Lokasi
        </p>
        <p className="flex items-start gap-2 text-sm font-semibold leading-relaxed text-slate-800">
          <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
          {address}
        </p>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-100 px-4 py-4 text-center">
          <p className="text-2xl font-black text-slate-950">
            {reportData.votes?.length || 0}
          </p>
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
            Dukungan
          </p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-4 text-center">
          <p className="text-2xl font-black text-slate-950">
            {timeAgo(reportData.createdAt)}
          </p>
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
            Waktu Laporan
          </p>
        </div>
        <div className="col-span-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700">
              <WalletCards className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wide text-blue-500">
                Estimasi Biaya
              </p>
              <p className="mt-0.5 truncate text-lg font-black text-slate-950">
                {reportData.estimated_cost
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(Number(reportData.estimated_cost))
                  : "Belum Tersedia"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-7">
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
          Kategori
        </p>
        <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 border border-blue-200">
          {reportData.category?.name}
        </span>
      </div>
      <button
        onClick={handleVote}
        disabled={isVoting}
        className={cls(
          "mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl text-sm font-black shadow-lg transition-all duration-300",
          hasVoted
            ? "bg-rose-100 text-rose-700 shadow-rose-200/50 hover:bg-rose-200"
            : "bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-blue-700/25 hover:opacity-90",
        )}
      >
        <Heart
          className={cls(
            "h-5 w-5",
            hasVoted ? "fill-rose-700 text-rose-700" : "fill-white text-white",
          )}
        />
        {hasVoted ? "Dukungan Telah Diberikan" : "Saya Juga Merasa Dirugikan"}
      </button>
    </aside>
  );

  const CommunityVoices = () => {
    const communityEntries = reportData.entries?.slice(1) || [];

    return (
      <section className="rounded-[1.75rem] bg-slate-100 p-5 shadow-sm ring-1 ring-slate-200/60 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-950">Suara Warga</h2>
          <span className="rounded-full bg-blue-100 px-4 py-1.5 text-xs font-black text-blue-700">
            {communityEntries.length || 0} Warga
          </span>
        </div>

        <div className="space-y-5">
          {communityEntries.map((entry: any) => (
            <article
              key={entry.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      entry.user?.avatar_url ||
                      `https://api.dicebear.com/9.x/notionists/svg?seed=${entry.user?.name}`
                    }
                    className="h-9 w-9 rounded-full bg-slate-100 object-cover"
                  />
                  <div>
                    <p className="font-bold text-slate-950">
                      {entry.user?.name || "Warga"}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {timeAgo(entry.createdAt)}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {entry.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200/70">
          <textarea
            rows={3}
            placeholder="Tambahkan informasi atau fotomu ke thread ini..."
            className="w-full resize-none border-0 bg-transparent p-3 text-sm outline-none"
          />
          <div className="flex items-center justify-end">
            <button className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    );
  };

  const handleVote = async () => {
    const deviceId = localStorage.getItem("device_id");
    if (!deviceId) return alert("Perangkat tidak dikenali.");

    // solved double klik brutal
    if (isVoting) return;

    setIsVoting(true);
    setHasVoted(!hasVoted);
    setVoteCount((prev) => (hasVoted ? prev - 1 : prev + 1));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reports/${reportData.id}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device_id: deviceId }),
        },
      );

      if (!res.ok) throw new Error("Gagal memproses vote");
    } catch (err) {
      console.error(err);
      // rollback
      setHasVoted(hasVoted);
      setVoteCount((prev) => (hasVoted ? prev + 1 : prev - 1));
      alert("Gagal mengirim dukungan. Coba lagi.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <TopBar />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-0 pb-28 pt-4 sm:px-6 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:px-8 lg:pb-12">
        <div className="space-y-6">
          <HeroCard />
          <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-8 mx-4 sm:mx-0">
            <div className="flex items-start gap-4">
              <img
                src={reporterAvatar}
                alt="Reporter"
                className="h-12 w-12 rounded-full object-cover ring-4 ring-slate-100"
              />
              <div>
                <p className="font-black text-slate-950 gap-2 flex">
                  {reporterName}{" "}
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
                    Pelapor Utama
                  </span>
                </p>
              </div>
            </div>
            <p className="mt-6 text-base leading-8 text-slate-700">
              {reportData.description}
            </p>
          </section>
          <div className="px-4 sm:px-0">
            <CommunityVoices />
          </div>
        </div>
        <div className="hidden lg:block">
          <ContextCard />
        </div>
      </div>
    </main>
  );
}
