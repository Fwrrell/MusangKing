import { AnimatePresence, motion, type Variants } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import Stepper, { Step } from "@/components/Stepper";
import AvatarCustomizer from "@/components/AvatarCustomizer";
import HeroSection from "@/components/HeroSection";
import RecapSection from "@/components/RecapSection";
import { AboutSection } from "@/components/AboutSection";

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
  }, []);

  const handleUser = () => {
    const deviceId = localStorage.getItem("device_id");
    if (deviceId) {
      navigate("/app");
    } else {
      setShowStepper(true);
    }
  };

  const handleStepper = async () => {
    setIsRegistering(true);
    try {
      const newDeviceId = uuidv4();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/init`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id: newDeviceId,
            name: userName || "Musang Anonim",
            avatar_url: finalAvatarUrl,
          }),
        },
      );

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
      className="relative min-h-screen bg-gradient-to-b from-bg-top to-bg-bottom overflow-x-hidden selection:bg-text-main/10 selection:text-text-main"
    >
      <HeroSection onUserClick={handleUser} />
      <RecapSection />
      <AboutSection />

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
