import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BEARD_LABELS = ["Mulus", "Ada"];

const HAIR_VALUES = [
  "default",
  "hat",
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
  "variant06",
  "variant07",
  "variant08",
  "variant09",
  "variant10",
  "variant11",
  "variant12",
  "variant13",
  "variant14",
  "variant15",
  "variant16",
  "variant17",
  "variant18",
  "variant19",
  "variant20",
  "variant21",
  "variant22",
  "variant23",
  "variant24",
  "variant25",
  "variant26",
  "variant27",
  "variant28",
  "variant29",
  "variant30",
  "variant31",
  "variant32",
  "variant33",
  "variant34",
  "variant35",
  "variant36",
  "variant37",
  "variant38",
  "variant39",
  "variant40",
  "variant41",
  "variant42",
  "variant43",
  "variant44",
  "variant45",
  "variant46",
  "variant47",
  "variant48",
  "variant49",
  "variant50",
  "variant51",
  "variant52",
  "variant53",
  "variant54",
  "variant55",
  "variant56",
  "variant57",
  "variant58",
  "variant59",
  "variant60",
  "variant61",
  "variant62",
  "variant63",
];

const HAIR_LABELS = HAIR_VALUES.map((val) => {
  if (val === "default") return "Bawaan";
  if (val === "hat") return "Topi";
  return val.replace("variant", "Tipe ");
});

const BROWS_VALUES = [
  "default",
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
  "variant06",
  "variant07",
  "variant08",
  "variant09",
  "variant10",
  "variant11",
  "variant12",
  "variant13",
];

const BROWS_LABELS = BROWS_VALUES.map((val) => {
  if (val === "default") return "Bawaan";
  return val.replace("variant", "Tipe ");
});

const LIPS_VALUES = [
  "default",
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
  "variant06",
  "variant07",
  "variant08",
  "variant09",
  "variant10",
  "variant11",
  "variant12",
  "variant13",
  "variant14",
  "variant15",
  "variant16",
  "variant17",
  "variant18",
  "variant19",
  "variant20",
  "variant21",
  "variant22",
  "variant23",
  "variant24",
  "variant25",
  "variant26",
  "variant27",
  "variant28",
  "variant29",
  "variant30",
];

const LIPS_LABELS = LIPS_VALUES.map((val) => {
  if (val === "default") return "Bawaan";
  return val.replace("variant", "Tipe ");
});

const GLASSES_VALUES = [
  "default",
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
  "variant06",
  "variant07",
  "variant08",
  "variant09",
  "variant10",
  "variant11",
];

const GLASSES_LABELS = GLASSES_VALUES.map((val) => {
  if (val === "default") return "Tidak ada";
  return val.replace("variant", "Tipe ");
});

const BODY_VALUES = [
  "default",
  "variant01",
  "variant02",
  "variant03",
  "variant04",
  "variant05",
  "variant06",
  "variant07",
  "variant08",
  "variant09",
  "variant10",
  "variant11",
  "variant12",
  "variant13",
  "variant14",
  "variant15",
  "variant16",
  "variant17",
  "variant18",
  "variant19",
  "variant20",
  "variant21",
  "variant22",
  "variant23",
  "variant24",
  "variant25",
];

const BODY_LABELS = BODY_VALUES.map((val) => {
  if (val === "default") return "Bawaan";
  return val.replace("variant", "Tipe ");
});

const GESTURE_LABELS = [
  "Cool 😎",
  "Jempol 👍",
  "Cekrek 🤳",
  "Sip 👌",
  "Sipppp 👌",
  "nahh 👆",
  "ahaaa ☝️",
  "hai 👋",
  "haloo 👋",
  "oh 👌✋",
  "ih ☝️✋",
];

const GESTURE_VALUES = [
  "default",
  "hand",
  "handPhone",
  "ok",
  "okLongArm",
  "point",
  "pointLongArm",
  "waveLongArm",
  "waveLongArms",
  "waveOkLongArms",
  "wavePointLongArms",
];

const ControlRow = ({ label, options, currentIdx, setIdx }: any) => (
  <div className="flex justify-between items-center w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
    <span className="text-sm font-medium text-gray-600 w-20">{label}</span>
    <div className="flex items-center gap-3">
      <button
        onClick={() =>
          setIdx(currentIdx > 0 ? currentIdx - 1 : options.length - 1)
        }
        className="p-1 rounded-md hover:bg-gray-200 text-gray-500 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm font-semibold w-20 text-center text-gray-800 capitalize">
        {options[currentIdx]}
      </span>
      <button
        onClick={() =>
          setIdx(currentIdx < options.length - 1 ? currentIdx + 1 : 0)
        }
        className="p-1 rounded-md hover:bg-gray-200 text-gray-500 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  </div>
);

