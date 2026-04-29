import { useState, useEffect, useRef } from "react";
import {
  X,
  MapPin,
  Search,
  UploadCloud,
  Loader2,
  LocateFixed,
  Info,
  ChevronDown,
  ArrowRight,
  FileText,
  AlertCircle,
} from "lucide-react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import bandungGeoJSON from "@/data/3273-kota-bandung-level-kecamatan.json";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Koordinat default (Bandung)
const DEFAULT_CENTER = { lat: -6.9147, lng: 107.6098 };

export default function AddReportModal({
  isOpen,
  onClose,
}: AddReportModalProps) {
  const mapRef = useRef<L.Map>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<
    { id: string; name: string; color: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // state lokasi
  const [position, setPosition] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState("Menunggu lokasi...");

  const [isValidLocation, setIsValidLocation] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // state laporan
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmiting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      setAddress(data.display_name || "Alamat tidak ditemukan");
    } catch {
      setAddress("Gagal mengambil alamat");
    }
  };

  const MapEventsHandler = () => {
    useMapEvents({
      dragstart: () => {
        setIsDragging(true);
        setAddress("Mencari lokasi...");
      },
      dragend: (e) => {
        setIsDragging(false);
        const map = e.target;
        const center = map.getCenter();
        setPosition({ lat: center.lat, lng: center.lng });

        setIsValidLocation(validateLocation(center.lat, center.lng));
        fetchAddressFromCoords(center.lat, center.lng);
      },
    });
    return null;
  };

  const getUserLocation = () => {
    setAddress("Mencari lokasi Anda...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);
        mapRef.current?.flyTo(coords, 16);

        setIsValidLocation(validateLocation(coords.lat, coords.lng));
        fetchAddressFromCoords(coords.lat, coords.lng);
      },
      () => setAddress("Akses lokasi ditolak, gunakan peta untuk mencari."),
    );
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => getUserLocation(), 500);
      if (categories.length === 0) {
        const fetchCategories = async () => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/categories`,
            );
            const result = await response.json();

            if (response.ok) {
              setCategories(result.data);
            } else {
              console.error("Gagal mengambil categories: ", result.message);
            }
          } catch (err) {
            console.error("Error fetching categories: ", err);
          }
        };
        fetchCategories();
      }
    } else {
      setStep(1);
      setImageFile(null);
      setImagePreview(null);
      setDescription("");
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen, categories.length]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    // REGEX untuk cek user input koordinat bukan
    const coordinateRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;

    if (coordinateRegex.test(val)) {
      // kalo koordinat
      setIsSearching(true);
      searchTimeout.current = setTimeout(() => {
        const [latStr, lngStr] = val.split(",");
        const coords = {
          lat: parseFloat(latStr.trim()),
          lng: parseFloat(lngStr.trim()),
        };
        setPosition(coords);
        mapRef.current?.flyTo(coords, 16);
        setIsValidLocation(validateLocation(coords.lat, coords.lng));
        fetchAddressFromCoords(coords.lat, coords.lng);
        setSearchResults([]);
        setIsSearching(false);
      }, 800);
    } else if (val.trim().length > 2) {
      // kalo input nama lokasi
      setIsSearching(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${val} Bandung&addressdetails=1`,
          );
          const data = await res.json();
          setSearchResults(data);
        } catch {
          console.error("Search error");
        } finally {
          setIsSearching(false);
        }
      }, 800);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleSearchResult = (result: any) => {
    const coords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    setPosition(coords);

    setIsValidLocation(validateLocation(coords.lat, coords.lng));
    setAddress(result.display_name);
    mapRef.current?.flyTo(coords, 16);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!selectedCategory || !imageFile || !description) {
      alert("Harap lengkapi kategori, foto, dan deskripsi.");
      return;
    }

    const deviceId = localStorage.getItem("device_id");
    const formData = new FormData();
    formData.append("categoryId", selectedCategory);
    formData.append("raw_description", description);
    formData.append("latitude", position.lat.toString());
    formData.append("longitude", position.lng.toString());
    if (deviceId) formData.append("reporter_device_id", deviceId);
    formData.append("image", imageFile);

    fetch(`${import.meta.env.VITE_API_URL}/api/reports`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(
          "Laporan berhasil masuk antrean backend: ",
          result,
          // TODO: next bisa panggil global state
        );
      })
      .catch((error) => {
        console.error("Gagal mengirim laporan: ", error);
      });

    alert(
      "Laporan kamu berhasil dikirim, lihat progresnya di LaporanKu. Terima Kasih atas Laporannya. ",
    );
    onClose();
    navigate("/app/laporanku");
  };

  if (!isOpen) return null;

  const stepItems = ["Detail Lokasi", "Foto & Deskripsi", "Kirim Laporan"];

  // pastiin tkp di bandung
  const validateLocation = (lat: number, lng: number) => {
    const pt = point([lng, lat]);
    let isInside = false;

    for (const feature of (bandungGeoJSON as any).features) {
      if (booleanPointInPolygon(pt, feature)) {
        isInside = true;
        break; // kalo ternyata didalem kecamatan, stop
      }
    }
    return isInside;
  };

  return (
    <div className="fixed inset-0 bg-white md:supports-backdrop-filter:backdrop-blur-xs md:bg-black/30 flex items-center justify-center z-[9999]">
      <div className="w-full h-full md:w-[900px] md:h-[600px] bg-[#f7fafc] md:bg-white md:rounded-2xl md:shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* MOBILE HEADER */}
        <div className="md:hidden bg-[#f7fafc] px-5 pt-9 pb-5 shadow-sm">
          <div className="flex items-center justify-between px-2">
            <h1 className="text-[28px] font-extrabold text-[#415963] tracking-tight">
              Submit Report
            </h1>
            <button
              onClick={onClose}
              className=" -mr-2 text-[#415963] bg-zinc-100 hover:bg-zinc-200 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* MOBILE STEPPER */}
        <div className="md:hidden bg-[#f7fafc] px-10 pt-8 pb-7">
          <div className="relative grid grid-cols-3 items-start text-center">
            <div className="absolute left-0 right-0 top-6 h-[3px] bg-slate-200" />
            <div
              className="absolute left-0 top-6 h-[3px] bg-[#a9c7d2] transition-all"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
            {stepItems.map((label, index) => {
              const stepNumber = index + 1;
              const active = step === stepNumber;
              const completed = step > stepNumber;
              return (
                <div
                  key={label}
                  className="relative z-10 flex flex-col items-center gap-3"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-extrabold shadow-sm ${
                      active || completed
                        ? "bg-[#455f68] text-white"
                        : "bg-slate-200 text-[#2e3d42]"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <p
                    className={`text-base font-semibold leading-tight ${
                      active ? "text-[#415963]" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* LEFT SIDE (Stepper) */}
        <div className="hidden md:flex w-1/3 bg-zinc-50 p-6 flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-black">
              Lapor Kerusakan
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Bantu kami memperbaiki fasilitas publik dengan melaporkan
              kerusakan secara detail.
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-5">
              {["Detail Lokasi", "Foto & Deskripsi", "Kirim Laporan"].map(
                (label, i) => {
                  const stepNum = i + 1;
                  const active = step === stepNum;

                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium 
                      ${active ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-500"}`}
                      >
                        {stepNum}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            active ? "text-zinc-900" : "text-zinc-400"
                          }`}
                        >
                          {label}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {stepNum === 1 && "Tandai titik di peta"}
                          {stepNum === 2 && "Upload bukti kondisi"}
                          {stepNum === 3 && "Review dan konfirmasi"}
                        </p>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
          {/* Detected location */}
          <div
            className={`border rounded-xl p-3 text-sm shadow-sm transition-colors ${isValidLocation ? "bg-white border-zinc-200" : "bg-red-50 border-red-300"}`}
          >
            <div
              className={`flex items-center gap-2 mb-1 ${isValidLocation ? "text-zinc-500" : "text-red-500 font-bold"}`}
            >
              <MapPin size={16} />
              <span>Lokasi Terdeteksi</span>
            </div>
            <p
              className={`${isValidLocation ? "text-zinc-700" : "text-red-700"}`}
            >
              {address}
            </p>

            {!isValidLocation && (
              <div className="mt-2 text-xs font-bold text-red-600 flex items-start gap-1">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <p>Area ini berada di luar cakupan wilayah Kota Bandung.</p>
              </div>
            )}
          </div>{" "}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-2/3 px-6 md:p-8 relative flex flex-col h-full min-h-0 bg-[#f7fafc] md:bg-white">
          <button
            onClick={onClose}
            className="hidden md:block absolute top-6 right-6 bg-zinc-100 hover:bg-zinc-200 p-2 rounded-full transition-colors z-[10000]"
          >
            <X size={18} className="text-black" />
          </button>
          <div className="flex-1 overflow-y-auto md:pr-2 pb-28 md:pb-16 min-h-0">
            {/* STEP 1: DETAIL LOKASI */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="hidden md:block text-xl font-bold mb-4 text-black">
                  Tandai Titik Kerusakan
                </h2>

                <div className="w-full h-[330px] md:h-[220px] bg-zinc-100 rounded-[34px] md:rounded-xl mb-5 overflow-hidden border border-zinc-200 relative z-0 shadow-sm">
                  <MapContainer
                    center={position}
                    zoom={16}
                    zoomControl={false}
                    attributionControl={false}
                    style={{ height: "100%", width: "100%" }}
                    ref={mapRef}
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <MapEventsHandler />
                  </MapContainer>

                  {/* Fixed pinpoint tengah */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-[400] pointer-events-none drop-shadow-md">
                    <div
                      className={`transition-transform duration-200 ${isDragging ? "-translate-y-2 scale-110" : ""}`}
                    >
                      <img
                        src={markerIcon}
                        alt="Pin"
                        className="w-6 h-10 object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:hidden mb-7 flex items-start gap-3 px-4 text-slate-500">
                  <Info
                    size={18}
                    className="mt-1 shrink-0 fill-slate-500 text-white"
                  />
                  <p className="text-lg leading-snug">
                    Geser peta untuk menentukan titik kerusakan yang akurat.
                  </p>
                </div>

                {/* Search Box + GPS Button */}
                <div className="mb-6">
                  <label className="hidden md:flex items-center gap-2 text-sm font-semibold text-zinc-800">
                    <span>Cari Alamat Spesifik</span>
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-400 font-normal text-xs italic">
                        atau paste koordinat
                      </span>
                      <a href="https://google.com">
                        <Info
                          size={14}
                          className="text-zinc-400 cursor-pointer"
                        />
                      </a>
                    </div>
                  </label>

                  <div className="flex items-center gap-3 mt-2 relative">
                    <div className="relative flex-1 flex items-center gap-4 border border-zinc-200 rounded-2xl md:rounded-xl px-5 md:px-3 py-5 md:py-2.5 bg-white focus-within:border-[#7fa7b4] focus-within:ring-2 focus-within:ring-[#d7e8ef] transition-all shadow-md md:shadow-none">
                      <Search size={18} className="text-zinc-800" />
                      <input
                        type="text"
                        placeholder="Cari Alamat Spesifik"
                        value={searchQuery}
                        onChange={handleSearchInput}
                        className="w-full outline-none text-xl md:text-sm bg-transparent text-black placeholder:text-slate-300"
                      />
                      {isSearching && (
                        <Loader2
                          size={16}
                          className="animate-spin text-blue-500"
                        />
                      )}

                      {/* Dropdown Hasil Pencarian */}
                      {searchResults.length > 0 && (
                        <div className="absolute top-[110%] left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-xl z-[1000] max-h-48 overflow-y-auto overflow-x-hidden">
                          {searchResults.map((res: any, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSearchResult(res)}
                              className="w-full text-left px-4 py-3 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-700 border-b last:border-b-0 transition-colors"
                            >
                              <p className="font-semibold truncate">
                                {res.name || res.display_name.split(",")[0]}
                              </p>
                              <p className="text-xs text-zinc-500 truncate mt-0.5">
                                {res.display_name}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={getUserLocation}
                      title="Gunakan lokasi saya saat ini"
                      className="hidden md:block p-3 border border-zinc-300 rounded-xl bg-white hover:bg-zinc-50 hover:border-zinc-400 hover:text-blue-600 transition-all text-zinc-500 shadow-sm"
                    >
                      <LocateFixed size={20} />
                    </button>
                  </div>
                </div>

                <div className="md:hidden mb-9 rounded-2xl border border-[#c8def7] bg-[#eef6ff] p-5 text-[#415963]">
                  <div className="mb-4 flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.16em]">
                    <LocateFixed size={20} />
                    Lokasi Terdeteksi
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#455f68] text-white">
                      <MapPin size={18} />
                    </div>
                    <p className="text-xl font-semibold leading-snug text-slate-600 line-clamp-2">
                      {address}
                    </p>
                  </div>
                </div>

                {/* Kategori */}
                <div>
                  <p className="text-2xl md:text-sm font-extrabold md:font-semibold uppercase md:normal-case text-[#415963] md:text-zinc-800 mb-5 md:mb-3 tracking-tight">
                    Kategori Infrastruktur
                  </p>
                  <div className="md:hidden mb-4 h-[3px] w-20 bg-[#a9c7d2] rounded-full -mt-3" />
                  <div className="md:hidden relative mb-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-6 py-5 pr-12 text-xl font-bold text-zinc-800 shadow-md outline-none focus:border-[#7fa7b4] focus:ring-2 focus:ring-[#d7e8ef]"
                    >
                      <option value="">Pilih Kategori Infrastruktur</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#415963]"
                      size={28}
                    />
                  </div>
                  <div className="hidden md:flex gap-2 flex-wrap">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          selectedCategory === cat.id
                            ? "bg-blue-50 text-blue-700 border-blue-500 shadow-sm"
                            : "bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: FOTO & DESKRIPSI */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold mb-4 text-black">
                  Foto & Detail Kerusakan
                </h2>

                {/* Upload Area */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-zinc-800 mb-2">
                    Unggah Foto Pendukung
                  </p>
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors overflow-hidden relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-zinc-500">
                        <UploadCloud size={32} className="mb-2" />
                        <p className="text-sm font-medium">
                          Klik untuk memilih foto
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          JPG, PNG maksimal 5MB
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* Deskripsi */}
                <div>
                  <p className="text-sm font-semibold text-zinc-800 mb-2">
                    Deskripsi Kerusakan
                  </p>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ceritakan detail kerusakan yang kamu lihat. Semakin jelas, semakin cepat membantu pihak setempat."
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none transition-all text-black"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: KONFIRMASI */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full justify-center">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    Review Laporanmu
                  </h3>
                  <p className="text-sm text-blue-700 mb-6">
                    Pastikan semua data udah bener ya sebelum dikirim untuk
                    diverifikasi oleh sistem AI dari Lentera.
                  </p>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-blue-200 pb-3">
                      <span className="text-blue-600 font-medium">
                        Kategori
                      </span>
                      <span className="font-bold text-blue-900">
                        {categories.find((c) => c.id === selectedCategory)
                          ?.name || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-blue-200 pb-3">
                      <span className="text-blue-600 font-medium">Lokasi</span>
                      <span className="font-bold text-blue-900 text-right w-2/3 line-clamp-1">
                        {address}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-blue-200 pb-3">
                      <span className="text-blue-600 font-medium">Foto</span>
                      <span className="font-bold text-blue-900">
                        {imageFile ? "Telah dilampirkan" : "Tidak ada"}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-blue-200 bg-white/80 p-4">
                      <div className="mb-3 flex items-center gap-2 text-blue-600 font-semibold">
                        <FileText size={18} />
                        <span>Deskripsi Kerusakan</span>
                      </div>
                      <p className="max-h-36 overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-blue-50/70 p-3 text-sm leading-relaxed font-medium text-blue-950">
                        {description.trim() || "Belum ada deskripsi."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* FOOTER */}
          <div className="absolute bottom-0 left-0 right-0 px-8 md:p-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:pt-4 border-t border-zinc-100 flex justify-between items-center bg-[#f7fafc] md:bg-white z-[100] md:rounded-br-2xl shadow-[0_-16px_40px_rgba(15,23,42,0.04)] md:shadow-none">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="text-lg md:text-sm font-bold md:font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                ← Kembali
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  step === 1 &&
                  (!selectedCategory ||
                    address === "Menunggu lokasi..." ||
                    !isValidLocation)
                }
                className="bg-[#8fb0bc] md:bg-blue-600 text-white px-10 md:px-6 py-5 md:py-2.5 rounded-[28px] md:rounded-xl text-xl md:text-sm font-extrabold md:font-bold shadow-xl shadow-slate-300 md:shadow-blue-200 hover:bg-[#7fa7b4] md:hover:bg-blue-700 disabled:opacity-50 disabled:grayscale transition-all cursor-pointer"
              >
                <span className="hidden md:inline">
                  Lanjut ke Tahap {step + 1}
                </span>
                <span className="md:hidden flex items-center gap-3">
                  Lanjut <ArrowRight size={28} />
                </span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmiting}
                className="bg-zinc-900 text-white px-10 md:px-6 py-5 md:py-2.5 rounded-[28px] md:rounded-xl text-xl md:text-sm font-extrabold md:font-bold shadow-xl md:shadow-md hover:bg-zinc-800 disabled:opacity-70 flex items-center gap-2 transition-all cursor-pointer"
              >
                {isSubmiting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                {isSubmiting ? "Tunggu..." : "Kirim Laporan"}
              </button>
            )}
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
