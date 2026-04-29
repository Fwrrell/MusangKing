import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

import star from "@/assets/ilustrasi/star_ai.png";
import jalan from "@/assets/ilustrasi/jalanrusak_2.jpg";
import CBA from "@/assets/ilustrasi/ilustrasi_cba.png";
import jumlah_laporan from "@/assets/ilustrasi/jumlah_laporan.jpeg";

export const ScoringCard = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };
  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const [currentFrame, setFrame] = useState(0);
  useEffect(() => {
    const timers = [1200, 1200, 1500, 2000];
    const interval = setTimeout(() => {
      setFrame((prev) => (prev < timers.length - 1 ? prev + 1 : 0));
    }, timers[currentFrame]);
    return () => clearTimeout(interval);
  }, [currentFrame]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const cbaDetails = [
    {
      root: "Baseline Cost",
      desc: "Potensi kerugian awal jika kerusakan belum ditangani.",
      leafs: [
        {
          title: "Risk Cost",
          desc: "Potensi kerugian akibat risiko keselamatan seperti kecelakaan, cedera, dan dampak bahaya lainnya.",
        },
        {
          title: "Delay Cost",
          desc: "Kerugian waktu akibat gangguan mobilitas seperti kemacetan, perlambatan, atau hambatan perjalanan.",
        },
        {
          title: "Damage Growth Cost",
          desc: "Peningkatan kerusakan jika tidak segera diperbaiki sehingga biaya dan dampaknya bisa bertambah.",
        },
        {
          title: "Accessibility Loss",
          desc: "Kerugian akibat terganggunya akses masyarakat terhadap suatu lokasi.",
        },
      ],
    },
    {
      root: "Residual Cost",
      desc: "Risiko atau gangguan yang masih tersisa setelah perbaikan dilakukan.",
      leafs: [
        {
          title: "Remaining Risk Cost",
          desc: "Risiko yang masih ada setelah perbaikan dilakukan.",
        },
        {
          title: "Remaining Delay Cost",
          desc: "Gangguan mobilitas yang masih tersisa setelah perbaikan.",
        },
      ],
    },
    {
      root: "Implementation Cost",
      desc: "Total biaya yang dibutuhkan untuk melakukan perbaikan.",
      leafs: [],
    },
  ];

  return (
    <>
      <div className="relative mt-6 w-full overflow-hidden rounded-[2rem] border border-[#276fbf]/10 bg-white py-8 shadow-xl shadow-[#23395b]/5 md:mt-10 md:py-12">
        <div className="mb-8 flex flex-col items-center gap-4 px-5 text-center md:px-20">
          <h2 className="max-w-2xl text-2xl font-extrabold capitalize leading-tight text-[#23395b] md:text-3xl">
            Penghitungan Skor Prioritas untuk Pemeringkatan
          </h2>

          <p className="max-w-3xl text-sm font-medium leading-7 text-slate-600 md:text-base">
            Skor prioritas laporan adalah skor yang memberikan peringkat
            prioritas pada setiap laporan yang telah terverifikasi oleh Lentera
            AI, dan harus diselesaikan terlebih dahulu. skor prioritas
            menggunakan 3 parameter utama untuk menjamin penilaian Lentera AI
            objektif dan sesuai dengan kondisi kerusakan infrastruktur
            diantaranya, Cost Benefit Analysis, Umur laporan, Jumlah laporan
          </p>

          <p className="font-medium text-center text-md "></p>
        </div>

        <div
          className="overflow-hidden px-5 pb-20 md:px-10 md:pb-10 cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          <div className="flex gap-4 md:gap-6">
            <div className="flex min-h-[560px] w-[86vw] max-w-[420px] shrink-0 select-none flex-col  rounded-[1.75rem] border border-[#276fbf]/10 bg-white p-5 shadow-lg shadow-[#23395b]/5 md:min-h-[590px] md:p-7">
              <div className="pointer-events-none mb-6 flex h-[260px] w-full flex-col items-center gap-4 overflow-hidden rounded-[1.5rem] bg-[#fff7d3] p-3">
                <AnimatePresence mode="wait">
                  {currentFrame >= 0 && currentFrame <= 1 && (
                    <motion.div
                      key="user-pict"
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="self-end rounded-3xl rounded-tr-sm bg-white p-2 text-black shadow-md"
                    >
                      <img
                        src={jalan}
                        className="h-[100px] w-[150px] rounded-xl object-cover"
                        alt="Jalan"
                      />
                    </motion.div>
                  )}
                  {currentFrame === 1 && (
                    <motion.div
                      key="report detail"
                      initial={{ y: 20, opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ scale: 0, opacity: 0, y: 20 }}
                      className="w-[250px] self-end rounded-3xl rounded-tr-sm bg-[#23395b] p-3 shadow-md"
                    >
                      <p className="text-left text-xs font-medium leading-relaxed text-white">
                        Laporan lubang di jalan Setiabudi, membahayakan sepeda
                        motor.
                      </p>
                    </motion.div>
                  )}
                  {currentFrame === 2 && (
                    <motion.div
                      key="ai-loading"
                      initial={{ opacity: 0, scale: 0, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="relative mt-4 flex h-10 w-10 items-center justify-center self-start"
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full border-[3px] border-[#276fbf]/20 border-b-transparent border-l-transparent border-t-[#276fbf]"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.img
                        src={star}
                        className="z-10 h-8 w-8 object-contain"
                      />
                    </motion.div>
                  )}
                  {currentFrame === 3 && (
                    <motion.div
                      key="AI-chat"
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                      className="self-start rounded-3xl rounded-tl-sm bg-[#276fbf] p-3 shadow-md"
                    >
                      <p className="text-left text-xs font-medium leading-relaxed text-white">
                        Berikut Estimasi biaya dan skor prioritas <br />
                        biaya: Rp. 50.000.000 <br />
                        Jenis kerusakan : Trotoar amblas <br />
                        CBA : 1.8 <br />
                        prioritas: 0.56
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="pointer-events-none flex w-full flex-col items-start p-2">
                <h3 className="mb-3 text-lg font-black text-[#23395b]">
                  Penilaian AI Terverifikasi
                </h3>
                <p className="text-sm leading-7 text-slate-600 md:text-base">
                  Lentera AI akan memvalidasi setiap laporan dan akan melakukan
                  riset estimasi harga, jenis kerusakan dan penghitungan skor
                  prioritas berdasarkan Cost Benefit Analysis, Umur laporan dan
                  jumlah laporan
                </p>
              </div>
            </div>

            {/* card 2 */}
            <div className="flex min-h-[560px] w-[86vw] max-w-[420px] shrink-0 flex-col rounded-[1.75rem] border border-[#276fbf]/10 bg-white p-5 shadow-lg shadow-[#23395b]/5 md:min-h-[590px] md:p-7">
              <div className="mb-6 flex h-[260px] w-full items-center justify-center rounded-[1.5rem] bg-[#fbfef9] p-4">
                <img
                  src={CBA}
                  alt="CBA"
                  className="w-full max-w-[250px] rounded-xl object-contain md:max-w-[320px]"
                />
              </div>

              <h2 className="mb-3 text-lg font-black leading-tight text-[#23395b] md:text-xl">
                Cost Benefit Analysis
              </h2>

              <p className="text-sm leading-7 text-slate-600 md:text-base">
                CBA membantu Lentera AI menilai manfaat perbaikan dibandingkan
                biaya implementasi agar laporan dapat diprioritaskan secara
                lebih objektif.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#276fbf] px-5 text-sm font-black text-white shadow-lg shadow-[#276fbf]/25 transition hover:-translate-y-0.5 hover:bg-[#23395b] active:translate-y-0"
              >
                Pelajari Lebih Lanjut
              </button>
            </div>

            {/* card 3 */}
            <div className="flex min-h-[560px] w-[86vw] max-w-[420px] shrink-0 select-none flex-col rounded-[1.75rem] border border-[#276fbf]/10 bg-white p-5 shadow-lg shadow-[#23395b]/5 md:min-h-[590px] md:p-7">
              <div className="mb-6 flex h-[260px] w-full items-center justify-center rounded-[1.5rem] bg-[#fbfef9] p-4">
                <img
                  src={jumlah_laporan}
                  alt="Ilustrasi Map"
                  className="pointer-events-none max-w-[320px] rounded-2xl object-contain"
                />
              </div>

              <div>
                <h3 className="mb-3 text-lg font-black text-[#23395b]">
                  Jumlah Laporan
                </h3>
                <p className="text-sm leading-7 text-slate-600 md:text-base">
                  Jumlah laporan didasari pada titik koordinat lokasi kerusakan
                  pada peta yang diberikan oleh pengguna dalam radius jarak
                  250m. dalam radius tersebut seluruh laporan akan dijumlahkan
                  yang menambah jumlah laporannya
                </p>
              </div>
            </div>

            {/* card 4 */}
            <div className="flex min-h-[560px] w-[86vw] max-w-[420px] shrink-0 flex-col rounded-[1.75rem] border border-[#276fbf]/10 bg-white p-5 shadow-lg shadow-[#23395b]/5 md:min-h-[590px] md:p-7">
              <div className="mb-6 flex h-[260px] w-full items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#276fbf]/10 via-[#fbfef9] to-[#fff7d3] p-5">
                <div className="grid size-32 place-items-center rounded-full bg-white shadow-xl shadow-[#23395b]/10">
                  <span className="text-center text-4xl font-black text-[#276fbf]">
                    24h
                  </span>
                </div>
              </div>

              <h3 className="mb-3 text-lg font-black text-[#23395b]">
                Umur Laporan
              </h3>
              <p className="text-sm leading-7 text-slate-600 md:text-base">
                Setiap laporan yang diberikan pengguna akan dicatat tanggal dan
                jam laporan dikirimkan, ketika laporan telah terverifikasi oleh
                Lentera AI maka akan dihitung waktunya sampai laporan
                ditindaklanjuti.
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center md:bottom-7 md:justify-end md:pr-10">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-[#276fbf]/10 bg-white/90 p-2 shadow-xl shadow-[#23395b]/10 backdrop-blur-md">
            <button
              onClick={scrollPrev}
              className="grid size-11 place-items-center rounded-full bg-[#fbfef9] text-[#23395b] transition hover:bg-[#276fbf] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#276fbf]/30"
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={scrollNext}
              className="grid size-11 place-items-center rounded-full bg-[#276fbf] text-white transition hover:bg-[#23395b] focus:outline-none focus:ring-2 focus:ring-[#276fbf]/30"
              aria-label="Slide berikutnya"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-[#23395b]/60 p-0 backdrop-blur-sm md:items-center md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.98 }}
            className="max-h-[92vh] w-full overflow-hidden rounded-t-[2rem] bg-[#fbfef9] shadow-2xl md:max-w-3xl md:rounded-[2rem]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#276fbf]/10 bg-white px-5 py-4 md:px-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#276fbf]">
                  Cost Benefit Analysis
                </p>
                <h3 className="mt-1 text-xl font-black text-[#23395b] md:text-2xl">
                  Detail Komponen CBA
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="grid size-10 shrink-0 place-items-center rounded-full bg-[#276fbf]/10 text-[#23395b] transition hover:bg-[#276fbf] hover:text-white"
                aria-label="Tutup modal"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-88px)] overflow-y-auto px-5 py-5 md:px-6 md:py-6">
              <div className="space-y-5">
                {cbaDetails.map((item, index) => (
                  <div
                    key={item.root}
                    className="rounded-3xl border border-[#276fbf]/10 bg-white p-4 shadow-sm md:p-5"
                  >
                    <div className="mb-4 flex items-start gap-3">
                      <div className="grid size-9 shrink-0 place-items-center rounded-2xl bg-[#276fbf] text-sm font-black text-white">
                        {index + 1}
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-[#23395b]">
                          {item.root}
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {item.leafs.length > 0 ? (
                      <div className="ml-4 space-y-3 border-l-2 border-[#276fbf]/15 pl-4">
                        {item.leafs.map((leaf) => (
                          <div
                            key={leaf.title}
                            className="rounded-2xl bg-[#f6fbff] p-4 ring-1 ring-[#276fbf]/10"
                          >
                            <p className="font-black text-[#276fbf]">
                              {leaf.title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {leaf.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ScoringCard;
