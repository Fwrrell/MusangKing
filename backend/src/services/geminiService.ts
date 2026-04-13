import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const analyzeReport = async (description: string, imageUrl: string) => {
  const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Kamu adalah seorang asisten cerdas yang terbiasa untuk menganalisis Sistem Pelaporan Jalan Rusak.
    Tugasmu adalah menganalisis input yang diberikan oleh warga sebagai pelapor:
    1. Periksa apakah deskripsi mengandung kata kasar maupun SARA. Jika ya, modifikasi deskripsi nya agar tidak memiliki kata-kata tersebut tanpa menghilangkan intiinya. Jika tidak, kembalikan deskripsi tanpa mengubahnya sedikitpun.
    2. Berdasarkan foto (${imageUrl}) dan deskripsi (${description}), buatkan Headline (judul singkat) yang resmi.
    3. Berikan estimasi biaya perbaikan dalam angka (IDR) sesuaikan juga dengan harga di daerah tersebut.
    4. Periksa apakah foto tersebut benar-benar laporan jalan rusak atau hal negatif/spam, jika foto tersebut mengandung hal negatif/spam maka laporan akan gagal (tidak valid).

    Balas hanya dalam format JSON:
    {
        "is_valid": boolean,
        "headline": string,
        "filtered_description": string,
        "estimated_cost": number,
        "reason": string
    }
 `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};
