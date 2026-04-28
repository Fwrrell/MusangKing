import { motion } from "framer-motion";
import FeatureCards from "./FeatureCard";
import megaMendung from "@/assets/mega_mendung.jpeg";
import AiResponse from "./AiResponse";

export const AboutSection = () => {
  return (
    <>
      <div className="relative flex w-full flex-col bg-[#0d51b8] px-4 pb-10 pt-8 sm:px-6 md:px-10 md:pb-16 md:pt-12">
        <div className="absolute left-0 top-0 z-10 w-full -translate-y-full overflow-hidden leading-[0]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="block h-[60px] w-full md:h-[120px]"
          >
            <path
              fill="#0d51b8"
              fillOpacity="1"
              d="M0,64L60,80C120,96,240,128,360,122.7C480,117,600,75,720,90.7C840,107,960,181,1080,197.3C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>

        <h2 className="mx-auto mb-8 max-w-4xl text-center text-2xl font-extrabold leading-tight text-white sm:text-3xl md:mb-12 md:text-4xl">
          Lentera : membantumu memantau kinerja dan tata kelola infrastruktur
        </h2>

        <div className="relative w-full">
          <FeatureCards />
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center gap-8 overflow-hidden bg-slate-100 px-4 py-16 sm:px-6 md:gap-10 md:px-10 md:py-24">
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[-80px] top-6 opacity-[0.08] md:right-0 md:opacity-[0.1]"
        >
          <img src={megaMendung} className="w-72 md:w-100" />
        </motion.div>

        <motion.div
          animate={{ x: [0, 15, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[-80px] top-2 opacity-[0.08] md:left-0 md:opacity-[0.1]"
        >
          <img src={megaMendung} className="w-72 md:w-100" />
        </motion.div>

        <div className="relative z-10 flex max-w-3xl flex-col items-center justify-center gap-3 text-center">
          <h2 className="text-3xl font-extrabold capitalize leading-tight text-[#23395b] sm:text-4xl md:text-5xl">
            Berikan keluhan, kami tangani
          </h2>

          <p className="max-w-2xl py-2 text-center text-base font-medium leading-7 text-slate-600 antialiased md:text-lg">
            Pantau tranparansi, perkembangan, dampak setiap laporan secara
            berkala.
            <br className="hidden sm:block" />
            responsif, transparan, dan objektif.
          </p>
        </div>

        <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-8">
          <div className="rounded-3xl shadow-md shadow-slate-900/10">
            <AiResponse />
          </div>
          <div className="rounded-3xl shadow-md shadow-slate-900/10">
            <AiResponse />
          </div>
          <div className="rounded-3xl shadow-md shadow-slate-900/10">
            <AiResponse />
          </div>
          <div className="rounded-3xl shadow-md shadow-slate-900/10">
            <AiResponse />
          </div>
        </div>
      </div>
    </>
  );
};
