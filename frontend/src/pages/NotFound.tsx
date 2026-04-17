import { motion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const pageVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen bg-gradient-to-b from-bg-top to-bg-bottom overflow-hidden selection:bg-text-main/10 selection:text-text-main"
    >
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-20 w-80 h-80 bg-white rounded-full blur-3xl opacity-60"
        />
      </div>

      {/* Header */}
      <header className="relative z-50 p-6 md:p-10 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="flex flex-col items-start translate-y-2">
            <img
              src="/lentera-logo-horizontal.png"
              alt="Logo Lentera"
              className="h-20 w-auto object-contain"
            />
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-start pt-12 md:pt-24 px-6 text-center"
      >
        <motion.div
          variants={itemVariants}
          className="max-w-6xl flex flex-col items-center"
        >
          <h2 className="text-white text-[120px] md:text-[160px] font-display mb-6 tracking-[-4px] leading-[0.85] drop-shadow-[4px_4px_0px_rgba(0,0,0,0.02)] uppercase font-daruma">
            404
          </h2>
          <motion.p
            variants={itemVariants}
            className="text-text-main/80 text-lg md:text-2xl font-light max-w-lg md:max-w-2xl mx-auto leading-relaxed mt-4 mb-8"
          >
            There's NOTHING here.
          </motion.p>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/app")}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold transition-colors border border-white/30 hover:bg-white hover:text-zinc-900 shadow-xl"
          >
            Kembali ke Dashboard
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.main>

      {/* Clouds Container */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none overflow-hidden h-[35vh] md:h-[45vh] z-20">
        <CloudLayer
          count={5}
          speed={60}
          opacity="opacity-40"
          scale={1.4}
          y={60}
        />
        <CloudLayer
          count={4}
          speed={50}
          opacity="opacity-60"
          scale={1.7}
          y={30}
        />
        <CloudLayer
          count={3}
          speed={40}
          opacity="opacity-80"
          scale={2.2}
          y={0}
        />
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row justify-between items-center text-text-main/50 text-[10px] md:text-xs font-bold uppercase tracking-[3px] z-50">
        <div className="flex items-center gap-2 mb-3 md:mb-0">
          Made with 💙 in Bandung
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <span>&copy; 2026 Musang King</span>
        </div>
      </footer>
    </motion.div>
  );
}

function CloudLayer({
  count,
  speed,
  opacity,
  scale,
  y,
}: {
  count: number;
  speed: number;
  opacity: string;
  scale: number;
  y: number;
}) {
  return (
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      className={`absolute bottom-0 left-0 flex gap-0 ${opacity}`}
      style={{ transform: `scale(${scale}) translateY(${y}px)` }}
    >
      {[...Array(count * 4)].map((_, i) => (
        <div
          key={i}
          className="w-[500px] h-[250px] bg-white rounded-full blur-[1px]"
          style={{
            borderRadius: "50% 50% 50% 50% / 100% 100% 0% 0%",
            flexShrink: 0,
            marginLeft: "-100px",
          }}
        />
      ))}
    </motion.div>
  );
}
