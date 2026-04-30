import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

// ubah url Supabase menjadi format Base64
async function urlToBiner(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(buffer).toString("base64"),
      mimeType: response.headers.get("content-type") || "image/jpeg",
    },
  };
}

export const analyzeReport = async (description: string, imageUrl: string) => {
  // rules terpisah untuk validasi nya (roleplaying)
  const rules = `
    Kamu adalah sistem validasi otomatis dan Estimator Sipil untuk Pelaporan Infrastruktur Kota Bandung.
    
    ATURAN MUTLAK VALIDASI GAMBAR (is_valid):
    Laporan WAJIB ditolak ("is_valid": false) jika gambar terindikasi sebagai meme.
    Ciri-ciri meme yang HARUS ditolak:
    1. Terdapat teks berukuran besar/mencolok yang disematkan langsung di atas atau bawah gambar (image macro).
    2. Terdapat watermark lelucon, karakter kartun, atau stiker yang tidak relevan dengan foto pelaporan resmi.
    3. Teks dalam gambar mengandung konteks bercanda atau sarkasme.
    PENTING: Sekalipun gambar menampilkan jalan rusak parah, JIKA ada satu saja elemen meme di atas, respon "is_valid": false dengan alasan "Gambar mengandung elemen meme/suntingan".

    PEDOMAN HARGA & KONTEKS (KOTA BANDUNG):
    - UMR pekerja kasar: ~Rp 160.000 / hari
    - Harga aspal: ~Rp 150.000 / m2
    - Pengecoran beton: ~Rp 800.000 / m3
    - Pekerjaan ringan (tambal lubang, bersihkan drainase): Rp 500.000 - Rp 2.000.000
    - Pekerjaan sedang (jalan ambles sebagian, pohon tumbang): Rp 5.000.000 - Rp 25.000.000
    - Pekerjaan berat (jembatan putus, jalan longsor total): > Rp 100.000.000

    ESTIMASI KERUGIAN (Baseline & Residual):
    - Baseline Cost (Kerugian jika dibiarkan): Hitung potensi risiko kecelakaan, kemacetan, dan kerusakan melebar dalam Rupiah (HANYA ANGKA, misal: 5000000).
    - Residual Cost (Sisa kerugian setelah diperbaiki): Biasanya 10% - 20% dari Baseline Cost (HANYA ANGKA, misal: 1000000).

    ATURAN CRITICAL OVERRIDE (is_critical_rule):
    Set true JIKA DAN HANYA JIKA laporannya adalah:
    1. Jembatan putus
    2. Akses jalan terputus total (tidak bisa dilewati kendaraan darurat)
    3. Traffic light (lampu lalu lintas) mati di persimpangan utama.
    Selain itu, set false.
  `;

  // prompt untuk memvalidasi mengikuti rules
  const prompt = `
    Analisis laporan berikut:
    Deskripsi Pengguna: "${description}"

    Tugasmu:
    1. Filter Deskripsi: Periksa kata kasar/SARA. Jika ada, perhalus tanpa mengubah inti. Jika bersih, kembalikan apa adanya.
    2. Headline: Buatkan judul singkat yang resmi berdasarkan foto dan deskripsi.
    3. Validasi: Tentukan apakah foto ini valid sesuai aturan meme.
    4. Estimasi Biaya & Risiko: Berikan angka estimasi implementation_cost, baseline_cost, dan residual_cost (SEBAGAI ANGKA MURNI TANPA TITIK, KOMA, ATAU MATA UANG) berdasarkan foto dan panduan harga Bandung.
    5. Critical Rule: Tentukan apakah ini kasus kritis sesuai aturan.

    Balas HANYA dengan JSON murni:
    {
      "is_valid": boolean,
      "headline": string,
      "filtered_description": string,
      "baseline_cost": number,
      "residual_cost": number,
      "implementation_cost": number,
      "is_critical_rule": boolean,
      "reason": string
    }
  `;

  // gambar dari Supabase
  const imagePart = await urlToBiner(imageUrl);

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [prompt, imagePart],
        config: {
          systemInstruction: rules,
          responseMimeType: "application/json",
        },
      });

      let rawText = response.text || "{}";

      rawText = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(rawText);

      const extractNumber = (...keys: any[]) => {
        const foundValue = keys.find(
          (k) => k !== undefined && k !== null && k !== "",
        );
        if (foundValue === undefined) return 0;
        const cleaned = String(foundValue).replace(/[^0-9]/g, "");
        return Number(cleaned) || 0;
      };

      // Pastikan nilai cost adalah number, jika dikembalikan sebagai string oleh AI
      return {
        ...parsed,
        baseline_cost: extractNumber(
          parsed.baseline_cost,
          parsed.baselineCost,
          parsed.baseline,
        ),
        residual_cost: extractNumber(
          parsed.residual_cost,
          parsed.residualCost,
          parsed.residual,
        ),
        implementation_cost: extractNumber(
          parsed.implementation_cost,
          parsed.implementationCost,
          parsed.estimated_cost,
        ),
      };
    } catch (error: any) {
      if ((error.status === 503 || error.status === 429) && retries > 1) {
        const delayTime = error.status === 429 ? 20000 : 2000;

        console.log(
          `Gemini API Error (${error.status}). Menunggu ${delayTime / 1000} detik sebelum mencoba lagi... (Sisa percobaan: ${retries - 1})`,
        );
        // delay 2 detik
        await new Promise((resolve) => setTimeout(resolve, delayTime));
        retries--;
      } else {
        console.error("Gemini AI Error:", error);
        throw error;
      }
    }
  }
};
