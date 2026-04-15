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
    Kamu adalah sistem validasi otomatis untuk Pelaporan Jalan Rusak tingkat kota/kabupaten.
    ATURAN MUTLAK VALIDASI GAMBAR:
    Laporan WAJIB ditolak ("is_valid": false) jika gambar terindikasi sebagai meme.
    Ciri-ciri meme yang HARUS ditolak:
    1. Terdapat teks berukuran besar/mencolok yang disematkan langsung di atas atau bawah gambar (image macro).
    2. Terdapat watermark lelucon, karakter kartun, atau stiker yang tidak relevan dengan foto pelaporan resmi.
    3. Teks dalam gambar mengandung konteks bercanda atau sarkasme.
    
    PENTING: Sekalipun gambar tersebut menampilkan jalan yang benar-benar rusak parah, JIKA ada satu saja elemen meme di atas, kamu HARUS merespon "is_valid": false dengan alasan "Gambar mengandung elemen meme/suntingan yang tidak resmi".
  `;

  // prompt untuk memvalidasi mengikuti rules
  const prompt = `
   Analisis laporan berikut:
    Deskripsi Pengguna: "${description}"

    Tugasmu:
    1. Filter Deskripsi: Periksa kata kasar/SARA. Jika ada, perhalus tanpa mengubah inti. Jika bersih, kembalikan apa adanya.
    2. Headline: Buatkan judul singkat yang resmi berdasarkan foto dan deskripsi.
    3. Estimasi: Berikan estimasi biaya perbaikan (IDR) dalam bentuk angka.
    4. Validasi: Tentukan apakah foto ini valid sesuai dengan aturan sistem.

    Balas HANYA dengan JSON murni tanpa markdown json:
    {
      "is_valid": boolean,
      "headline": string,
      "filtered_description": string,
      "estimated_cost": number,
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

      const rawText = response.text;

      console.log(rawText);
      return JSON.parse(rawText as string);
    } catch (error: any) {
      if (error.status === 503 && retries > 1) {
        console.log(
          `Server AI error (503). Retry... (Sisa percobaan: ${retries - 1})`,
        );
        // delay 2 detik
        await new Promise((resolve) => setTimeout(resolve, 2000));
        retries--;
      } else {
        console.error("Gemini AI Error:", error);
        throw error;
      }
    }
  }
};
