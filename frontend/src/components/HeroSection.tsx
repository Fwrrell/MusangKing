import { motion } from "motion/react";
import lenteraLogo from "@/assets/logo.png";
import lenteraHero from "@/assets/lentera_bandung_hero.png";

type HeroSectionProps = {
  onUserClick: () => void;
};

export default function HeroSection({ onUserClick }: HeroSectionProps) {
  return (
    // wrapper
    <section
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${lenteraHero})` }}
    >
      {/* mobile overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0959b4]/90 via-[#0959b4]/75 to-[#23395b]/95 md:hidden" />

      {/* left-side section */}
      <motion.div
        initial={{ opacity: 0, x: -48 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="
          relative z-10 flex min-h-screen w-full flex-col justify-between px-6 py-8 text-white
          md:w-[70%] md:justify-start md:gap-10 md:bg-[rgb(9,89,180)]/75 md:p-10 md:backdrop-blur-sm
          md:[clip-path:polygon(0%_0%,75%_0%,95%_100%,0%_100%)]
          lg:w-3/5 lg:p-14 lg:[clip-path:polygon(0%_0%,70%_0%,90%_100%,0%_100%)]
          xl:[clip-path:polygon(0%_0%,60%_0%,80%_100%,0%_100%)]
        "
      >
        {/* logo section */}
        <div className="flex items-center gap-4">
          <img
            src={lenteraLogo}
            alt="Logo Lentera Bandung"
            className="h-16 w-16 rounded-2xl object-contain shadow-lg md:h-20 md:w-20 lg:h-24 lg:w-24"
          />

          <div>
            <p className="text-lg font-bold leading-tight md:text-2xl">
              Lentera Bandung
            </p>
            <p className="text-xs font-semibold text-white/85 md:text-base">
              Bersama Terangi Bandung
            </p>
          </div>
        </div>

        {/* TAGLINE */}
        <div className="flex flex-1 flex-col justify-center md:flex-none">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="max-w-[520px]"
          >
            <h1 className="flex flex-col gap-2 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-5xl lg:text-6xl leading-none">
              <span>Bersama buat</span>
              <span>Bandung</span>
              <span className="text-[#FDEAAB]">Lebih Baik</span>
            </h1>

            <p className="mt-5 max-w-sm text-base font-medium leading-relaxed text-white/90 md:max-w-md md:text-xl">
              Sampaikan kepedulianmu dan bantu pantau laporan warga secara
              mudah.
            </p>

            {/* cta section */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onUserClick}
                className="rounded-2xl bg-[#FDEAAB] px-8 py-4 text-base font-black text-[#002d71] shadow-xl shadow-black/15 transition hover:bg-[#fff7d3]"
              >
                Buat laporan
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="rounded-2xl border border-white/45 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition hover:bg-white/15"
              >
                Tentang Lentera
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="pb-2 text-xs font-medium text-white/70 md:hidden">
          Bandung lebih terang dimulai dari laporan kecilmu.
        </div>
      </motion.div>
    </section>
  );
}
