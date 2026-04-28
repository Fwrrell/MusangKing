import star from "@/assets/ilustrasi/star_ai.png";
import jalan from "@/assets/ilustrasi/jalanrusak_2.jpg";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const AiResponse = () => {
  const [currentFrame, setFrame] = useState(0);
  useEffect(() => {
    const timers = [1200, 1200, 1500, 2000];
    const interval = setTimeout(() => {
      setFrame((prev) => (prev < timers.length - 1 ? prev + 1 : 0));
    }, timers[currentFrame]);
    return () => clearTimeout(interval);
  }, [currentFrame]);

  return (
    <>
      <div className="flex h-full w-full flex-col items-center gap-4 overflow-hidden rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
        <div className="flex min-h-[210px] w-full flex-col items-center gap-4 overflow-hidden rounded-3xl bg-[#FFF0BE] p-3 sm:min-h-[240px]">
          <AnimatePresence mode="wait">
            {currentFrame >= 0 && currentFrame <= 1 && (
              <motion.div
                key="user-pict"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -30,
                  scale: 0.95,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="self-end rounded-3xl rounded-tr-sm bg-white p-2 text-black shadow-md"
              >
                <img
                  src={jalan}
                  className="h-[96px] w-[150px] rounded-2xl object-cover sm:h-[110px] sm:w-[170px]"
                />
              </motion.div>
            )}

            {currentFrame === 1 && (
              <motion.div
                key="report detail"
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                exit={{ scale: 0, opacity: 0, y: 20 }}
                className="w-full max-w-[250px] self-end rounded-3xl rounded-tr-sm bg-white p-3 shadow-sm"
              >
                <p className="text-left text-xs font-normal leading-relaxed text-black">
                  Laporan lubang di jalan Setiabudi, membahayakan sepeda motor
                  <br /> koordinat : -6.853289, 107.596203
                </p>
              </motion.div>
            )}

            {currentFrame === 2 && (
              <motion.div
                key="ai-loading"
                initial={{ opacity: 0, scale: 0, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative flex h-10 w-10 items-center justify-center self-start"
              >
                <motion.div
                  className="absolute inset-0 rounded-full border-[3px] border-blue-500/20 border-b-transparent border-l-transparent border-t-blue-500"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.img
                  key="AI-star"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    scale: [0.85, 1.15, 0.85],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  src={star}
                  className="z-10 h-8 w-8 object-contain"
                ></motion.img>
              </motion.div>
            )}

            {currentFrame === 3 && (
              <motion.div
                key="AI-chat"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="self-start rounded-3xl rounded-tl-sm bg-white p-3 shadow-sm"
              >
                <p className="text-left text-xs font-normal leading-relaxed text-black">
                  Berikut Estimasi biaya dan skor prioritas <br />
                  biaya: Rp. 50.000.000 <br />
                  Jenis kerusakan : Trotoar amblas <br />
                  CBA : 1.8 <br />
                  prioritas: 0.5
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex w-full flex-col items-start gap-2 p-1 sm:p-2">
          <h3 className="text-left text-lg font-extrabold leading-snug text-[#23395b]">
            Submit Laporan, Estimasi selesai.
          </h3>
          <p className="text-sm font-normal leading-6 text-slate-600 sm:text-base">
            Lentera AI akan memvalidasi setiap laporan dan akan melakukan riset
            estimasi harga, jenis kerusakan dan CBA yang memudahkan pemerintah
            dan pelapor mengenai kebutuhan perbaikan.
          </p>
        </div>
      </div>
    </>
  );
};
export default AiResponse;
