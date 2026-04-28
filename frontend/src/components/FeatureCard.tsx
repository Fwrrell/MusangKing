import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Kebutuhan Ilustrasi ---
import IpMockup from "@/assets/ilustrasi/mockupIphone.png";
import UIChat from "@/assets/ilustrasi/chat-UI.png";
import Home from "@/assets/ilustrasi/UIHome.png";
import chat1 from "@/assets/ilustrasi/chat-1.png";
import chat2 from "@/assets/ilustrasi/Chat-2.png";
import photoFile from "@/assets/ilustrasi/Bukti-foto.png";
import viewfinder from "@/assets/ilustrasi/viewfinder.png";
import lentera from "@/assets/ilustrasi/Lentera-fit-icon.png";
import submit from "@/assets/ilustrasi/submit.png";
import background from "@/assets/ilustrasi/jalanrusak_2.jpg";
import AppIcon from "@/assets/ilustrasi/appIcon.png";
import Shutter from "@/assets/ilustrasi/ShutterCam.png";
import typing from "@/assets/ilustrasi/titik-typing.png";
import ilustrasi_ai from "@/assets/ilustrasi/ilustrasi_AI.png";
import threads from "@/assets/ilustrasi/ilustrasi_threads.png";

interface CardLayoutProps {
  bgColor: string;
  topOffset: string;
  preTitle: ReactNode;
  title: string;
  description: ReactNode;
  illustration: ReactNode;
  illustrationBgClass?: string;
  illustrationStyle?: React.CSSProperties;
}

const CardLayout = ({
  bgColor,
  topOffset,
  preTitle,
  title,
  description,
  illustration,
  illustrationBgClass = "bg-white",
  illustrationStyle,
}: CardLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`flex w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] md:rounded-[40px] relative mb-8 md:mb-12 lg:mb-[10vh] lg:sticky ${topOffset}`}
    >
      <div
        className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2rem] shadow-2xl shadow-blue-950/20 md:grid-cols-2 md:rounded-[40px]"
        style={{ backgroundColor: bgColor }}
      >
        {/* Bagian Teks (Kiri) */}
        <div className="relative flex flex-col justify-center space-y-5 p-6 text-white sm:p-8 md:p-10 md:space-y-8">
          <div className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100 md:text-base xl:absolute xl:top-10">
            {preTitle}
          </div>
          <h3 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl md:mt-12 lg:text-5xl xl:mt-0">
            {title}
          </h3>
          <div className="max-w-lg text-sm leading-7 text-blue-100 sm:text-base md:text-lg lg:text-xl">
            {description}
          </div>
        </div>

        {/* Bagian Ilustrasi (Kanan) */}
        <div
          className={`relative flex min-h-[360px] items-center justify-center bg-cover bg-center sm:min-h-[440px] md:min-h-[700px] ${illustrationBgClass}`}
          style={illustrationStyle}
        >
          {illustration}
        </div>
      </div>
    </motion.div>
  );
};

