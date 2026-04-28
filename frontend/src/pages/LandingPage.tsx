import { AnimatePresence, motion, type Variants } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Stepper, { Step } from "@/components/Stepper";
import AvatarCustomizer from "@/components/AvatarCustomizer";

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

export function LandingPage() {
  const navigate = useNavigate();

  const [showStepper, setShowStepper] = useState(false);
  const [userName, setUserName] = useState("");
  const [finalAvatarUrl, setFinalAvatarUrl] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
      setShowStepper(true);
    }
  });

  const handleUser = () => {
    const deviceId = localStorage.getItem("device_id");
    if (deviceId) {
      navigate("/");
    } else {
      setShowStepper(true);
    }
  };

  const handleStepper = async () => {
    setIsRegistering(true);
    try {
      const newDeviceId = uuidv4();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id: newDeviceId,
          name: userName || "Musang Anonim",
          avatar_url: finalAvatarUrl,
        }),
      });

      if (response.ok) {
        localStorage.setItem("device_id", newDeviceId);
        setShowStepper(false);
      } else {
        console.error("Failed.");
      }
    } catch (err) {
      console.error("Error: ", err);
    } finally {
      setIsRegistering(false);
    }
  };

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

        <div className="flex items-center gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUser}
            className="hidden md:flex items-center gap-2 bg-white/50 backdrop-blur-md text-text-main px-8 py-3.5 rounded-full font-bold transition-all border-2 border-white shadow-sm"
          >
            User Pages
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-start pt-12 md:pt-24 px-6 text-center"
      >
        <motion.div variants={itemVariants} className="max-w-6xl">
          <h2 className="text-white text-[90px] md:text-[180px] font-display mb-6 tracking-[-4px] leading-[0.85] drop-shadow-[4px_4px_0px_rgba(0,0,0,0.02)] uppercase font-daruma">
            Coming
            <br />
            soon
          </h2>
        </motion.div>
        <div className="pt-16 md:hidden relative z-50 px-6 pb-32 text-center -mt-10">
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUser}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold transition-colors border border-white/30 hover:bg-white hover:text-zinc-900 shadow-xl"
          >
            User Pages
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
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

      <AnimatePresence>
        {showStepper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <div className="bg-white rounded-3xl pt-8 pb-4 w-full max-w-md shadow-2xl relative flex flex-col">
              <h3 className="text-2xl font-bold text-gray-800 text-center px-6">
                Hai! Kamu pertama kali ya👋
              </h3>

              <Stepper
                initialStep={1}
                onFinalStepCompleted={handleStepper}
                backButtonText="Kembali"
                nextButtonText={isRegistering ? "Tunggu.." : "Lanjut"}
                stepCircleContainerClassName="!border-none !shadow-none"
                contentClassName="px-6"
                footerClassName="px-6 pb-4"
                canProceed={(step) => {
                  if (step === 2) return userName.trim() !== "";
                  return true;
                }}
              >
                {/* STEP 0: GREETINGS */}
                <Step>
                  <div className="flex flex-col gap-3 py-4">
                    <label className="text-gray-700 font-medium mt-4">
                      Selamat datang di Lentera!
                    </label>
                    <p className="text-sm text-gray-500 leading-relaxed mt-1">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Necessitatibus dolores cum quis vitae iure qui. Aliquid
                      doloremque perspiciatis nemo iusto, recusandae eum
                      expedita, dignissimos dolorem nostrum vitae ducimus enim
                      ipsa. Est, ipsam?
                    </p>
                  </div>
                </Step>
                {/* STEP 1: NAMA */}
                <Step>
                  <div className="flex flex-col gap-3 py-4">
                    <label className="text-gray-700 font-medium mt-4">
                      Siapa nama panggilanmu?
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Misal: Asep, Budi, atau Kang Emil"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                      required
                    />

                    <p className="text-sm text-gray-500 leading-relaxed mt-1">
                      Tenang, ini cuma buat sapaan di aplikasi. Nggak perlu nama
                      asli kok!
                    </p>
                  </div>
                </Step>

                {/* STEP 2: AVATAR */}
                <Step>
                  <AvatarCustomizer
                    userName={userName}
                    onAvatarChange={(newUrl) => setFinalAvatarUrl(newUrl)}
                  />
                  <p className="text-xs text-gray-400 text-center mt-6">
                    Pilih gaya yang kamu banget!
                  </p>
                </Step>
              </Stepper>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