interface AvatarProps {
  userName: string;
  onAvatarChange: (url: string) => void;
}

export default function AvatarCustomizer({
  userName,
  onAvatarChange,
}: AvatarProps) {
  const [activeTab, setActiveTab] = useState("kepala");

  const [hairIdx, setHairIdx] = useState(0);
  const [browsIdx, setBrowsIdx] = useState(0);
  const [lipsIdx, setLipsIdx] = useState(0);
  const [beardIdx, setBeardIdx] = useState(0);
  const [glassesIdx, setGlassesIdx] = useState(0);
  const [gestureIdx, setGestureIdx] = useState(0);
  const [bodyIdx, setBodyIdx] = useState(0);

  const getAvatarUrl = () => {
    let url = `https://api.dicebear.com/9.x/notionists/svg?seed=${userName || "warga"}`;

    if (HAIR_VALUES[hairIdx] !== "default")
      url += `&hair=${HAIR_VALUES[hairIdx]}`;
    if (BROWS_VALUES[browsIdx] !== "default")
      url += `&brows=${BROWS_VALUES[browsIdx]}`;
    if (LIPS_VALUES[lipsIdx] !== "default")
      url += `&lips=${LIPS_VALUES[lipsIdx]}`;
    if (BODY_VALUES[bodyIdx] !== "default")
      url += `&body=${BODY_VALUES[bodyIdx]}`;

    url += `&beardProbability=${beardIdx === 1 ? 100 : 0}`;

    if (GLASSES_VALUES[glassesIdx] !== "default") {
      url += `&glassesProbability=100&glasses=${GLASSES_VALUES[glassesIdx]}`;
    } else {
      url += `&glassesProbability=0`;
    }

    if (gestureIdx !== 0) {
      url += `&gestureProbability=100&gesture=${GESTURE_VALUES[gestureIdx]}`;
    } else {
      url += `&gestureProbability=0`;
    }

    return url;
  };

  // Kirim url avatar ke page yang membutuhkan
  useEffect(() => {
    onAvatarChange(getAvatarUrl());
  }, [
    userName,
    hairIdx,
    browsIdx,
    lipsIdx,
    beardIdx,
    glassesIdx,
    gestureIdx,
    bodyIdx,
  ]);

  return (
    <div className="flex flex-col items-center py-2 w-full">
      {/* Preview Avatar */}
      <div className="w-32 h-32 bg-[#F8FAFC] rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center mb-6">
        <img
          src={getAvatarUrl()}
          alt="Avatar Preview"
          className="w-full h-full object-cover transition-all"
        />
      </div>
      {/* Panel Customize Avatar */}
      <div className="flex gap-2 w-full justify-center mb-4 bg-gray-100 p-1.5 rounded-xl">
        {["kepala", "aksesoris", "badan"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
              activeTab === tab
                ? "bg-white shadow text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>{" "}
      <div className="w-full flex flex-col gap-2 min-h-[140px]">
        {activeTab === "kepala" && (
          <>
            <ControlRow
              label="Rambut"
              options={HAIR_LABELS}
              currentIdx={hairIdx}
              setIdx={setHairIdx}
            />
            <ControlRow
              label="Alis"
              options={BROWS_LABELS}
              currentIdx={browsIdx}
              setIdx={setBrowsIdx}
            />
            <ControlRow
              label="Bibir"
              options={LIPS_LABELS}
              currentIdx={lipsIdx}
              setIdx={setLipsIdx}
            />
          </>
        )}

        {activeTab === "aksesoris" && (
          <>
            <ControlRow
              label="Kacamata"
              options={GLASSES_LABELS}
              currentIdx={glassesIdx}
              setIdx={setGlassesIdx}
            />
            <ControlRow
              label="Brewok"
              options={BEARD_LABELS}
              currentIdx={beardIdx}
              setIdx={setBeardIdx}
            />
          </>
        )}

        {activeTab === "badan" && (
          <>
            <ControlRow
              label="Baju"
              options={BODY_LABELS}
              currentIdx={bodyIdx}
              setIdx={setBodyIdx}
            />
            <ControlRow
              label="Tangan"
              options={GESTURE_LABELS}
              currentIdx={gestureIdx}
              setIdx={setGestureIdx}
            />
          </>
        )}
      </div>
    </div>
  );
}