const PhoneAnimation = () => {
  const [currentFrame, setFrame] = useState(0);

  useEffect(() => {
    const timers = [
      500, 1500, 400, 1500, 150, 600, 500, 2000, 300, 1500, 3000, 1000, 1000,
      3000,
    ];
    const interval = setTimeout(() => {
      setFrame((prev) => (prev < timers.length - 1 ? prev + 1 : 0));
    }, timers[currentFrame]);
    return () => clearTimeout(interval);
  }, [currentFrame]);

  return (
    <>
      <div className="absolute w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
      <div className="flex justify-center items-center w-full h-full transform scale-[0.7] sm:scale-[0.8] md:scale-100 origin-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key="Ip-mockup"
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-[300px] h-[600px] z-10 flex justify-center items-center drop-shadow-2xl"
          >
            <img
              src={IpMockup}
              className="absolute w-full object-contain pointer-events-none z-50"
            />
            <div
              className="absolute z-10 overflow-hidden bg-black"
              style={{
                top: "-7px",
                bottom: "-7px",
                left: "5px",
                right: "8.5px",
                borderRadius: "2.1rem",
              }}
            >
              <img src={Home} className="absolute w-full h-full object-cover" />
              <motion.img
                src={AppIcon}
                className="absolute bottom-38 left-3 w-16 h-16 origin-center"
                animate={{
                  scale: currentFrame === 2 ? 0.8 : 1,
                  filter:
                    currentFrame === 2 ? "brightness(0.7)" : "brightness(1)",
                }}
                transition={{ duration: 0.15 }}
              />

              {/* Layer Kamera */}
              <AnimatePresence>
                {currentFrame >= 3 && currentFrame <= 6 && (
                  <motion.div
                    className="absolute z-40 bg-black"
                    initial={{ scale: 0.1, opacity: 0, y: 100, x: -60 }}
                    animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 250 }}
                    style={{
                      top: "-29px",
                      bottom: "-7px",
                      left: "2px",
                      right: "0px",
                      borderRadius: "2.1rem",
                    }}
                  >
                    <img
                      src={viewfinder}
                      className="w-full h-full object-cover"
                    />
                    <motion.img
                      src={Shutter}
                      initial={{ scale: 1, opacity: 0 }}
                      className="absolute bottom-6 left-[117px] w-13 h-13 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
                      animate={{
                        scale: currentFrame === 5 ? 0.6 : 1,
                        opacity: 1,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    {currentFrame === 6 && (
                      <motion.img
                        src={submit}
                        className="absolute bottom-40 left-[60px] w-45 h-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: 0.8, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeIn" }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Layer Chat Lentera */}
              <AnimatePresence>
                {currentFrame > 6 && (
                  <motion.div
                    className="absolute"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeIn" }}
                    style={{
                      top: "2px",
                      bottom: "-60px",
                      left: "-6px",
                      right: "-10px",
                      borderRadius: "2.1rem",
                    }}
                  >
                    <img src={UIChat} />
                    {currentFrame > 8 && (
                      <motion.img
                        src={lentera}
                        className="absolute top-22 left-2 w-15 h-15"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                    {currentFrame === 9 && (
                      <motion.img
                        src={typing}
                        className="absolute top-30 left-18 w-8 h-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                    {currentFrame > 9 && (
                      <motion.img
                        src={chat1}
                        className="absolute top-26 left-15 w-48 h-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                    {currentFrame === 10 && (
                      <motion.img
                        src={typing}
                        className="absolute top-50 right-8 w-8 h-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                    {currentFrame > 10 && (
                      <motion.img
                        src={chat2}
                        className="absolute top-50 right-1 w-50 h-11"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                    {currentFrame > 12 && (
                      <motion.img
                        src={photoFile}
                        className="absolute top-65 right-5 w-45 h-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export const FeatureCards = () => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* CARD 1: Upload Bukti */}
      <CardLayout
        bgColor="#002255"
        topOffset="lg:top-24"
        illustrationBgClass="bg-[#001f4d]"
        illustrationStyle={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
        }}
        preTitle={
          <>
            upload bukti <span className="text-2xl md:text-3xl">📸</span>
          </>
        }
        title="Cukup Potret, Kami laporkan"
        description={
          <>
            Berhenti sekadar mengeluh di media sosial. ubah smartphone-mu
            menjadi inisiator perubahan. Unggah foto kerusakan, dan biarkan
            sistem & asisten Lentera AI mengurus laporanmu.
            <br />
            Buka lentera, Potret, Upload, laporan diterima.
          </>
        }
        illustration={<PhoneAnimation />}
      />

      {/* CARD 2: Bantuan AI */}
      <CardLayout
        bgColor="#00388C"
        topOffset="lg:top-35"
        illustrationBgClass="bg-slate-50 p-6 md:p-12"
        preTitle={
          <div className="inline-flex items-center gap-2 p-3 rounded-full bg-blue-600/70 border border-blue-400/30 w-max mb-6">
            <span className="text-[#FFB100]">✨</span>
            <span className="text-white-200 text-sm font-semibold tracking-wider uppercase">
              Didukung Lentera AI
            </span>
          </div>
        }
        title="Bantuan Validasi dan Transparansi"
        description="Dengan Lentera AI, gambar & laporan divalidasi untuk kategori jenis kerusakan secara efisien. Dilengkapi juga fitur penghitungan prioritas skor & estimasi biaya yang memberi gambaran awal yang objektif bagi pelapor dan pemerintah"
        illustration={
          <img
            src={ilustrasi_ai}
            alt="AI"
            className="w-full max-w-[320px] md:max-w-[450px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
          />
        }
      />

      {/* CARD 3: Unggah & Pantau */}
      <CardLayout
        bgColor="#0057CD"
        topOffset="lg:top-50"
        illustrationBgClass="bg-white p-6 md:p-12"
        preTitle={
          <>
            unggah laporan <span className="text-2xl md:text-3xl">📸</span>
          </>
        }
        title="Pantau dan dukung laporan di lokasimu"
        description={
          <>
            Setiap Laporan yang kamu kirimkan dapat dilihat oleh pengguna lain
            dan dapat dibagikan sehingga membantu dalam pemantauan. kamu dapat
            memberikan dukungan agar laporan dapat lebih terlihat oleh pengguna
            lain.
            <br />
            <br />
            <span className="text-lg font-semibold text-white">
              Foto, Unggah, dan Dukung
            </span>
          </>
        }
        illustration={
          <img
            src={threads}
            alt="threads"
            className="w-full max-w-[400px] md:max-w-[480px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
          />
        }
      />
    </div>
  );
};

export default FeatureCards;
