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
  const prompt = `
    Kamu adalah seorang asisten cerdas yang terbiasa untuk menganalisis Sistem Pelaporan Jalan Rusak.
    Tugasmu adalah menganalisis input yang diberikan oleh warga sebagai pelapor:
    1. Periksa apakah deskripsi mengandung kata kasar maupun SARA. Jika ya, modifikasi deskripsi nya agar tidak memiliki kata-kata tersebut tanpa menghilangkan intiinya. Jika tidak, kembalikan deskripsi tanpa mengubahnya sedikitpun.
    2. Berdasarkan foto dan deskripsi (${description}), buatkan Headline (judul singkat) yang resmi.
    3. Berikan estimasi biaya perbaikan dalam angka (IDR) sesuaikan juga dengan harga di daerah tersebut.
    4. Validasi apakah foto tersebut benar-benar laporan jalan rusak, hal negatif/spam, dan mengandung teks yang menghalangi foto laporan tersebut (termasuk teks berukuran besar dalam gambar yang terindikasi sebagai meme), jika foto tersebut mengandung hal-hal tersebut maka laporan akan gagal (tidak valid).

    Balas hanya dalam format JSON:
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
