import { useState, useEffect, useRef } from "react";
import {
  X,
  MapPin,
  Search,
  UploadCloud,
  Loader2,
  LocateFixed,
  Info,
} from "lucide-react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // state lokasi
  const [position, setPosition] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState("Menunggu lokasi...");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // state laporan
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmiting, setIsSubmitting] = useState(false);

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
        fetchAddressFromCoords(coords.lat, coords.lng);
      },
      () => setAddress("Akses lokasi ditolak, gunakan peta untuk mencari."),
    );
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => getUserLocation(), 500);
      //TODO: fetch ke database table categories (DUMMY ONLY)
      setCategories([
        { id: "cat-1", name: "Jalan Berlubang" },
        { id: "cat-2", name: "Lampu Mati" },
        { id: "cat-3", name: "Fasilitas Rusak" },
      ]);
    } else {
      setStep(1);
      setImageFile(null);
      setImagePreview(null);
      setDescription("");
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen]);

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

  const handleSubmit = async () => {
    if (!selectedCategory || !imageFile || !description) {
      alert("Harap lengkapi kategori, foto, dan deskripsi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const deviceId = localStorage.getItem("device_id");
      const formData = new FormData();
      formData.append("categoryId", selectedCategory);
      formData.append("raw_description", description);
      formData.append("latitude", position.lat.toString());
      formData.append("longitude", position.lng.toString());
      if (deviceId) formData.append("reporter_device_id", deviceId);
      formData.append("image", imageFile);

      const response = await fetch("http://localhost:3000/api/reports", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Laporan kamu berhasil dikirim!");
        onClose();
        // TODO: Refresh map laporan utama di sini
      } else {
        alert(`Gagal: ${result.message}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Terjadi kesalahan server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 supports-backdrop-filter:backdrop-blur-xs bg-black/30 flex items-center justify-center z-[9999]">
      <div className="w-[900px] h-[600px] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        {/* LEFT SIDE (Stepper) */}
        <div className="w-1/3 bg-zinc-50 p-6 flex flex-col justify-between">
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
          <div className="bg-white border rounded-xl p-3 text-sm shadow-sm">
            <div className="flex items-center gap-2 text-zinc-500 mb-1">
              <MapPin size={16} />
              <span>Lokasi Terdeteksi</span>
            </div>
            <p className="text-zinc-700">{address}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-2/3 p-8 relative flex flex-col h-full">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-zinc-100 hover:bg-zinc-200 p-2 rounded-full transition-colors z-[10000]"
          >
            <X size={18} className="text-black" />
          </button>
          <div className="flex-1 overflow-y-auto pr-2 pb-16">
            {/* STEP 1: DETAIL LOKASI */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold mb-4 text-black">
                  Tandai Titik Kerusakan
                </h2>

                <div className="w-full h-[220px] bg-zinc-100 rounded-xl mb-5 overflow-hidden border border-zinc-200 relative z-0">
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

                {/* Search Box + GPS Button */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
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
                    <div className="relative flex-1 flex items-center gap-2 border border-zinc-300 rounded-xl px-3 py-2.5 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <Search size={18} className="text-zinc-800" />
                      <input
                        type="text"
                        placeholder="-6.9147, 107.6098 atau Nama Jalan..."
                        value={searchQuery}
                        onChange={handleSearchInput}
                        className="w-full outline-none text-sm bg-transparent text-black"
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
                      className="p-3 border border-zinc-300 rounded-xl bg-white hover:bg-zinc-50 hover:border-zinc-400 hover:text-blue-600 transition-all text-zinc-500 shadow-sm"
                    >
                      <LocateFixed size={20} />
                    </button>
                  </div>
                </div>

                {/* Kategori */}
                <div>
                  <p className="text-sm font-semibold text-zinc-800 mb-3">
                    Kategori Infrastruktur
                  </p>
                  <div className="flex gap-2 flex-wrap">
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
                    placeholder="Ceritakan detail kerusakan yang kamu lihat. Semakin jelas, semakin cepat diproses..."
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
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
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* FOOTER */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pt-4 border-t border-zinc-100 flex justify-between items-center bg-white z-[100] rounded-br-2xl">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
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
                  (!selectedCategory || address === "Menunggu lokasi...")
                }
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                Lanjut ke Tahap {step + 1}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmiting}
                className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-zinc-800 disabled:opacity-70 flex items-center gap-2 transition-all"
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
